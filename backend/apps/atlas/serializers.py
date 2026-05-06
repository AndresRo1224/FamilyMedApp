# serializers de la app atlas

from datetime import datetime

from rest_framework import serializers


class AtlasImagenSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    titulo = serializers.CharField(required=False, allow_blank=True)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    categoria = serializers.CharField(required=False, allow_blank=True)
    hallazgos = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    significancia_clinica = serializers.CharField(required=False, allow_blank=True)
    imagen_url = serializers.CharField(required=False, allow_blank=True)
    vistas = serializers.IntegerField(required=False, default=0)
    creado_en = serializers.CharField(required=False, allow_blank=True)

    def to_representation(self, instance):
        creado_en = instance.get('creado_en', '')
        if isinstance(creado_en, datetime):
            creado_en = creado_en.isoformat()

        return {
            'id': str(instance.get('_id', '')),
            'titulo': instance.get('titulo', ''),
            'descripcion': instance.get('descripcion', ''),
            'categoria': instance.get('categoria', ''),
            'hallazgos': instance.get('hallazgos', []),
            'significancia_clinica': instance.get('significancia_clinica', ''),
            'imagen_url': instance.get('imagen_url', ''),
            'vistas': instance.get('vistas', 0),
            'creado_en': creado_en,
        }
