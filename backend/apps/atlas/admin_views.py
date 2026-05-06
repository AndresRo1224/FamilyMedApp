# vistas del CMS para gestionar imagenes del atlas (con upload)

from django.core.files.storage import default_storage

from familymed.cms_helpers import MongoCRUD, join_lines, split_lines

from .forms import AtlasForm


class AtlasCRUD(MongoCRUD):
    collection_name = 'atlas_imagenes'
    list_template = 'cms/atlas/list.html'
    form_class = AtlasForm

    list_url_name = 'cms_atlas_list'
    add_url_name = 'cms_atlas_add'
    change_url_name = 'cms_atlas_change'
    delete_url_name = 'cms_atlas_delete'

    title_singular = 'imagen'
    title_plural = 'Atlas de Imágenes'
    sidebar_section = 'CMS · Atlas'

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
