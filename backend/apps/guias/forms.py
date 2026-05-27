# formulario para guias clinicas

import re

from django import forms


TIPO_CHOICES = [
    ('algoritmo', 'Algoritmo'),
    ('protocolo', 'Protocolo'),
    ('tecnica', 'Técnica'),
    ('situacion_especial', 'Situación Especial'),
]

FECHA_REGEX = re.compile(r'^\d{4}-\d{2}-\d{2}$')


class GuiaForm(forms.Form):
    titulo = forms.CharField(
        max_length=200, min_length=3, label='Título',
        help_text='Entre 3 y 200 caracteres.',
    )
    tipo = forms.ChoiceField(choices=TIPO_CHOICES, label='Tipo')
    resumen = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Resumen',
        help_text='Mínimo 20 caracteres.',
    )
    pasos = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 8}),
        label='Pasos',
        help_text='Un paso por línea (mínimo 2 pasos).',
    )
    advertencias = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4}),
        required=False,
        label='Advertencias',
        help_text='Una advertencia por línea.',
    )
    fuente = forms.CharField(max_length=300, label='Fuente bibliográfica')
    ultima_actualizacion = forms.CharField(
        max_length=20,
        required=False,
        label='Última actualización',
        help_text='Fecha en formato YYYY-MM-DD (ej. 2026-04-15).',
    )
    etiquetas = forms.CharField(
        max_length=300, required=False,
        label='Etiquetas',
        help_text='Separadas por coma.',
    )

    def clean_resumen(self):
        v = (self.cleaned_data.get('resumen') or '').strip()
        if len(v) < 20:
            raise forms.ValidationError(
                'El resumen es muy corto (mínimo 20 caracteres).'
            )
        return v

    def clean_pasos(self):
        v = (self.cleaned_data.get('pasos') or '').strip()
        pasos = [p.strip() for p in v.split('\n') if p.strip()]
        if len(pasos) < 2:
            raise forms.ValidationError(
                f'Una guía debe tener al menos 2 pasos (tienes {len(pasos)}).'
            )
        return v

    def clean_ultima_actualizacion(self):
        v = (self.cleaned_data.get('ultima_actualizacion') or '').strip()
        if not v:
            return v
        if not FECHA_REGEX.match(v):
            raise forms.ValidationError(
                'Formato inválido. Usa YYYY-MM-DD (ej. 2026-04-15).'
            )
        return v
