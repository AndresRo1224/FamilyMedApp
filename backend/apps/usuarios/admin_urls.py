# urls del CMS de usuarios de la app
# protegido a nivel URL: solo superusers pueden entrar (no docentes)

from django.contrib.auth.decorators import user_passes_test
from django.urls import path

from .admin_views import UsuarioAppCRUD


def superuser_required(view_func):
    # docentes (is_staff sin is_superuser) reciben 403 si tocan estas urls
    return user_passes_test(lambda u: u.is_active and u.is_superuser)(view_func)


urlpatterns = [
    path(
        '',
        superuser_required(UsuarioAppCRUD.list_view),
        name='cms_usuarios_app_list',
    ),
    path(
        '<str:item_id>/editar/',
        superuser_required(UsuarioAppCRUD.change_view),
        name='cms_usuarios_app_change',
    ),
    path(
        '<str:item_id>/eliminar/',
        superuser_required(UsuarioAppCRUD.delete_view),
        name='cms_usuarios_app_delete',
    ),
]
