# vistas del CMS para gestionar imagenes del atlas (con upload)

from datetime import datetime

from bson import ObjectId
from bson.errors import InvalidId
from django.contrib import messages
from django.core.files.storage import default_storage
from django.shortcuts import redirect, render
from django.urls import reverse

from familymed.audit import ACTION_CREATE, ACTION_UPDATE, log_action
from familymed.cms_helpers import MongoCRUD, join_lines, split_lines
from familymed.db import get_db

from .forms import AtlasForm


class AtlasCRUD(MongoCRUD):
    collection_name = 'atlas_imagenes'
    list_template = 'cms/atlas/list.html'
    form_template = 'cms/atlas/form.html'
    preview_template = 'cms/preview/atlas.html'
    form_class = AtlasForm

    list_url_name = 'cms_atlas_list'
    add_url_name = 'cms_atlas_add'
    change_url_name = 'cms_atlas_change'
    delete_url_name = 'cms_atlas_delete'
    bulk_url_name = 'cms_atlas_bulk'
    preview_url_name = 'cms_atlas_preview'

    title_singular = 'imagen'
    title_plural = 'Atlas de Imágenes'
    sidebar_section = 'CMS · Atlas'

    searchable_fields = ('titulo', 'descripcion', 'categoria')

    @classmethod
    def form_to_mongo(cls, form_data, files=None, original=None):
        data = {
            'titulo': form_data['titulo'],
            'descripcion': form_data['descripcion'],
            'categoria': form_data['categoria'],
            'hallazgos': split_lines(form_data['hallazgos']),
            'significancia_clinica': form_data['significancia_clinica'],
        }

        # si subio imagen nueva, la guarda en media/atlas/
        imagen = files.get('imagen') if files else None
        if imagen:
            saved_path = default_storage.save(
                f'atlas/{imagen.name}', imagen,
            )
            # saved_path es algo como 'atlas/foto.jpg'
            data['imagen_url'] = saved_path
        elif original:
            # mantiene la imagen anterior si no subio una nueva
            data['imagen_url'] = original.get('imagen_url', '')
        else:
            data['imagen_url'] = ''

        if original is None:
            data['vistas'] = 0
        return data

    @classmethod
    def mongo_to_form(cls, mongo_doc):
        return {
            'titulo': mongo_doc.get('titulo', ''),
            'descripcion': mongo_doc.get('descripcion', ''),
            'categoria': mongo_doc.get('categoria', 'fondo_ojo'),
            'hallazgos': join_lines(mongo_doc.get('hallazgos', [])),
            'significancia_clinica': mongo_doc.get('significancia_clinica', ''),
        }

    # override de add_view y change_view para pasar la imagen actual al template
    @classmethod
    def _render_form(cls, request, form, title, current_image_url='', preview_url='', is_new=True):
        return render(request, cls.form_template, {
            'form': form,
            'title': title,
            'cancel_url': reverse(cls.list_url_name),
            'sidebar_section': cls.sidebar_section,
            'preview_url': preview_url,
            'is_new': is_new,
            'current_image_url': current_image_url,
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
                    request.user, ACTION_CREATE, cls.collection_name,
                    item_id=result.inserted_id, label=cls.label_for(data),
                )
                messages.success(request, 'Imagen creada correctamente.')
                return redirect(cls.list_url_name)
        else:
            form = cls.form_class()
        return cls._render_form(request, form, f'Nueva {cls.title_singular}', is_new=True)

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
                    {'_id': object_id}, {'$set': data},
                )
                log_action(
                    request.user, ACTION_UPDATE, cls.collection_name,
                    item_id=object_id, label=cls.label_for(data),
                )
                messages.success(request, 'Imagen actualizada.')
                return redirect(cls.list_url_name)
        else:
            initial = cls.mongo_to_form(item)
            form = cls.form_class(initial=initial)

        # url para construir vista previa de la imagen actual
        current = item.get('imagen_url') or ''
        current_image_url = f'/media/{current}' if current else ''
        preview_url = reverse(cls.preview_url_name, args=[str(object_id)])

        return cls._render_form(
            request, form, f'Editar {cls.title_singular}',
            current_image_url=current_image_url,
            preview_url=preview_url,
            is_new=False,
        )
