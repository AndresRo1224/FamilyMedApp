# vistas de auth: registro + login con email y password

import re
from datetime import datetime

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
from .throttles import LoginRateThrottle, RegistroRateThrottle


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
