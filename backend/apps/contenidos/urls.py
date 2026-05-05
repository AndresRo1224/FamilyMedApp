# rutas de la app contenidos

from django.urls import path

from .views import ContenidoDetailView, ContenidoListView


urlpatterns = [
    # /api/contenidos/
    path('', ContenidoListView.as_view(), name='contenidos-list'),

    # /api/contenidos/<id>/
    path(
        '<str:contenido_id>/',
        ContenidoDetailView.as_view(),
        name='contenidos-detail',
    ),
]
