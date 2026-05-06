# rutas de la app atlas

from django.urls import path

from .views import AtlasDetailView, AtlasListView


urlpatterns = [
    path('', AtlasListView.as_view(), name='atlas-list'),
    path(
        '<str:imagen_id>/',
        AtlasDetailView.as_view(),
        name='atlas-detail',
    ),
]
