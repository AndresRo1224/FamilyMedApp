# rutas de la app usuarios

from django.urls import path

from .views import cambiar_password, login, perfil_actual, registro


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
]
