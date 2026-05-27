# formulario para bibliografia

from datetime import datetime

from django import forms


class BibliografiaForm(forms.Form):
    titulo = forms.CharField(
        max_length=300, min_length=3, label='Título',
        help_text='Entre 3 y 300 caracteres.',
    )
    autores = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        required=False,
        label='Autores',
        help_text='Un autor por línea.',
    )
    anio = forms.IntegerField(
        label='Año',
        min_value=1900,
        max_value=datetime.now().year + 1,
        required=False,
        initial=datetime.now().year,
        help_text=f'Entre 1900 y {datetime.now().year + 1}.',
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
        help_text='Separadas por coma.',
    )

    def clean(self):
        cleaned = super().clean()
        # debe haber al menos autores o revista para que sirva como referencia
        autores = (cleaned.get('autores') or '').strip()
        revista = (cleaned.get('revista') or '').strip()
        if not autores and not revista:
            self.add_error(
                'autores',
                'Debes ingresar al menos un autor o la revista de publicación.',
            )
        return cleaned
