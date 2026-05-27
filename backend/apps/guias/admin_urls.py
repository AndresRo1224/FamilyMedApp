# urls del CMS de guias

from django.contrib.admin.views.decorators import staff_member_required
from django.urls import path

from .admin_views import GuiaCRUD


urlpatterns = [
    path(
        '',
        staff_member_required(GuiaCRUD.list_view),
        name='cms_guias_list',
    ),
    path(
        'nuevo/',
        staff_member_required(GuiaCRUD.add_view),
        name='cms_guias_add',
    ),
    path(
        'bulk/',
        staff_member_required(GuiaCRUD.bulk_action_view),
        name='cms_guias_bulk',
    ),
    path(
        '<str:item_id>/editar/',
        staff_member_required(GuiaCRUD.change_view),
        name='cms_guias_change',
    ),
    path(
        '<str:item_id>/preview/',
        staff_member_required(GuiaCRUD.preview_view),
        name='cms_guias_preview',
    ),
    path(
        '<str:item_id>/eliminar/',
        staff_member_required(GuiaCRUD.delete_view),
        name='cms_guias_delete',
    ),
]
