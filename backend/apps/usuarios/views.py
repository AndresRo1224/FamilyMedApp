# vistas de auth: registro + login con email y password

from datetime import datetime

from rest_framework import status
from rest_framework.decorators import api_view
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


@api_view(['POST'])
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

    if len(password) < 8:
        return Response(
            {'error': 'La password debe tener al menos 8 caracteres.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

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

    db = get_db()
    usuario = db.usuarios.find_one({'correo': correo})

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


@api_view(['GET'])
@jwt_required
def perfil_actual(request):
    """
    GET /api/auth/me/
    Header: Authorization: Bearer <jwt>
    Devuelve los datos del usuario logueado (refrescados desde mongo).
    """
    correo = request.user_jwt.get('correo')
    db = get_db()
    usuario = db.usuarios.find_one({'correo': correo})
    if not usuario:
        return Response(
            {'error': 'Usuario no encontrado'},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(UsuarioSerializer(usuario).data)
