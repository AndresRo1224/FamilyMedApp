# vistas del CMS para gestionar bibliografia

from familymed.cms_helpers import (
    MongoCRUD,
    join_csv,
    join_lines,
    split_csv,
    split_lines,
)

from .forms import BibliografiaForm


class BibliografiaCRUD(MongoCRUD):
    collection_name = 'bibliografia'
    list_template = 'cms/bibliografia/list.html'
    form_class = BibliografiaForm

    list_url_name = 'cms_bibliografia_list'
    add_url_name = 'cms_bibliografia_add'
    change_url_name = 'cms_bibliografia_change'
    delete_url_name = 'cms_bibliografia_delete'

    title_singular = 'referencia'
    title_plural = 'Bibliografía'
    sidebar_section = 'CMS · Bibliografía'

    @classmethod
    def form_to_mongo(cls, form_data, files=None, original=None):
        return {
            'titulo': form_data['titulo'],
            'autores': split_lines(form_data.get('autores', '')),
            'anio': form_data.get('anio') or 0,
            'tipo': form_data.get('tipo', ''),
            'revista': form_data.get('revista', ''),
            'resumen': form_data.get('resumen', ''),
            'etiquetas': split_csv(form_data.get('etiquetas', '')),
        }

    @classmethod
    def mongo_to_form(cls, mongo_doc):
        return {
            'titulo': mongo_doc.get('titulo', ''),
            'autores': join_lines(mongo_doc.get('autores', [])),
            'anio': mongo_doc.get('anio', 2026),
            'tipo': mongo_doc.get('tipo', ''),
            'revista': mongo_doc.get('revista', ''),
            'resumen': mongo_doc.get('resumen', ''),
            'etiquetas': join_csv(mongo_doc.get('etiquetas', [])),
        }
