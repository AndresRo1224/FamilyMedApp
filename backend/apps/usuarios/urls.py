# rutas de la app usuarios

from django.urls import path

from .views import (
    cambiar_password,
    confirmar_reset,
    login,
    perfil_actual,
    registro,
    solicitar_reset,
)


urlpatterns = [
    # POST /api/auth/registro/  → crear cuenta nueva (estudiantes con email/password)
    path('registro/', registro, name='auth-registro'),

    # POST /api/auth/login/  → iniciar sesion con email + password
    path('login/', login, name='auth-login'),

    # GET  /api/auth/me/  → perfil del usuario autenticado
    # PATCH /api/auth/me/ → actualiza nombre, cedula, institucion, codigo_programa
    path('me/', perfil_actual, name='auth-me'),

    # POST /api/auth/cambiar-password/  → cambia la contraseña (requiere la actual)
    path('cambiar-password/', cambiar_password, name='auth-cambiar-password'),

    # POST /api/auth/solicitar-reset/  → envia codigo de recuperacion al correo
    path('solicitar-reset/', solicitar_reset, name='auth-solicitar-reset'),

    # POST /api/auth/confirmar-reset/  → valida codigo y cambia la contraseña
    path('confirmar-reset/', confirmar_reset, name='auth-confirmar-reset'),
]
