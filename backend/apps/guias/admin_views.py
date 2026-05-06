# vistas del CMS para gestionar guias clinicas

from familymed.cms_helpers import (
    MongoCRUD,
    join_csv,
    join_lines,
    split_csv,
    split_lines,
)

from .forms import GuiaForm


class GuiaCRUD(MongoCRUD):
    collection_name = 'guias'
    list_template = 'cms/guias/list.html'
    form_class = GuiaForm

    list_url_name = 'cms_guias_list'
    add_url_name = 'cms_guias_add'
    change_url_name = 'cms_guias_change'
    delete_url_name = 'cms_guias_delete'

    title_singular = 'guía'
    title_plural = 'Guías clínicas'
    sidebar_section = 'CMS · Guías'

    @classmethod
    def form_to_mongo(cls, form_data, files=None, original=None):
        data = {
            'titulo': form_data['titulo'],
            'tipo': form_data['tipo'],
            'resumen': form_data['resumen'],
            'pasos': split_lines(form_data['pasos']),
            'advertencias': split_lines(form_data.get('advertencias', '')),
            'fuente': form_data['fuente'],
            'ultima_actualizacion': form_data.get('ultima_actualizacion', ''),
            'etiquetas': split_csv(form_data.get('etiquetas', '')),
        }
        if original is None:
            data['vistas'] = 0
        return data

    @classmethod
    def mongo_to_form(cls, mongo_doc):
        return {
            'titulo': mongo_doc.get('titulo', ''),
            'tipo': mongo_doc.get('tipo', 'algoritmo'),
            'resumen': mongo_doc.get('resumen', ''),
            'pasos': join_lines(mongo_doc.get('pasos', [])),
            'advertencias': join_lines(mongo_doc.get('advertencias', [])),
            'fuente': mongo_doc.get('fuente', ''),
            'ultima_actualizacion': mongo_doc.get('ultima_actualizacion', ''),
            'etiquetas': join_csv(mongo_doc.get('etiquetas', [])),
        }
