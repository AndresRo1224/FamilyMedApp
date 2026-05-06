# helpers para el CMS embebido en el admin de django

from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from django.shortcuts import redirect, render
from django.urls import reverse

from familymed.db import get_db


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


# clase base que cada recurso del CMS extiende para tener CRUD completo
class MongoCRUD:
    # configurables por subclase
    collection_name = ''
    list_template = ''
    form_template = 'cms/_form.html'
    delete_template = 'cms/_delete.html'
    form_class = None

    list_url_name = ''
    add_url_name = ''
    change_url_name = ''
    delete_url_name = ''

    title_singular = ''
    title_plural = ''
    sidebar_section = ''  # ej. 'Contenido clinico'

    @classmethod
    def label_for(cls, doc):
        # texto que identifica el documento (titulo o nombre)
        return doc.get('titulo') or doc.get('nombre') or str(doc.get('_id', ''))

    @classmethod
    def list_view(cls, request):
        db = get_db()
        items = list(db[cls.collection_name].find().sort('creado_en', -1))
        for item in items:
            item['id_str'] = str(item['_id'])

        return render(request, cls.list_template, {
            'items': items,
            'title': cls.title_plural,
            'add_url': reverse(cls.add_url_name),
            'change_url_name': cls.change_url_name,
            'delete_url_name': cls.delete_url_name,
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
                db[cls.collection_name].insert_one(data)
                return redirect(cls.list_url_name)
        else:
            form = cls.form_class()

        return render(request, cls.form_template, {
            'form': form,
            'title': f'Nuevo {cls.title_singular}',
            'cancel_url': reverse(cls.list_url_name),
            'sidebar_section': cls.sidebar_section,
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
                return redirect(cls.list_url_name)
        else:
            initial = cls.mongo_to_form(item)
            form = cls.form_class(initial=initial)

        return render(request, cls.form_template, {
            'form': form,
            'title': f'Editar {cls.title_singular}',
            'cancel_url': reverse(cls.list_url_name),
            'sidebar_section': cls.sidebar_section,
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
            db[cls.collection_name].delete_one({'_id': object_id})
            return redirect(cls.list_url_name)

        return render(request, cls.delete_template, {
            'item_label': cls.label_for(item),
            'cancel_url': reverse(cls.list_url_name),
            'title': f'Eliminar {cls.title_singular}',
            'sidebar_section': cls.sidebar_section,
        })

    # subclases sobreescriben estos dos metodos
    @classmethod
    def form_to_mongo(cls, form_data, files=None, original=None):
        return dict(form_data)

    @classmethod
    def mongo_to_form(cls, mongo_doc):
        return dict(mongo_doc)
