# vistas de la app calculadoras

from bson import ObjectId
from bson.errors import InvalidId

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from familymed.db import get_db

from .serializers import CalculadoraSerializer


class CalculadoraListView(APIView):
    # GET /api/calculadoras/

    def get(self, request):
        db = get_db()
        cursor = db.calculadoras.find().sort('creado_en', -1)
        calculadoras = list(cursor)
        serializer = CalculadoraSerializer(calculadoras, many=True)
        return Response(serializer.data)


class CalculadoraDetailView(APIView):
    # GET /api/calculadoras/<id>/

    def get(self, request, calculadora_id):
        try:
            object_id = ObjectId(calculadora_id)
        except (InvalidId, TypeError):
            return Response(
                {'error': 'ID inválido'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        db = get_db()
        calculadora = db.calculadoras.find_one({'_id': object_id})

        if calculadora is None:
            return Response(
                {'error': 'Calculadora no encontrada'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CalculadoraSerializer(calculadora)
        return Response(serializer.data)
