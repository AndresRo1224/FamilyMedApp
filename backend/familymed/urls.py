# rutas raiz del proyecto

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # panel admin para gestionar contenido
    path('admin/', admin.site.urls),

    # api rest
    path('api/contenidos/', include('apps.contenidos.urls')),
]
