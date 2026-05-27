"""
auditoria de acciones del CMS
guarda quien hizo que en una coleccion mongo 'audit_log'
"""

from datetime import datetime

from familymed.db import get_db


# acciones soportadas
ACTION_CREATE = 'create'
ACTION_UPDATE = 'update'
ACTION_DELETE = 'delete'
ACTION_BULK_PUBLISH = 'bulk_publish'
ACTION_BULK_UNPUBLISH = 'bulk_unpublish'
ACTION_BULK_DELETE = 'bulk_delete'


def log_action(user, action, collection, item_id=None, label='', count=1, extra=None):
    """
    registra una accion en la coleccion audit_log
    user: request.user (django User)
    action: una de ACTION_*
    collection: 'contenidos', 'guias', etc.
    item_id: ObjectId o str del item afectado (puede ser None para bulk)
    label: titulo legible del item (para mostrar despues sin tener que ir a buscarlo)
    count: cuantos items afectados (para bulk)
    extra: dict opcional con info adicional
    """
    try:
        db = get_db()
        entry = {
            'username': getattr(user, 'username', 'anonimo'),
            'user_full': getattr(user, 'get_full_name', lambda: '')() or getattr(user, 'username', ''),
            'action': action,
            'collection': collection,
            'item_id': str(item_id) if item_id else None,
            'label': label,
            'count': count,
            'timestamp': datetime.utcnow(),
        }
        if extra:
            entry['extra'] = extra
        db.audit_log.insert_one(entry)
    except Exception:
        # auditoria nunca debe romper la operacion principal
        pass


def fetch_recent(limit=100, collection=None):
    """lee las ultimas N entradas del log (mas recientes primero)"""
    try:
        db = get_db()
        query = {}
        if collection:
            query['collection'] = collection
        cursor = db.audit_log.find(query).sort('timestamp', -1).limit(limit)
        return list(cursor)
    except Exception:
        return []


# etiqueta legible por accion para mostrar en UI
ACTION_LABELS = {
    ACTION_CREATE: 'Creó',
    ACTION_UPDATE: 'Editó',
    ACTION_DELETE: 'Eliminó',
    ACTION_BULK_PUBLISH: 'Publicó (masivo)',
    ACTION_BULK_UNPUBLISH: 'Despublicó (masivo)',
    ACTION_BULK_DELETE: 'Eliminó (masivo)',
}

# icono FA por accion
ACTION_ICONS = {
    ACTION_CREATE: 'fas fa-plus-circle',
    ACTION_UPDATE: 'fas fa-edit',
    ACTION_DELETE: 'fas fa-trash',
    ACTION_BULK_PUBLISH: 'fas fa-check-double',
    ACTION_BULK_UNPUBLISH: 'fas fa-eye-slash',
    ACTION_BULK_DELETE: 'fas fa-trash-alt',
}

# color por accion (para badges)
ACTION_COLORS = {
    ACTION_CREATE: '#059669',
    ACTION_UPDATE: '#2563eb',
    ACTION_DELETE: '#dc2626',
    ACTION_BULK_PUBLISH: '#059669',
    ACTION_BULK_UNPUBLISH: '#d97706',
    ACTION_BULK_DELETE: '#dc2626',
}
