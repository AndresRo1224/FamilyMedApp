# rutas de la app guias

from django.urls import path

from .views import GuiaDetailView, GuiaListView


urlpatterns = [
    path('', GuiaListView.as_view(), name='guias-list'),
    path(
        '<str:guia_id>/',
        GuiaDetailView.as_view(),
        name='guias-detail',
    ),
]
