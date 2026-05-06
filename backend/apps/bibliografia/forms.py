# formulario para bibliografia

from django import forms


class BibliografiaForm(forms.Form):
    titulo = forms.CharField(max_length=300, label='Título')
    autores = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        required=False,
        label='Autores',
        help_text='Un autor por línea',
    )
    anio = forms.IntegerField(
        label='Año', min_value=1900, max_value=2100, required=False, initial=2026,
    )
    tipo = forms.CharField(
        max_length=80, label='Tipo (artículo, libro, guía, etc.)',
        required=False,
    )
    revista = forms.CharField(max_length=200, label='Revista', required=False)
    resumen = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4}),
        required=False, label='Resumen',
    )
    etiquetas = forms.CharField(
        max_length=300, required=False,
        label='Etiquetas',
        help_text='Separadas por coma',
    )
