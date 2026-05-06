# vistas de la app atlas

from bson import ObjectId
from bson.errors import InvalidId

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from familymed.db import get_db

from .serializers import AtlasImagenSerializer


class AtlasListView(APIView):
    # GET /api/atlas/
    # acepta filtro opcional por categoria con ?categoria=fondo_ojo

    def get(self, request):
        db = get_db()

        filtro = {}
        categoria = request.query_params.get('categoria')
        if categoria:
            filtro['categoria'] = categoria

        cursor = db.atlas_imagenes.find(filtro).sort('creado_en', -1)
        imagenes = list(cursor)
        serializer = AtlasImagenSerializer(imagenes, many=True)
        return Response(serializer.data)


class AtlasDetailView(APIView):
    # GET /api/atlas/<id>/

    def get(self, request, imagen_id):
        try:
            object_id = ObjectId(imagen_id)
        except (InvalidId, TypeError):
            return Response(
                {'error': 'ID inválido'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        db = get_db()
        imagen = db.atlas_imagenes.find_one({'_id': object_id})

        if imagen is None:
            return Response(
                {'error': 'Imagen no encontrada'},
                status=status.HTTP_404_NOT_FOUND,
            )

        # cuenta una vista mas
        db.atlas_imagenes.update_one(
            {'_id': object_id},
            {'$inc': {'vistas': 1}},
        )
        imagen['vistas'] = imagen.get('vistas', 0) + 1

        serializer = AtlasImagenSerializer(imagen)
        return Response(serializer.data)
