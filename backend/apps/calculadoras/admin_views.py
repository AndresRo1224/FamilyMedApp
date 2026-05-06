# vistas del CMS para gestionar calculadoras

from familymed.cms_helpers import (
    MongoCRUD,
    join_csv,
    join_lines,
    split_csv,
    split_lines,
)

from .forms import CalculadoraForm


class CalculadoraCRUD(MongoCRUD):
    collection_name = 'calculadoras'
    list_template = 'cms/calculadoras/list.html'
    form_class = CalculadoraForm

    list_url_name = 'cms_calculadoras_list'
    add_url_name = 'cms_calculadoras_add'
    change_url_name = 'cms_calculadoras_change'
    delete_url_name = 'cms_calculadoras_delete'

    title_singular = 'calculadora'
    title_plural = 'Calculadoras'
    sidebar_section = 'CMS · Calculadoras'

    @classmethod
    def label_for(cls, doc):
        return doc.get('nombre') or doc.get('nombre_corto') or '?'

    @classmethod
    def form_to_mongo(cls, form_data, files=None, original=None):
        return {
            'nombre': form_data['nombre'],
            'nombre_corto': form_data['nombre_corto'],
            'descripcion': form_data['descripcion'],
            'proposito': form_data['proposito'],
            'formula': form_data['formula'],
            'parametros': split_lines(form_data['parametros']),
            'unidad_salida': form_data['unidad_salida'],
            'uso_clinico': form_data['uso_clinico'],
            'referencia': form_data['referencia'],
            'categoria': form_data.get('categoria', ''),
            'etiquetas': split_csv(form_data.get('etiquetas', '')),
        }

    @classmethod
    def mongo_to_form(cls, mongo_doc):
        return {
            'nombre': mongo_doc.get('nombre', ''),
            'nombre_corto': mongo_doc.get('nombre_corto', ''),
            'descripcion': mongo_doc.get('descripcion', ''),
            'proposito': mongo_doc.get('proposito', ''),
            'formula': mongo_doc.get('formula', ''),
            'parametros': join_lines(mongo_doc.get('parametros', [])),
            'unidad_salida': mongo_doc.get('unidad_salida', ''),
            'uso_clinico': mongo_doc.get('uso_clinico', ''),
            'referencia': mongo_doc.get('referencia', ''),
            'categoria': mongo_doc.get('categoria', ''),
            'etiquetas': join_csv(mongo_doc.get('etiquetas', [])),
        }
