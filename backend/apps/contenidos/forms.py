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

# minimo de caracteres del cuerpo para que valga publicar algo serio
CUERPO_MIN_CHARS = 50


class ContenidoForm(forms.Form):
    titulo = forms.CharField(
        max_length=200, min_length=3, label='Título',
        help_text='Entre 3 y 200 caracteres.',
    )
    subtitulo = forms.CharField(
        max_length=300, label='Subtítulo', required=False,
        help_text='Opcional, máximo 300 caracteres.',
    )
    nivel = forms.ChoiceField(choices=NIVEL_CHOICES, label='Nivel')
    tiempo_lectura_min = forms.IntegerField(
        label='Tiempo de lectura (min)', min_value=1, max_value=120, initial=5,
        help_text='Entre 1 y 120 minutos.',
    )
    cuerpo = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 10}),
        label='Cuerpo / contenido principal',
        help_text=f'Mínimo {CUERPO_MIN_CHARS} caracteres.',
    )
    puntos_clave = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5}),
        required=False,
        label='Puntos clave',
        help_text='Un punto por línea.',
    )
    referencias = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 4}),
        required=False,
        label='Referencias',
        help_text='Una referencia por línea.',
    )
    etiquetas = forms.CharField(
        max_length=300,
        required=False,
        label='Etiquetas',
        help_text='Separadas por coma (ej: hipertension, urgencias, embarazo).',
    )
    estado = forms.ChoiceField(
        choices=ESTADO_CHOICES, initial='publicado', label='Estado',
    )

    def clean_titulo(self):
        v = (self.cleaned_data.get('titulo') or '').strip()
        if len(v) < 3:
            raise forms.ValidationError('El título debe tener al menos 3 caracteres.')
        return v

    def clean_cuerpo(self):
        v = (self.cleaned_data.get('cuerpo') or '').strip()
        if len(v) < CUERPO_MIN_CHARS:
            raise forms.ValidationError(
                f'El cuerpo debe tener al menos {CUERPO_MIN_CHARS} caracteres '
                f'(actualmente tiene {len(v)}).'
            )
        return v

    def clean(self):
        cleaned = super().clean()
        # si se va a publicar, exigir puntos clave (no si es borrador)
        estado = cleaned.get('estado')
        puntos = (cleaned.get('puntos_clave') or '').strip()
        if estado == 'publicado' and not puntos:
            self.add_error(
                'puntos_clave',
                'Para publicar es obligatorio agregar al menos un punto clave.',
            )
        return cleaned
