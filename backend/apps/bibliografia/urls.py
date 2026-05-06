# rutas de la app bibliografia

from django.urls import path

from .views import BibliografiaDetailView, BibliografiaListView


urlpatterns = [
    path('', BibliografiaListView.as_view(), name='bibliografia-list'),
    path(
        '<str:item_id>/',
        BibliografiaDetailView.as_view(),
        name='bibliografia-detail',
    ),
]
