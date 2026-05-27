# rutas raiz del proyecto

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # CMS embebido en el admin (urls antes que admin/ para evitar conflictos)
    path('admin/dashboard/', include('apps.cms.admin_urls')),
    path('admin/contenidos/', include('apps.contenidos.admin_urls')),
    path('admin/calculadoras/', include('apps.calculadoras.admin_urls')),
    path('admin/atlas/', include('apps.atlas.admin_urls')),
    path('admin/guias/', include('apps.guias.admin_urls')),
    path('admin/bibliografia/', include('apps.bibliografia.admin_urls')),
    path('admin/usuarios-app/', include('apps.usuarios.admin_urls')),

    # panel admin
    path('admin/', admin.site.urls),

    # api rest
    path('api/auth/', include('apps.usuarios.urls')),
    path('api/contenidos/', include('apps.contenidos.urls')),
    path('api/calculadoras/', include('apps.calculadoras.urls')),
    path('api/atlas/', include('apps.atlas.urls')),
    path('api/guias/', include('apps.guias.urls')),
    path('api/bibliografia/', include('apps.bibliografia.urls')),
]

# en desarrollo Django sirve los archivos subidos directamente
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
