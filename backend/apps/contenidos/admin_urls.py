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
        'bulk/',
        staff_member_required(ContenidoCRUD.bulk_action_view),
        name='cms_contenidos_bulk',
    ),
    path(
        '<str:item_id>/editar/',
        staff_member_required(ContenidoCRUD.change_view),
        name='cms_contenidos_change',
    ),
    path(
        '<str:item_id>/preview/',
        staff_member_required(ContenidoCRUD.preview_view),
        name='cms_contenidos_preview',
    ),
    path(
        '<str:item_id>/eliminar/',
        staff_member_required(ContenidoCRUD.delete_view),
        name='cms_contenidos_delete',
    ),
]
