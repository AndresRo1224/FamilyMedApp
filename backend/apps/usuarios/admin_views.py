# vistas del CMS para gestionar usuarios de la app movil (mongo)
# solo lectura del listado + edicion de campos no sensibles + eliminar

from familymed.cms_helpers import MongoCRUD

from .forms import UsuarioAppForm


class UsuarioAppCRUD(MongoCRUD):
    collection_name = 'usuarios'
    list_template = 'cms/usuarios_app/list.html'
    form_class = UsuarioAppForm

    list_url_name = 'cms_usuarios_app_list'
    # no hay add real, dejamos el alias al list para que el helper no rompa
    add_url_name = 'cms_usuarios_app_list'
    change_url_name = 'cms_usuarios_app_change'
    delete_url_name = 'cms_usuarios_app_delete'

    title_singular = 'usuario'
    title_plural = 'Usuarios de la app'
    sidebar_section = 'CMS · Usuarios'

    searchable_fields = ('correo', 'nombre_completo', 'cedula', 'codigo_programa', 'rol')

    @classmethod
    def label_for(cls, doc):
        return doc.get('nombre_completo') or doc.get('correo') or str(doc.get('_id', ''))

    @classmethod
    def form_to_mongo(cls, form_data, files=None, original=None):
        # nunca tocamos correo ni clave_hash
        return {
            'nombre_completo': form_data['nombre_completo'],
            'rol': form_data['rol'],
            'cedula': form_data.get('cedula', ''),
            'institucion': form_data.get('institucion', ''),
            'codigo_programa': form_data.get('codigo_programa', ''),
            'activo': form_data.get('activo', True),
        }

    @classmethod
    def mongo_to_form(cls, mongo_doc):
        return {
            'nombre_completo': mongo_doc.get('nombre_completo', ''),
            'rol': mongo_doc.get('rol', 'estudiante'),
            'cedula': mongo_doc.get('cedula', ''),
            'institucion': mongo_doc.get('institucion', ''),
            'codigo_programa': mongo_doc.get('codigo_programa', ''),
            'activo': mongo_doc.get('activo', True),
        }
