# serializers de la app bibliografia

from datetime import datetime

from rest_framework import serializers


class BibliografiaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    titulo = serializers.CharField(required=False, allow_blank=True)
    autores = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    anio = serializers.IntegerField(required=False, default=0)
    tipo = serializers.CharField(required=False, allow_blank=True)
    revista = serializers.CharField(required=False, allow_blank=True)
    resumen = serializers.CharField(required=False, allow_blank=True)
    etiquetas = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    creado_en = serializers.CharField(required=False, allow_blank=True)

    def to_representation(self, instance):
        creado_en = instance.get('creado_en', '')
        if isinstance(creado_en, datetime):
            creado_en = creado_en.isoformat()

        return {
            'id': str(instance.get('_id', '')),
            'titulo': instance.get('titulo', ''),
            'autores': instance.get('autores', []),
            'anio': instance.get('anio', 0),
            'tipo': instance.get('tipo', ''),
            'revista': instance.get('revista', ''),
            'resumen': instance.get('resumen', ''),
            'etiquetas': instance.get('etiquetas', []),
            'creado_en': creado_en,
        }
