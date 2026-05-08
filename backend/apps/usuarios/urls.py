# rutas de la app usuarios

from django.urls import path

from .views import login, microsoft_login, perfil_actual, registro


urlpatterns = [
    # POST /api/auth/registro/  → crear cuenta nueva (estudiantes con email/password)
    path('registro/', registro, name='auth-registro'),

    # POST /api/auth/login/  → iniciar sesion con email + password
    path('login/', login, name='auth-login'),

    # POST /api/auth/microsoft/  → login con OAuth de Microsoft
    path('microsoft/', microsoft_login, name='auth-microsoft'),

    # GET /api/auth/me/  → perfil del usuario autenticado
    path('me/', perfil_actual, name='auth-me'),
]
