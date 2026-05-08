# form para que el admin edite un usuario de la app desde el CMS
# no se toca el correo (clave primaria) ni la clave_hash

from django import forms


ROL_CHOICES = [
    ('estudiante', 'Estudiante'),
    ('docente', 'Docente'),
    ('admin', 'Admin'),
]


class UsuarioAppForm(forms.Form):
    nombre_completo = forms.CharField(max_length=200, label='Nombre completo')
    rol = forms.ChoiceField(choices=ROL_CHOICES, label='Rol')
    cedula = forms.CharField(
        max_length=50, required=False, label='Cédula',
    )
    institucion = forms.CharField(
        max_length=200, required=False, label='Institución',
    )
    codigo_programa = forms.CharField(
        max_length=100, required=False, label='Código del programa',
    )
    activo = forms.BooleanField(
        required=False, initial=True, label='Activo',
        help_text='Si se desmarca, el usuario no puede iniciar sesión.',
    )
