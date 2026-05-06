# urls del CMS de contenidos

from django.contrib.admin.views.decorators import staff_member_required
from django.urls import path

from .admin_views import ContenidoCRUD


urlpatterns = [
    path(
        '',
        staff_member_required(ContenidoCRUD.list_view),
        name='cms_contenidos_list',
    ),
    path(
        'nuevo/',
        staff_member_required(ContenidoCRUD.add_view),
        name='cms_contenidos_add',
    ),
    path(
        '<str:item_id>/editar/',
        staff_member_required(ContenidoCRUD.change_view),
        name='cms_contenidos_change',
    ),
    path(
        '<str:item_id>/eliminar/',
        staff_member_required(ContenidoCRUD.delete_view),
        name='cms_contenidos_delete',
    ),
]
