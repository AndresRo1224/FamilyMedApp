# helpers para el CMS embebido en el admin de django

from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import reverse

from familymed.audit import (
    ACTION_BULK_DELETE,
    ACTION_BULK_PUBLISH,
    ACTION_BULK_UNPUBLISH,
    ACTION_CREATE,
    ACTION_DELETE,
    ACTION_UPDATE,
    log_action,
)
from familymed.db import get_db


# cuantos items por pagina en los listados
PAGE_SIZE = 25


def split_lines(text):
    # convierte un textarea (un item por linea) en lista
    if not text:
        return []
    return [line.strip() for line in text.split('\n') if line.strip()]


def split_csv(text):
    # convierte un input separado por comas en lista
    if not text:
        return []
    return [tag.strip() for tag in text.split(',') if tag.strip()]


def join_lines(items):
    # lo opuesto a split_lines, para llenar el form al editar
    if not items:
        return ''
    return '\n'.join(items)


def join_csv(items):
    if not items:
        return ''
    return ', '.join(items)


def paginate(items, page, page_size=PAGE_SIZE):
    """divide una lista en paginas y devuelve metadatos"""
    total = len(items)
    total_pages = max(1, (total + page_size - 1) // page_size)
    page = max(1, min(page, total_pages))
    start = (page - 1) * page_size
    end = start + page_size
    return {
        'items': items[start:end],
        'page': page,
        'total_pages': total_pages,
        'total_items': total,
        'has_prev': page > 1,
        'has_next': page < total_pages,
        'prev_page': page - 1,
        'next_page': page + 1,
        # rango compacto para botones: 5 paginas alrededor de la actual
        'pages_range': list(range(
            max(1, page - 2),
            min(total_pages, page + 2) + 1,
        )),
    }


# clase base que cada recurso del CMS extiende para tener CRUD completo
class MongoCRUD:
    # configurables por subclase
    collection_name = ''
    list_template = ''
    form_template = 'cms/_form.html'
    delete_template = 'cms/_delete.html'
    preview_template = None  # ej. 'cms/preview/contenido.html'
    form_class = None

    list_url_name = ''
    add_url_name = ''
    change_url_name = ''
    delete_url_name = ''
    # opcionales (si no se definen, las features se desactivan)
    bulk_url_name = ''
    preview_url_name = ''

    title_singular = ''
    title_plural = ''
    sidebar_section = ''  # ej. 'Contenido clinico'

    # campos donde se busca cuando el usuario escribe en el buscador
    searchable_fields = ('titulo', 'nombre')
    # si el modelo tiene estado publicado/borrador
    has_estado = False

    @classmethod
    def label_for(cls, doc):
        # texto que identifica el documento (titulo o nombre)
        return doc.get('titulo') or doc.get('nombre') or str(doc.get('_id', ''))

    # =============== filtros / busqueda ===============

    @classmethod
    def matches_search(cls, item, query):
        """devuelve True si el item contiene la query en alguno de los searchable_fields"""
        if not query:
            return True
        q = query.lower().strip()
        for field in cls.searchable_fields:
            val = item.get(field)
            if isinstance(val, str) and q in val.lower():
                return True
            if isinstance(val, list):
                for v in val:
                    if isinstance(v, str) and q in v.lower():
                        return True
        return False

    @classmethod
    def apply_filters(cls, items, request):
        """aplica search y filtro de estado segun los query params"""
        q = request.GET.get('q', '').strip()
        estado_filter = request.GET.get('estado', '').strip()

        result = items
        if q:
            result = [it for it in result if cls.matches_search(it, q)]
        if cls.has_estado and estado_filter in ('publicado', 'borrador'):
            result = [it for it in result if it.get('estado') == estado_filter]
        return result, q, estado_filter

    # =============== vistas ===============

    @classmethod
    def list_view(cls, request):
        db = get_db()
        all_items = list(db[cls.collection_name].find().sort('creado_en', -1))
        for item in all_items:
            item['id_str'] = str(item['_id'])

        filtered, query, estado_filter = cls.apply_filters(all_items, request)

        # paginacion
        try:
            page = int(request.GET.get('page', '1'))
        except ValueError:
            page = 1
        pagination = paginate(filtered, page)

        return render(request, cls.list_template, {
            'items': pagination['items'],
            'pagination': pagination,
            'total_all': len(all_items),
            'query': query,
            'estado_filter': estado_filter,
            'has_estado': cls.has_estado,
            'title': cls.title_plural,
            'add_url': reverse(cls.add_url_name) if cls.add_url_name else '',
            'bulk_url': reverse(cls.bulk_url_name) if cls.bulk_url_name else '',
            'change_url_name': cls.change_url_name,
            'delete_url_name': cls.delete_url_name,
            'list_url_name': cls.list_url_name,
            'sidebar_section': cls.sidebar_section,
        })

    @classmethod
    def add_view(cls, request):
        if request.method == 'POST':
            form = cls.form_class(request.POST, request.FILES)
            if form.is_valid():
                data = cls.form_to_mongo(form.cleaned_data, files=request.FILES)
                data['creado_en'] = datetime.utcnow()
                db = get_db()
                result = db[cls.collection_name].insert_one(data)
                log_action(
                    request.user,
                    ACTION_CREATE,
                    cls.collection_name,
                    item_id=result.inserted_id,
                    label=cls.label_for(data),
                )
                messages.success(
                    request,
                    f'{cls.title_singular.capitalize()} creado correctamente.',
                )
                return redirect(cls.list_url_name)
        else:
            form = cls.form_class()

        return render(request, cls.form_template, {
            'form': form,
            'title': f'Nuevo {cls.title_singular}',
            'cancel_url': reverse(cls.list_url_name),
            'sidebar_section': cls.sidebar_section,
            'preview_url': '',
            'is_new': True,
        })

    @classmethod
    def change_view(cls, request, item_id):
        try:
            object_id = ObjectId(item_id)
        except (InvalidId, TypeError):
            return redirect(cls.list_url_name)

        db = get_db()
        item = db[cls.collection_name].find_one({'_id': object_id})
        if item is None:
            return redirect(cls.list_url_name)

        if request.method == 'POST':
            form = cls.form_class(request.POST, request.FILES)
            if form.is_valid():
                data = cls.form_to_mongo(form.cleaned_data, files=request.FILES, original=item)
                db[cls.collection_name].update_one(
                    {'_id': object_id},
                    {'$set': data},
                )
                log_action(
                    request.user,
                    ACTION_UPDATE,
                    cls.collection_name,
                    item_id=object_id,
                    label=cls.label_for(data),
                )
                messages.success(
                    request,
                    f'{cls.title_singular.capitalize()} actualizado.',
                )
                return redirect(cls.list_url_name)
        else:
            initial = cls.mongo_to_form(item)
            form = cls.form_class(initial=initial)

        preview_url = ''
        if cls.preview_url_name:
            preview_url = reverse(cls.preview_url_name, args=[str(object_id)])

        return render(request, cls.form_template, {
            'form': form,
            'title': f'Editar {cls.title_singular}',
            'cancel_url': reverse(cls.list_url_name),
            'sidebar_section': cls.sidebar_section,
            'preview_url': preview_url,
            'is_new': False,
        })

    @classmethod
    def delete_view(cls, request, item_id):
        try:
            object_id = ObjectId(item_id)
        except (InvalidId, TypeError):
            return redirect(cls.list_url_name)

        db = get_db()
        item = db[cls.collection_name].find_one({'_id': object_id})
        if item is None:
            return redirect(cls.list_url_name)

        if request.method == 'POST':
            label = cls.label_for(item)
            db[cls.collection_name].delete_one({'_id': object_id})
            log_action(
                request.user,
                ACTION_DELETE,
                cls.collection_name,
                item_id=object_id,
                label=label,
            )
            messages.success(
                request,
                f'{cls.title_singular.capitalize()} eliminado.',
            )
            return redirect(cls.list_url_name)

        return render(request, cls.delete_template, {
            'item_label': cls.label_for(item),
            'cancel_url': reverse(cls.list_url_name),
            'title': f'Eliminar {cls.title_singular}',
            'sidebar_section': cls.sidebar_section,
        })

    @classmethod
    def bulk_action_view(cls, request):
        """maneja acciones masivas: publicar/despublicar/eliminar"""
        if request.method != 'POST':
            return redirect(cls.list_url_name)

        action = request.POST.get('bulk_action', '')
        ids = request.POST.getlist('selected_ids')
        if not ids:
            messages.warning(request, 'No seleccionaste ningún item.')
            return redirect(cls.list_url_name)

        # validar ObjectIds
        object_ids = []
        for sid in ids:
            try:
                object_ids.append(ObjectId(sid))
            except (InvalidId, TypeError):
                continue

        if not object_ids:
            messages.error(request, 'IDs inválidos.')
            return redirect(cls.list_url_name)

        db = get_db()

        if action == 'publish' and cls.has_estado:
            result = db[cls.collection_name].update_many(
                {'_id': {'$in': object_ids}},
                {'$set': {'estado': 'publicado'}},
            )
            log_action(
                request.user, ACTION_BULK_PUBLISH, cls.collection_name,
                count=result.modified_count,
            )
            messages.success(
                request,
                f'{result.modified_count} {cls.title_plural.lower()} publicados.',
            )
        elif action == 'unpublish' and cls.has_estado:
            result = db[cls.collection_name].update_many(
                {'_id': {'$in': object_ids}},
                {'$set': {'estado': 'borrador'}},
            )
            log_action(
                request.user, ACTION_BULK_UNPUBLISH, cls.collection_name,
                count=result.modified_count,
            )
            messages.success(
                request,
                f'{result.modified_count} {cls.title_plural.lower()} pasados a borrador.',
            )
        elif action == 'delete':
            result = db[cls.collection_name].delete_many(
                {'_id': {'$in': object_ids}},
            )
            log_action(
                request.user, ACTION_BULK_DELETE, cls.collection_name,
                count=result.deleted_count,
            )
            messages.success(
                request,
                f'{result.deleted_count} {cls.title_plural.lower()} eliminados.',
            )
        else:
            messages.error(request, 'Acción no válida.')

        return redirect(cls.list_url_name)

    @classmethod
    def preview_view(cls, request, item_id):
        """muestra una vista previa de como se ve el item en la app movil"""
        try:
            object_id = ObjectId(item_id)
        except (InvalidId, TypeError):
            return redirect(cls.list_url_name)

        db = get_db()
        item = db[cls.collection_name].find_one({'_id': object_id})
        if item is None:
            return redirect(cls.list_url_name)

        template = cls.preview_template or 'cms/_preview_generic.html'
        return render(request, template, {
            'item': item,
            'title': f'Vista previa: {cls.label_for(item)}',
            'sidebar_section': cls.sidebar_section,
            'edit_url': reverse(cls.change_url_name, args=[str(object_id)]),
            'cancel_url': reverse(cls.list_url_name),
        })

    # subclases sobreescriben estos dos metodos
    @classmethod
    def form_to_mongo(cls, form_data, files=None, original=None):
        return dict(form_data)

    @classmethod
    def mongo_to_form(cls, mongo_doc):
        return dict(mongo_doc)
