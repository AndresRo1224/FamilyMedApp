# helpers para hash de passwords (bcrypt) + JWT propio + validacion Microsoft OAuth

from datetime import datetime, timedelta, timezone
from functools import wraps

import bcrypt
import jwt
import requests
from django.conf import settings
from rest_framework import status
from rest_framework.response import Response


# dominios de correo aceptados para registro
DOMINIOS_PERMITIDOS = (
    'outlook.com',
    'hotmail.com',
    'live.com',
    'udes.edu.co',
)


def correo_es_permitido(correo):
    # valida que el correo sea de un dominio Microsoft o UDES
    if not correo or '@' not in correo:
        return False
    dominio = correo.lower().split('@')[-1]
    return dominio in DOMINIOS_PERMITIDOS


def hashear_password(password):
    # devuelve el hash bcrypt como string
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verificar_password(password, hash_guardado):
    # compara una password en texto plano con el hash guardado
    if not password or not hash_guardado:
        return False
    try:
        return bcrypt.checkpw(
            password.encode('utf-8'),
            hash_guardado.encode('utf-8'),
        )
    except (ValueError, TypeError):
        return False


def generar_jwt(user_id, correo, rol, nombre):
    # arma un JWT propio que la app guarda
    now = datetime.now(timezone.utc)
    payload = {
        'user_id': str(user_id),
        'correo': correo,
        'rol': rol,
        'nombre': nombre,
        'iat': now,
        'exp': now + timedelta(days=settings.JWT_LIFETIME_DAYS),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def decodificar_jwt(token):
    # devuelve el payload o None si el token es invalido/expirado
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def validar_token_microsoft(access_token):
    # llama a Microsoft Graph para verificar el token y traer datos del usuario
    try:
        r = requests.get(
            'https://graph.microsoft.com/v1.0/me',
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=10,
        )
        if r.status_code == 200:
            return r.json()
        return None
    except requests.RequestException:
        return None


def jwt_required(view_func):
    # decorator para proteger endpoints que requieren login
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return Response(
                {'error': 'Falta el token'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token = auth_header[7:]
        payload = decodificar_jwt(token)
        if not payload:
            return Response(
                {'error': 'Token inválido o expirado'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        request.user_jwt = payload
        return view_func(request, *args, **kwargs)
    return wrapper
