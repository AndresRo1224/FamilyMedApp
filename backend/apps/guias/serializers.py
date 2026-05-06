# serializers de la app guias

from datetime import datetime

from rest_framework import serializers


class GuiaSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    titulo = serializers.CharField(required=False, allow_blank=True)
    tipo = serializers.CharField(required=False, allow_blank=True)
    resumen = serializers.CharField(required=False, allow_blank=True)
    pasos = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    advertencias = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    fuente = serializers.CharField(required=False, allow_blank=True)
    ultima_actualizacion = serializers.CharField(required=False, allow_blank=True)
    etiquetas = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    vistas = serializers.IntegerField(required=False, default=0)
    creado_en = serializers.CharField(required=False, allow_blank=True)

    def to_representation(self, instance):
        creado_en = instance.get('creado_en', '')
        if isinstance(creado_en, datetime):
            creado_en = creado_en.isoformat()

        ultima = instance.get('ultima_actualizacion', '')
        if isinstance(ultima, datetime):
            ultima = ultima.isoformat()

        return {
            'id': str(instance.get('_id', '')),
            'titulo': instance.get('titulo', ''),
            'tipo': instance.get('tipo', ''),
            'resumen': instance.get('resumen', ''),
            'pasos': instance.get('pasos', []),
            'advertencias': instance.get('advertencias', []),
            'fuente': instance.get('fuente', ''),
            'ultima_actualizacion': ultima,
            'etiquetas': instance.get('etiquetas', []),
            'vistas': instance.get('vistas', 0),
            'creado_en': creado_en,
        }
