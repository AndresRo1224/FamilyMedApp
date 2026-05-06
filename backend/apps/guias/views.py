# vistas de la app guias

from bson import ObjectId
from bson.errors import InvalidId

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from familymed.db import get_db

from .serializers import GuiaSerializer


class GuiaListView(APIView):
    # GET /api/guias/
    # acepta filtro opcional por tipo con ?tipo=algoritmo

    def get(self, request):
        db = get_db()

        filtro = {}
        tipo = request.query_params.get('tipo')
        if tipo:
            filtro['tipo'] = tipo

        cursor = db.guias.find(filtro).sort('creado_en', -1)
        guias = list(cursor)
        serializer = GuiaSerializer(guias, many=True)
        return Response(serializer.data)


class GuiaDetailView(APIView):
    # GET /api/guias/<id>/

    def get(self, request, guia_id):
        try:
            object_id = ObjectId(guia_id)
        except (InvalidId, TypeError):
            return Response(
                {'error': 'ID inválido'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        db = get_db()
        guia = db.guias.find_one({'_id': object_id})

        if guia is None:
            return Response(
                {'error': 'Guía no encontrada'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # cuenta una vista mas
        db.guias.update_one(
            {'_id': object_id},
            {'$inc': {'vistas': 1}},
        )
        guia['vistas'] = guia.get('vistas', 0) + 1

        serializer = GuiaSerializer(guia)
        return Response(serializer.data)
