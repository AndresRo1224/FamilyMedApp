# serializers de la app contenidos

from datetime import datetime

from rest_framework import serializers


class ContenidoSerializer(serializers.Serializer):
    # los datos no vienen de un Model de Django sino de un dict de mongo,
    # asi que sobreescribimos to_representation para limpiar el documento
    id = serializers.CharField(read_only=True)
    titulo = serializers.CharField(required=False, allow_blank=True)
    subtitulo = serializers.CharField(required=False, allow_blank=True)
    nivel = serializers.CharField(required=False, allow_blank=True)
    tiempo_lectura_min = serializers.IntegerField(required=False, default=0)
    cuerpo = serializers.CharField(required=False, allow_blank=True)
    puntos_clave = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    referencias = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    etiquetas = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    estado = serializers.CharField(required=False, allow_blank=True)
    vistas = serializers.IntegerField(required=False, default=0)
    creado_en = serializers.CharField(required=False, allow_blank=True)

    def to_representation(self, instance):
        # convierte ObjectId a string y normaliza fechas a ISO
        creado_en = instance.get('creado_en', '')
        if isinstance(creado_en, datetime):
            creado_en = creado_en.isoformat()

        return {
            'id': str(instance.get('_id', '')),
            'titulo': instance.get('titulo', ''),
            'subtitulo': instance.get('subtitulo', ''),
            'nivel': instance.get('nivel', ''),
            'tiempo_lectura_min': instance.get('tiempo_lectura_min', 0),
            'cuerpo': instance.get('cuerpo', ''),
            'puntos_clave': instance.get('puntos_clave', []),
            'referencias': instance.get('referencias', []),
            'etiquetas': instance.get('etiquetas', []),
            'estado': instance.get('estado', ''),
            'vistas': instance.get('vistas', 0),
            'creado_en': creado_en,
        }
