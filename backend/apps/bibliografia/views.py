# vistas de la app bibliografia

from bson import ObjectId
from bson.errors import InvalidId

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from familymed.db import get_db

from .serializers import BibliografiaSerializer


class BibliografiaListView(APIView):
    # GET /api/bibliografia/
    # acepta filtro opcional por tipo con ?tipo=articulo

    def get(self, request):
        db = get_db()

        filtro = {}
        tipo = request.query_params.get('tipo')
        if tipo:
            filtro['tipo'] = tipo

        cursor = db.bibliografia.find(filtro).sort('anio', -1)
        items = list(cursor)
        serializer = BibliografiaSerializer(items, many=True)
        return Response(serializer.data)


class BibliografiaDetailView(APIView):
    # GET /api/bibliografia/<id>/

    def get(self, request, item_id):
        try:
            object_id = ObjectId(item_id)
        except (InvalidId, TypeError):
            return Response(
                {'error': 'ID inválido'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        db = get_db()
        item = db.bibliografia.find_one({'_id': object_id})

        if item is None:
            return Response(
                {'error': 'Referencia no encontrada'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = BibliografiaSerializer(item)
        return Response(serializer.data)
