# formulario para imagenes del atlas

from django import forms


CATEGORIA_CHOICES = [
    ('fondo_ojo', 'Fondo de Ojo'),
    ('ecg', 'Electrocardiograma'),
    ('radiologia', 'Radiología'),
    ('tecnica_clinica', 'Técnica Clínica'),
]


class AtlasForm(forms.Form):
    titulo = forms.CharField(max_length=200, label='Título')
    descripcion = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Descripción',
    )
    categoria = forms.ChoiceField(choices=CATEGORIA_CHOICES, label='Categoría')
    hallazgos = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5}),
        label='Hallazgos',
        help_text='Un hallazgo por línea',
    )
    significancia_clinica = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        label='Significancia clínica',
    )
    imagen = forms.FileField(
        required=False,
        label='Imagen',
        help_text='Sube una imagen (jpg/png). Si no subes nada y ya hay una, se mantiene.',
    )
