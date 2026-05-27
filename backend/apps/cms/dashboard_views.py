# vistas del dashboard del CMS (metricas + ultimos cambios + grafico)

from collections import Counter
from datetime import datetime, timedelta

from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render

from familymed.audit import (
    ACTION_COLORS,
    ACTION_ICONS,
    ACTION_LABELS,
    fetch_recent,
)
from familymed.db import get_db


# config de cada coleccion para el dashboard
COLLECTIONS = [
    {
        'key': 'contenidos',
        'collection': 'contenidos',
        'title': 'Contenidos',
        'icon': 'fas fa-book-open',
        'list_url': 'cms_contenidos_list',
        'change_url': 'cms_contenidos_change',
        'has_estado': True,
        'title_field': 'titulo',
    },
    {
        'key': 'calculadoras',
        'collection': 'calculadoras',
        'title': 'Calculadoras',
        'icon': 'fas fa-calculator',
        'list_url': 'cms_calculadoras_list',
        'change_url': 'cms_calculadoras_change',
        'has_estado': False,
        'title_field': 'nombre',
    },
    {
        'key': 'atlas',
        'collection': 'atlas_imagenes',
        'title': 'Atlas',
        'icon': 'fas fa-images',
        'list_url': 'cms_atlas_list',
        'change_url': 'cms_atlas_change',
        'has_estado': False,
        'title_field': 'titulo',
    },
    {
        'key': 'guias',
        'collection': 'guias',
        'title': 'Guías',
        'icon': 'fas fa-clipboard-list',
        'list_url': 'cms_guias_list',
        'change_url': 'cms_guias_change',
        'has_estado': False,
        'title_field': 'titulo',
    },
    {
        'key': 'bibliografia',
        'collection': 'bibliografia',
        'title': 'Bibliografía',
        'icon': 'fas fa-bookmark',
        'list_url': 'cms_bibliografia_list',
        'change_url': 'cms_bibliografia_change',
        'has_estado': False,
        'title_field': 'titulo',
    },
]


def _compute_views_weekly(db):
    """
    aproxima vistas semanales sumando 'vistas' de items creados cada semana
    no es perfecto (no sabemos cuando se vio), pero da una idea de tendencia
    """
    now = datetime.utcnow()
    weeks = 8
    labels = []
    data = []
    for i in range(weeks - 1, -1, -1):
        week_end = now - timedelta(days=i * 7)
        week_start = week_end - timedelta(days=7)
        labels.append(week_end.strftime('%d/%m'))

        total = 0
        for cfg in COLLECTIONS:
            try:
                cursor = db[cfg['collection']].find({
                    'creado_en': {'$gte': week_start, '$lt': week_end},
                })
                for doc in cursor:
                    total += doc.get('vistas', 0)
            except Exception:
                pass
        data.append(total)
    return labels, data


@staff_member_required
def dashboard_view(request):
    """vista principal del dashboard CMS"""
    db = get_db()

    # totales por coleccion
    stats = []
    for cfg in COLLECTIONS:
        try:
            total = db[cfg['collection']].count_documents({})
        except Exception:
            total = 0

        detail = ''
        if cfg['has_estado']:
            try:
                pub = db[cfg['collection']].count_documents({'estado': 'publicado'})
                detail = f'{pub} publicados'
            except Exception:
                pass

        stats.append({
            **cfg,
            'total': total,
            'detail': detail,
        })

    # usuarios de la app
    try:
        users_total = db.usuarios.count_documents({})
        users_activos = db.usuarios.count_documents({'activo': True})
    except Exception:
        users_total = 0
        users_activos = 0

    # top 5 mas vistos (de todas las colecciones que tengan 'vistas')
    top_vistos = []
    for cfg in COLLECTIONS:
        try:
            cursor = db[cfg['collection']].find(
                {'vistas': {'$gt': 0}},
            ).sort('vistas', -1).limit(5)
            for doc in cursor:
                top_vistos.append({
                    'title': doc.get(cfg['title_field']) or doc.get('nombre') or '?',
                    'kind': cfg['title'],
                    'icon': cfg['icon'],
                    'vistas': doc.get('vistas', 0),
                    'change_url_name': cfg['change_url'],
                    'item_id': str(doc.get('_id')),
                })
        except Exception:
            continue
    # ordena por vistas globalmente y toma top 5
    top_vistos.sort(key=lambda x: -x['vistas'])
    top_vistos = top_vistos[:5]

    # ultimos 10 items creados (cualquier coleccion)
    recientes = []
    for cfg in COLLECTIONS:
        try:
            cursor = db[cfg['collection']].find().sort('creado_en', -1).limit(5)
            for doc in cursor:
                recientes.append({
                    'title': doc.get(cfg['title_field']) or doc.get('nombre') or '?',
                    'kind': cfg['title'],
                    'icon': cfg['icon'],
                    'creado_en': doc.get('creado_en'),
                    'change_url_name': cfg['change_url'],
                    'item_id': str(doc.get('_id')),
                })
        except Exception:
            continue
    recientes = [r for r in recientes if r['creado_en']]
    recientes.sort(key=lambda x: x['creado_en'], reverse=True)
    recientes = recientes[:8]

    # ultimas acciones del audit log
    audit_recent = fetch_recent(limit=8)
    for e in audit_recent:
        e['action_label'] = ACTION_LABELS.get(e['action'], e['action'])
        e['action_icon'] = ACTION_ICONS.get(e['action'], 'fas fa-edit')
        e['action_color'] = ACTION_COLORS.get(e['action'], '#2563eb')

    # grafico de vistas semanales
    chart_labels, chart_data = _compute_views_weekly(db)

    # distribucion por modulo (para grafico de torta)
    pie_labels = [s['title'] for s in stats]
    pie_data = [s['total'] for s in stats]

    return render(request, 'cms/dashboard.html', {
        'title': 'Dashboard',
        'sidebar_section': 'CMS',
        'stats': stats,
        'users_total': users_total,
        'users_activos': users_activos,
        'top_vistos': top_vistos,
        'recientes': recientes,
        'audit_recent': audit_recent,
        'chart_labels': chart_labels,
        'chart_data': chart_data,
        'pie_labels': pie_labels,
        'pie_data': pie_data,
    })
