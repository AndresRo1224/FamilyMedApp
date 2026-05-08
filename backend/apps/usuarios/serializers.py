# serializers de la app usuarios

from datetime import datetime

from rest_framework import serializers


class UsuarioSerializer(serializers.Serializer):
    # convierte el documento de mongo a dict JSON limpio
    id = serializers.CharField(read_only=True)
    correo = serializers.CharField()
    nombre_completo = serializers.CharField()
    rol = serializers.CharField()
    institucion = serializers.CharField(required=False, allow_blank=True)
    codigo_programa = serializers.CharField(required=False, allow_blank=True)
    activo = serializers.BooleanField(default=True)
    creado_en = serializers.CharField(required=False, allow_blank=True)

    def to_representation(self, instance):
        creado_en = instance.get('creado_en', '')
        if isinstance(creado_en, datetime):
            creado_en = creado_en.isoformat()

        return {
            'id': str(instance.get('_id', '')),
            'correo': instance.get('correo', ''),
            'nombre_completo': instance.get('nombre_completo', ''),
            'rol': instance.get('rol', 'estudiante'),
            'institucion': instance.get('institucion', ''),
            'codigo_programa': instance.get('codigo_programa', ''),
            'activo': instance.get('activo', True),
            'creado_en': creado_en,
        }
