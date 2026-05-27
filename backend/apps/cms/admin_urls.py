# urls del dashboard del CMS y auditoria

from django.urls import path

from .audit_views import audit_view
from .dashboard_views import dashboard_view


urlpatterns = [
    path('', dashboard_view, name='cms_dashboard'),
    path('auditoria/', audit_view, name='cms_audit'),
]
