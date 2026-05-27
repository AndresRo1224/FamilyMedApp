# admin del modelo ancla
# al darle click en sidebar redirige al primer modulo del CMS (contenidos)
# todas las acciones de crud estan deshabilitadas

from django.contrib import admin
from django.shortcuts import redirect

from .models import PanelCMS


@admin.register(PanelCMS)
class PanelCMSAdmin(admin.ModelAdmin):
    # nada de queryset, no queremos que aparezcan usuarios aqui
    def get_queryset(self, request):
        return super().get_queryset(request).none()

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        # al hacer click en "Panel" en sidebar, mandamos al dashboard
        return redirect('cms_dashboard')
