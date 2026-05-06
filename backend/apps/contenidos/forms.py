# formulario para crear/editar contenidos en el CMS

from django import forms


NIVEL_CHOICES = [
    ('basico', 'Básico'),
    ('intermedio', 'Intermedio'),
    ('avanzado', 'Avanzado'),
]

ESTADO_CHOICES = [
    ('publicado', 'Publicado'),
    ('borrador', 'Borrador'),
]


class ContenidoForm(forms.Form):
    titulo = forms.CharField(max_length=200, label='Título')
    subtitulo = forms.CharField(max_length=300, label='Subtítulo', required=False)
    nivel = forms.ChoiceField(choices=NIVEL_CHOICES, label='Nivel')
    tiempo_lectura_min = forms.IntegerField(
        label='Tiempo de lectura (min)', min_value=1, initial=5,
    )
    cuerpo = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 10}),
        label='Cuerpo / contenido principal',
    )
    puntos_clave = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5}),
        required=False,
        label='Puntos clave',
        help_text='Un punto por línea',
    )
    referencias = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4}),
        required=False,
        label='Referencias',
        help_text='Una referencia por línea',
    )
    etiquetas = forms.CharField(
        max_length=300,
        required=False,
        label='Etiquetas',
        help_text='Separadas por coma',
    )
    estado = forms.ChoiceField(
        choices=ESTADO_CHOICES, initial='publicado', label='Estado',
    )
