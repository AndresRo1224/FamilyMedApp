# urls del CMS de atlas

from django.contrib.admin.views.decorators import staff_member_required
from django.urls import path

from .admin_views import AtlasCRUD


urlpatterns = [
    path(
        '',
        staff_member_required(AtlasCRUD.list_view),
        name='cms_atlas_list',
    ),
    path(
        'nuevo/',
        staff_member_required(AtlasCRUD.add_view),
        name='cms_atlas_add',
    ),
    path(
        'bulk/',
        staff_member_required(AtlasCRUD.bulk_action_view),
        name='cms_atlas_bulk',
    ),
    path(
        '<str:item_id>/editar/',
        staff_member_required(AtlasCRUD.change_view),
        name='cms_atlas_change',
    ),
    path(
        '<str:item_id>/preview/',
        staff_member_required(AtlasCRUD.preview_view),
        name='cms_atlas_preview',
    ),
    path(
        '<str:item_id>/eliminar/',
        staff_member_required(AtlasCRUD.delete_view),
        name='cms_atlas_delete',
    ),
]
