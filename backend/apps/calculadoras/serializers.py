# serializers de la app calculadoras

from datetime import datetime

from rest_framework import serializers


class CalculadoraSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    nombre = serializers.CharField(required=False, allow_blank=True)
    nombre_corto = serializers.CharField(required=False, allow_blank=True)
    descripcion = serializers.CharField(required=False, allow_blank=True)
    proposito = serializers.CharField(required=False, allow_blank=True)
    formula = serializers.CharField(required=False, allow_blank=True)
    parametros = serializers.ListField(
        child=serializers.CharField(), required=False, default=list,
    )
    unidad_salida = serializers.CharField(required=False, allow_blank=True)
    uso_clinico = serializers.CharField(required=False, allow_blank=True)
    referencia = serializers.CharField(required=False, allow_blank=True)
    categoria = serializers.CharField(required=False, allow_blank=True)
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
            'nombre': instance.get('nombre', ''),
            'nombre_corto': instance.get('nombre_corto', ''),
            'descripcion': instance.get('descripcion', ''),
            'proposito': instance.get('proposito', ''),
            'formula': instance.get('formula', ''),
            'parametros': instance.get('parametros', []),
            'unidad_salida': instance.get('unidad_salida', ''),
            'uso_clinico': instance.get('uso_clinico', ''),
            'referencia': instance.get('referencia', ''),
            'categoria': instance.get('categoria', ''),
            'etiquetas': instance.get('etiquetas', []),
            'creado_en': creado_en,
        }
