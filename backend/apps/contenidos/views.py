# vistas de la app contenidos
# leen directo de mongo con pymongo, sin orm

from bson import ObjectId
from bson.errors import InvalidId

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from familymed.db import get_db

from .serializers import ContenidoSerializer


class ContenidoListView(APIView):
    # GET /api/contenidos/
    # devuelve los contenidos publicados ordenados por mas recientes

    def get(self, request):
        db = get_db()
        cursor = db.contenidos.find(
            {'estado': 'publicado'},
        ).sort('creado_en', -1)

        contenidos = list(cursor)
        serializer = ContenidoSerializer(contenidos, many=True)
        return Response(serializer.data)


class ContenidoDetailView(APIView):
    # GET /api/contenidos/<id>/
    # devuelve un contenido especifico e incrementa el contador de vistas

    def get(self, request, contenido_id):
        # validar que el id tenga formato de ObjectId
        try:
            object_id = ObjectId(contenido_id)
        except (InvalidId, TypeError):
            return Response(
                {'error': 'ID inválido'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        db = get_db()
        contenido = db.contenidos.find_one({'_id': object_id})

        if contenido is None:
            return Response(
                {'error': 'Contenido no encontrado'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # cuenta una vista mas
        db.contenidos.update_one(
            {'_id': object_id},
            {'$inc': {'vistas': 1}},
        )
        contenido['vistas'] = contenido.get('vistas', 0) + 1

        serializer = ContenidoSerializer(contenido)
        return Response(serializer.data)
