# app dummy solo para que el CMS aparezca en la sidebar de jazzmin

from django.apps import AppConfig


class CmsConfig(AppConfig):
    name = 'apps.cms'
    label = 'cms'
    verbose_name = 'CMS'
