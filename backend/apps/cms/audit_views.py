# vista de auditoria del CMS (lista de cambios recientes)

from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render

from familymed.audit import (
    ACTION_COLORS,
    ACTION_ICONS,
    ACTION_LABELS,
    fetch_recent,
)


@staff_member_required
def audit_view(request):
    """muestra las ultimas N acciones del audit_log"""
    collection_filter = request.GET.get('collection', '').strip()

    entries = fetch_recent(
        limit=200,
        collection=collection_filter or None,
    )

    # enrichment
    for e in entries:
        e['action_label'] = ACTION_LABELS.get(e['action'], e['action'])
        e['action_icon'] = ACTION_ICONS.get(e['action'], 'fas fa-edit')
        e['action_color'] = ACTION_COLORS.get(e['action'], '#2563eb')

    # colecciones disponibles para filtrar (hardcoded para no contar Mongo)
    collections_available = [
        ('contenidos', 'Contenidos'),
        ('calculadoras', 'Calculadoras'),
        ('atlas_imagenes', 'Atlas'),
        ('guias', 'Guías'),
        ('bibliografia', 'Bibliografía'),
        ('usuarios', 'Usuarios'),
    ]

    return render(request, 'cms/audit.html', {
        'title': 'Auditoría',
        'sidebar_section': 'CMS',
        'entries': entries,
        'collection_filter': collection_filter,
        'collections_available': collections_available,
    })
