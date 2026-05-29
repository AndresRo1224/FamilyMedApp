# vistas de auth: registro + login con email y password

import re
import secrets
from datetime import datetime, timedelta

from django.conf import settings
from django.core.mail import send_mail
from pymongo.errors import PyMongoError
from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response

from familymed.db import get_db

from .auth_helpers import (
    correo_es_permitido,
    generar_jwt,
    hashear_password,
    jwt_required,
    verificar_password,
)
from .serializers import UsuarioSerializer
from .throttles import (
    LoginRateThrottle,
    RegistroRateThrottle,
    ResetConfirmarThrottle,
    ResetSolicitarThrottle,
)


# regex simple para validar formato de correo
EMAIL_REGEX = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

# limites de longitud para evitar payloads gigantes
MAX_NOMBRE = 120
MAX_PASSWORD = 128
MAX_CORREO = 254


@api_view(['POST'])
@throttle_classes([RegistroRateThrottle])
def registro(request):
    """
    POST /api/auth/registro/
    Body: { correo, password, nombre_completo }
    Crea un usuario nuevo con rol=estudiante.
    """
    correo = (request.data.get('correo') or '').strip().lower()
    password = request.data.get('password') or ''
    nombre = (request.data.get('nombre_completo') or '').strip()

    # validaciones basicas
    if not correo or not password or not nombre:
        return Response(
            {'error': 'Faltan datos: correo, password y nombre son obligatorios.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # limites de longitud (evita payloads gigantes)
    if len(correo) > MAX_CORREO or len(nombre) > MAX_NOMBRE:
        return Response(
            {'error': 'Correo o nombre demasiado largos.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # formato de correo
    if not EMAIL_REGEX.match(correo):
        return Response(
            {'error': 'El correo no tiene un formato válido.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not correo_es_permitido(correo):
        return Response(
            {
                'error': (
                    'Solo se aceptan correos Microsoft '
                    '(@outlook.com, @hotmail.com, @live.com) o '
                    'institucionales UDES (@udes.edu.co).'
                ),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(password) < 8 or len(password) > MAX_PASSWORD:
        return Response(
            {'error': 'La password debe tener entre 8 y 128 caracteres.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        db = get_db()

        # verificar que el correo no esté registrado
        existente = db.usuarios.find_one({'correo': correo})
        if existente is not None:
            return Response(
                {'error': 'Ya existe una cuenta con ese correo.'},
                status=status.HTTP_409_CONFLICT,
            )

        # crear el usuario
        nuevo = {
            'correo': correo,
            'clave_hash': hashear_password(password),
            'nombre_completo': nombre,
            'cedula': '',
            'rol': 'estudiante',
            'institucion': '',
            'codigo_programa': '',
            'activo': True,
            'creado_en': datetime.utcnow(),
        }
        result = db.usuarios.insert_one(nuevo)
        nuevo['_id'] = result.inserted_id
    except PyMongoError:
        return Response(
            {'error': 'No se pudo conectar con la base de datos. Intenta más tarde.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    # genera el JWT y lo devuelve junto al usuario
    token = generar_jwt(
        user_id=nuevo['_id'],
        correo=nuevo['correo'],
        rol=nuevo['rol'],
        nombre=nuevo['nombre_completo'],
    )

    return Response(
        {'jwt': token, 'usuario': UsuarioSerializer(nuevo).data},
        status=status.HTTP_201_CREATED,
    )


@api_view(['POST'])
@throttle_classes([LoginRateThrottle])
def login(request):
    """
    POST /api/auth/login/
    Body: { correo, password }
    Verifica credenciales y devuelve JWT.
    """
    correo = (request.data.get('correo') or '').strip().lower()
    password = request.data.get('password') or ''

    if not correo or not password:
        return Response(
            {'error': 'Faltan datos: correo y password son obligatorios.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        db = get_db()
        usuario = db.usuarios.find_one({'correo': correo})
    except PyMongoError:
        return Response(
            {'error': 'No se pudo conectar con la base de datos. Intenta más tarde.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    # mensaje generico para no filtrar si el correo existe o no
    if usuario is None or not verificar_password(
        password, usuario.get('clave_hash', ''),
    ):
        return Response(
            {'error': 'Correo o password incorrectos.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    if not usuario.get('activo', True):
        return Response(
            {'error': 'Tu cuenta está inactiva. Contacta al administrador.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    token = generar_jwt(
        user_id=usuario['_id'],
        correo=usuario['correo'],
        rol=usuario.get('rol', 'estudiante'),
        nombre=usuario.get('nombre_completo', ''),
    )

    return Response({
        'jwt': token,
        'usuario': UsuarioSerializer(usuario).data,
    })


@api_view(['GET', 'PATCH'])
@jwt_required
def perfil_actual(request):
    """
    GET /api/auth/me/    → devuelve el perfil del usuario logueado
    PATCH /api/auth/me/  → actualiza campos editables (nombre, cedula, institucion, codigo)
    Header: Authorization: Bearer <jwt>
    """
    correo = request.user_jwt.get('correo')

    if request.method == 'PATCH':
        # campos editables y sus limites de longitud
        permitidos = {
            'nombre_completo': MAX_NOMBRE,
            'cedula': 30,
            'institucion': 200,
            'codigo_programa': 50,
        }
        cambios = {}
        for campo, max_len in permitidos.items():
            if campo in request.data:
                valor = (request.data.get(campo) or '').strip()
                if len(valor) > max_len:
                    return Response(
                        {'error': f'El campo {campo} es demasiado largo.'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                cambios[campo] = valor

        if not cambios:
            return Response(
                {'error': 'No se enviaron campos para actualizar.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if 'nombre_completo' in cambios and not cambios['nombre_completo']:
            return Response(
                {'error': 'El nombre no puede quedar vacío.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            db = get_db()
            usuario = db.usuarios.find_one_and_update(
                {'correo': correo},
                {'$set': cambios},
                return_document=True,
            )
        except PyMongoError:
            return Response(
                {'error': 'No se pudo conectar con la base de datos.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if not usuario:
            return Response(
                {'error': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(UsuarioSerializer(usuario).data)

    # GET
    try:
        db = get_db()
        usuario = db.usuarios.find_one({'correo': correo})
    except PyMongoError:
        return Response(
            {'error': 'No se pudo conectar con la base de datos.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )
    if not usuario:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(UsuarioSerializer(usuario).data)


@api_view(['POST'])
@jwt_required
def cambiar_password(request):
    """
    POST /api/auth/cambiar-password/
    Header: Authorization: Bearer <jwt>
    Body: { password_actual, password_nueva }
    Requiere la contraseña actual para confirmar identidad.
    """
    correo = request.user_jwt.get('correo')
    password_actual = request.data.get('password_actual') or ''
    password_nueva = request.data.get('password_nueva') or ''

    if not password_actual or not password_nueva:
        return Response(
            {'error': 'Debes enviar password_actual y password_nueva.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(password_nueva) < 8 or len(password_nueva) > MAX_PASSWORD:
        return Response(
            {'error': 'La nueva contraseña debe tener entre 8 y 128 caracteres.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if password_actual == password_nueva:
        return Response(
            {'error': 'La nueva contraseña debe ser diferente a la actual.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        db = get_db()
        usuario = db.usuarios.find_one({'correo': correo})
    except PyMongoError:
        return Response(
            {'error': 'No se pudo conectar con la base de datos.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    if not usuario:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND,
        )

    if not verificar_password(password_actual, usuario.get('clave_hash', '')):
        return Response(
            {'error': 'La contraseña actual es incorrecta.'},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    try:
        db.usuarios.update_one(
            {'correo': correo},
            {'$set': {'clave_hash': hashear_password(password_nueva)}},
        )
    except PyMongoError:
        return Response(
            {'error': 'No se pudo guardar la contraseña.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    return Response({'mensaje': 'Contraseña actualizada correctamente.'})


# =================== recuperacion de contraseña (olvide mi clave) ===================

def _generar_codigo():
    # codigo de 6 digitos aleatorio y seguro (100000 - 999999)
    return f'{secrets.randbelow(900000) + 100000:06d}'


def _enviar_codigo_email(correo, codigo):
    # manda el codigo por correo. en dev (console backend) sale en los logs.
    asunto = 'Código de recuperación · FamilyMed UDES'
    cuerpo = (
        f'Hola,\n\n'
        f'Tu código para restablecer la contraseña de FamilyMed es:\n\n'
        f'    {codigo}\n\n'
        f'Este código vence en {settings.PASSWORD_RESET_CODE_TTL_MIN} minutos. '
        f'Si no solicitaste el cambio, ignora este correo.\n\n'
        f'Universidad de Santander · FamilyMed'
    )
    send_mail(
        asunto,
        cuerpo,
        settings.DEFAULT_FROM_EMAIL,
        [correo],
        fail_silently=False,
    )


@api_view(['POST'])
@throttle_classes([ResetSolicitarThrottle])
def solicitar_reset(request):
    """
    POST /api/auth/solicitar-reset/
    Body: { correo }
    Genera un codigo de 6 digitos, lo guarda con expiracion y lo envia por email.
    Responde siempre lo mismo para no revelar si el correo existe.
    """
    correo = (request.data.get('correo') or '').strip().lower()

    # respuesta generica que damos siempre (no filtra si el correo existe)
    respuesta_ok = Response({
        'mensaje': (
            'Si el correo está registrado, te enviamos un código de '
            'recuperación. Revisa tu bandeja de entrada.'
        ),
    })

    if not correo or not EMAIL_REGEX.match(correo):
        # no revelamos nada, pero tampoco hacemos trabajo de mas
        return respuesta_ok

    try:
        db = get_db()
        usuario = db.usuarios.find_one({'correo': correo})
        # solo si el usuario existe y esta activo generamos el codigo
        if usuario is not None and usuario.get('activo', True):
            codigo = _generar_codigo()
            expira = datetime.utcnow() + timedelta(
                minutes=settings.PASSWORD_RESET_CODE_TTL_MIN,
            )
            # upsert: un solo codigo vigente por correo
            db.password_resets.update_one(
                {'correo': correo},
                {'$set': {
                    'correo': correo,
                    'codigo_hash': hashear_password(codigo),
                    'expira_en': expira,
                    'intentos': 0,
                    'creado_en': datetime.utcnow(),
                }},
                upsert=True,
            )
            try:
                _enviar_codigo_email(correo, codigo)
            except Exception:
                # si el envio falla (SMTP mal configurado), no revelamos el detalle
                return Response(
                    {'error': 'No se pudo enviar el correo. Intenta más tarde.'},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )
    except PyMongoError:
        return Response(
            {'error': 'No se pudo conectar con la base de datos. Intenta más tarde.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    return respuesta_ok


@api_view(['POST'])
@throttle_classes([ResetConfirmarThrottle])
def confirmar_reset(request):
    """
    POST /api/auth/confirmar-reset/
    Body: { correo, codigo, password_nueva }
    Valida el codigo (no expirado, con intentos limitados) y cambia la contraseña.
    """
    correo = (request.data.get('correo') or '').strip().lower()
    codigo = (request.data.get('codigo') or '').strip()
    password_nueva = request.data.get('password_nueva') or ''

    if not correo or not codigo or not password_nueva:
        return Response(
            {'error': 'Faltan datos: correo, código y nueva contraseña.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(password_nueva) < 8 or len(password_nueva) > MAX_PASSWORD:
        return Response(
            {'error': 'La nueva contraseña debe tener entre 8 y 128 caracteres.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        db = get_db()
        reset = db.password_resets.find_one({'correo': correo})
    except PyMongoError:
        return Response(
            {'error': 'No se pudo conectar con la base de datos. Intenta más tarde.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    # mensaje generico para codigo invalido/expirado
    error_codigo = Response(
        {'error': 'El código es inválido o expiró. Solicita uno nuevo.'},
        status=status.HTTP_400_BAD_REQUEST,
    )

    if reset is None:
        return error_codigo

    # expirado?
    expira_en = reset.get('expira_en')
    if not expira_en or datetime.utcnow() > expira_en:
        db.password_resets.delete_one({'correo': correo})
        return error_codigo

    # demasiados intentos?
    if reset.get('intentos', 0) >= settings.PASSWORD_RESET_MAX_ATTEMPTS:
        db.password_resets.delete_one({'correo': correo})
        return Response(
            {'error': 'Demasiados intentos fallidos. Solicita un código nuevo.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )

    # codigo correcto?
    if not verificar_password(codigo, reset.get('codigo_hash', '')):
        db.password_resets.update_one(
            {'correo': correo},
            {'$inc': {'intentos': 1}},
        )
        return error_codigo

    # todo bien: cambiar la contraseña y borrar el codigo
    try:
        db.usuarios.update_one(
            {'correo': correo},
            {'$set': {'clave_hash': hashear_password(password_nueva)}},
        )
        db.password_resets.delete_one({'correo': correo})
    except PyMongoError:
        return Response(
            {'error': 'No se pudo guardar la contraseña.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    return Response({'mensaje': 'Tu contraseña fue restablecida. Ya puedes iniciar sesión.'})
