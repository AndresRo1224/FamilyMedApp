# config de la app contenidos

from django.apps import AppConfig


class ContenidosConfig(AppConfig):
    # ruta de la app dentro del proyecto
    name = 'apps.contenidos'

    # nombre que se ve en el admin
    verbose_name = 'Contenidos'
