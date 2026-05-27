# formulario para calculadoras

from django import forms


class CalculadoraForm(forms.Form):
    nombre = forms.CharField(
        max_length=200, min_length=3, label='Nombre completo',
        help_text='Entre 3 y 200 caracteres.',
    )
    nombre_corto = forms.CharField(
        max_length=50, label='Nombre corto',
        help_text='Ej: TFG, PSI, IMC. Máx. 50.',
    )
    descripcion = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Descripción',
        help_text='Resumen breve, mínimo 20 caracteres.',
    )
    proposito = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Propósito',
    )
    formula = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Fórmula',
        help_text='Ej: TFG = (140 - edad) × peso / (72 × creatinina).',
    )
    parametros = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5}),
        label='Parámetros',
        help_text='Un parámetro por línea (mínimo 1).',
    )
    unidad_salida = forms.CharField(max_length=100, label='Unidad de salida')
    uso_clinico = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Uso clínico',
    )
    referencia = forms.CharField(max_length=300, label='Referencia bibliográfica')
    categoria = forms.CharField(max_length=80, label='Categoría', required=False)
    etiquetas = forms.CharField(
        max_length=300, required=False,
        label='Etiquetas',
        help_text='Separadas por coma.',
    )

    def clean_descripcion(self):
        v = (self.cleaned_data.get('descripcion') or '').strip()
        if len(v) < 20:
            raise forms.ValidationError(
                'La descripción es muy corta (mínimo 20 caracteres).'
            )
        return v

    def clean_formula(self):
        v = (self.cleaned_data.get('formula') or '').strip()
        if not v:
            raise forms.ValidationError('La fórmula es obligatoria.')
        return v

    def clean_parametros(self):
        v = (self.cleaned_data.get('parametros') or '').strip()
        params = [p.strip() for p in v.split('\n') if p.strip()]
        if not params:
            raise forms.ValidationError(
                'Debes ingresar al menos un parámetro (uno por línea).'
            )
        return v
