# modelo proxy "ancla" para que la app cms aparezca en la sidebar
# no representa datos reales, solo es el placeholder que necesita jazzmin
# para mostrar la seccion + sus custom_links

from django.contrib.auth.models import User


class PanelCMS(User):
    class Meta:
        proxy = True
        app_label = 'cms'
        verbose_name = 'panel'
        verbose_name_plural = 'Panel'
