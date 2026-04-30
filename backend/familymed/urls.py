# rutas raiz del proyecto

from django.contrib import admin
from django.urls import path

urlpatterns = [
    # panel admin para gestionar contenido
    path('admin/', admin.site.urls),
]
