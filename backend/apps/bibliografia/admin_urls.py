# urls del CMS de bibliografia

from django.contrib.admin.views.decorators import staff_member_required
from django.urls import path

from .admin_views import BibliografiaCRUD


urlpatterns = [
    path(
        '',
        staff_member_required(BibliografiaCRUD.list_view),
        name='cms_bibliografia_list',
    ),
    path(
        'nuevo/',
        staff_member_required(BibliografiaCRUD.add_view),
        name='cms_bibliografia_add',
    ),
    path(
        'bulk/',
        staff_member_required(BibliografiaCRUD.bulk_action_view),
        name='cms_bibliografia_bulk',
    ),
    path(
        '<str:item_id>/editar/',
        staff_member_required(BibliografiaCRUD.change_view),
        name='cms_bibliografia_change',
    ),
    path(
        '<str:item_id>/preview/',
        staff_member_required(BibliografiaCRUD.preview_view),
        name='cms_bibliografia_preview',
    ),
    path(
        '<str:item_id>/eliminar/',
        staff_member_required(BibliografiaCRUD.delete_view),
        name='cms_bibliografia_delete',
    ),
]
