# vistas del CMS para gestionar contenidos desde el admin

from familymed.cms_helpers import (
    MongoCRUD,
    join_csv,
    join_lines,
    split_csv,
    split_lines,
)

from .forms import ContenidoForm


class ContenidoCRUD(MongoCRUD):
    collection_name = 'contenidos'
    list_template = 'cms/contenidos/list.html'
    preview_template = 'cms/preview/contenido.html'
    form_class = ContenidoForm

    list_url_name = 'cms_contenidos_list'
    add_url_name = 'cms_contenidos_add'
    change_url_name = 'cms_contenidos_change'
    delete_url_name = 'cms_contenidos_delete'
    bulk_url_name = 'cms_contenidos_bulk'
    preview_url_name = 'cms_contenidos_preview'

    title_singular = 'contenido'
    title_plural = 'Contenidos'
    sidebar_section = 'CMS · Contenidos'

    searchable_fields = ('titulo', 'subtitulo', 'etiquetas')
    has_estado = True

    @classmethod
    def form_to_mongo(cls, form_data, files=None, original=None):
        # convierte el dict del form al formato del documento mongo
        data = {
            'titulo': form_data['titulo'],
            'subtitulo': form_data.get('subtitulo', ''),
            'nivel': form_data['nivel'],
            'tiempo_lectura_min': form_data['tiempo_lectura_min'],
            'cuerpo': form_data['cuerpo'],
            'puntos_clave': split_lines(form_data.get('puntos_clave', '')),
            'referencias': split_lines(form_data.get('referencias', '')),
            'etiquetas': split_csv(form_data.get('etiquetas', '')),
            'estado': form_data['estado'],
        }
        # solo en creacion inicializamos vistas en 0
        if original is None:
            data['vistas'] = 0
        return data

    @classmethod
    def mongo_to_form(cls, mongo_doc):
        # prepara el doc para llenar el form al editar
        return {
            'titulo': mongo_doc.get('titulo', ''),
            'subtitulo': mongo_doc.get('subtitulo', ''),
            'nivel': mongo_doc.get('nivel', 'basico'),
            'tiempo_lectura_min': mongo_doc.get('tiempo_lectura_min', 5),
            'cuerpo': mongo_doc.get('cuerpo', ''),
            'puntos_clave': join_lines(mongo_doc.get('puntos_clave', [])),
            'referencias': join_lines(mongo_doc.get('referencias', [])),
            'etiquetas': join_csv(mongo_doc.get('etiquetas', [])),
            'estado': mongo_doc.get('estado', 'publicado'),
        }
