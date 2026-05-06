# rutas raiz del proyecto

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # panel admin para gestionar contenido
    path('admin/', admin.site.urls),

    # api rest
    path('api/contenidos/', include('apps.contenidos.urls')),
    path('api/calculadoras/', include('apps.calculadoras.urls')),
    path('api/atlas/', include('apps.atlas.urls')),
    path('api/guias/', include('apps.guias.urls')),
    path('api/bibliografia/', include('apps.bibliografia.urls')),
]

# en desarrollo Django sirve los archivos subidos directamente
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
