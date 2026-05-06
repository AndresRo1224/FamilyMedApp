# formulario para calculadoras

from django import forms


class CalculadoraForm(forms.Form):
    nombre = forms.CharField(max_length=200, label='Nombre completo')
    nombre_corto = forms.CharField(max_length=50, label='Nombre corto')
    descripcion = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Descripción',
    )
    proposito = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Propósito',
    )
    formula = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 3}), label='Fórmula',
    )
    parametros = forms.CharField(
        widget=forms.Textarea(attrs={'rows': 5}),
        label='Parámetros',
        help_text='Un parámetro por línea',
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
        help_text='Separadas por coma',
    )
