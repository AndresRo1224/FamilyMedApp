# formulario para imagenes del atlas

import os

from django import forms


CATEGORIA_CHOICES = [
    ('fondo_ojo', 'Fondo de Ojo'),
    ('ecg', 'Electrocardiograma'),
    ('radiologia', 'Radiología'),
    ('tecnica_clinica', 'Técnica Clínica'),
]

# solo imagenes reales, nada de ejecutables ni svg (que puede traer scripts)
EXTENSIONES_VALIDAS = ('.jpg', '.jpeg', '.png', '.webp')
TIPOS_MIME_VALIDOS = ('image/jpeg', 'image/png', 'image/webp')
TAMANO_MAX_MB = 5


class AtlasForm(forms.Form):
    titulo = forms.CharField(
        max_length=200, min_length=3, label='Título',
        help_text='Entre 3 y 200 caracteres.',
    )
    descripcion = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Descripción',
        help_text='Mínimo 20 caracteres.',
    )
    categoria = forms.ChoiceField(choices=CATEGORIA_CHOICES, label='Categoría')
    hallazgos = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5}),
        label='Hallazgos',
        help_text='Un hallazgo por línea (mínimo 1).',
    )
    significancia_clinica = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}),
        label='Significancia clínica',
    )
    imagen = forms.FileField(
        required=False,
        label='Imagen',
        widget=forms.FileInput(attrs={
            'accept': 'image/jpeg,image/png,image/webp',
            'id': 'atlas-imagen-input',
        }),
        help_text=f'jpg/png/webp · máximo {TAMANO_MAX_MB}MB · se mantiene la anterior si no subes una nueva.',
    )

    def clean_descripcion(self):
        v = (self.cleaned_data.get('descripcion') or '').strip()
        if len(v) < 20:
            raise forms.ValidationError(
                'La descripción es muy corta (mínimo 20 caracteres).'
            )
        return v

    def clean_hallazgos(self):
        v = (self.cleaned_data.get('hallazgos') or '').strip()
        hallazgos = [h.strip() for h in v.split('\n') if h.strip()]
        if not hallazgos:
            raise forms.ValidationError(
                'Debes ingresar al menos un hallazgo (uno por línea).'
            )
        return v

    def clean_imagen(self):
        # valida extension, tipo MIME y tamaño antes de guardar el archivo
        imagen = self.cleaned_data.get('imagen')
        if not imagen:
            return imagen

        ext = os.path.splitext(imagen.name)[1].lower()
        if ext not in EXTENSIONES_VALIDAS:
            raise forms.ValidationError(
                'Formato no permitido. Solo jpg, png o webp.'
            )

        # content_type lo manda el navegador, no es 100% confiable pero suma
        tipo = getattr(imagen, 'content_type', '')
        if tipo and tipo not in TIPOS_MIME_VALIDOS:
            raise forms.ValidationError(
                'El archivo no parece ser una imagen válida.'
            )

        if imagen.size > TAMANO_MAX_MB * 1024 * 1024:
            raise forms.ValidationError(
                f'La imagen supera el máximo de {TAMANO_MAX_MB}MB.'
            )

        return imagen
