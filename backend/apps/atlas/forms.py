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
        help_text='Sube una imagen jpg/png/webp (máx 5MB). Si no subes nada y ya hay una, se mantiene.',
    )

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
