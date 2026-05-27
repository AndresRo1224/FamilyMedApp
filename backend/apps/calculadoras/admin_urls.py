# urls del CMS de calculadoras

from django.contrib.admin.views.decorators import staff_member_required
from django.urls import path

from .admin_views import CalculadoraCRUD


urlpatterns = [
    path(
        '',
        staff_member_required(CalculadoraCRUD.list_view),
        name='cms_calculadoras_list',
    ),
    path(
        'nuevo/',
        staff_member_required(CalculadoraCRUD.add_view),
        name='cms_calculadoras_add',
    ),
    path(
        'bulk/',
        staff_member_required(CalculadoraCRUD.bulk_action_view),
        name='cms_calculadoras_bulk',
    ),
    path(
        '<str:item_id>/editar/',
        staff_member_required(CalculadoraCRUD.change_view),
        name='cms_calculadoras_change',
    ),
    path(
        '<str:item_id>/preview/',
        staff_member_required(CalculadoraCRUD.preview_view),
        name='cms_calculadoras_preview',
    ),
    path(
        '<str:item_id>/eliminar/',
        staff_member_required(CalculadoraCRUD.delete_view),
        name='cms_calculadoras_delete',
    ),
]
