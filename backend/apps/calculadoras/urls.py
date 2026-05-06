# rutas de la app calculadoras

from django.urls import path

from .views import CalculadoraDetailView, CalculadoraListView


urlpatterns = [
    path('', CalculadoraListView.as_view(), name='calculadoras-list'),
    path(
        '<str:calculadora_id>/',
        CalculadoraDetailView.as_view(),
        name='calculadoras-detail',
    ),
]
