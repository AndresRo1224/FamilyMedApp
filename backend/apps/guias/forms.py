# formulario para guias clinicas

from django import forms


TIPO_CHOICES = [
    ('algoritmo', 'Algoritmo'),
    ('protocolo', 'Protocolo'),
    ('tecnica', 'Técnica'),
    ('situacion_especial', 'Situación Especial'),
]


class GuiaForm(forms.Form):
    titulo = forms.CharField(max_length=200, label='Título')
    tipo = forms.ChoiceField(choices=TIPO_CHOICES, label='Tipo')
    resumen = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Resumen',
    )
    pasos = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 8}),
        label='Pasos',
        help_text='Un paso por línea',
    )
    advertencias = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4}),
        required=False,
        label='Advertencias',
        help_text='Una advertencia por línea',
    )
    fuente = forms.CharField(max_length=300, label='Fuente bibliográfica')
    ultima_actualizacion = forms.CharField(
        max_length=20,
        required=False,
        label='Última actualización',
        help_text='Fecha en formato YYYY-MM-DD (ej. 2026-04-15)',
    )
    etiquetas = forms.CharField(
        max_length=300, required=False,
        label='Etiquetas',
        help_text='Separadas por coma',
    )
