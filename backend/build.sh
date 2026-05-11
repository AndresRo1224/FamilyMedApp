#!/usr/bin/env bash
# script de build para Render: instala deps, recolecta estaticos, migra
# y crea el superusuario si no existe (lee credenciales de env vars)

set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate

# crea el superuser solo si no existe todavia
# requiere las env vars: DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_PASSWORD
python manage.py shell -c "
from django.contrib.auth import get_user_model
import os
User = get_user_model()
u = os.environ.get('DJANGO_SUPERUSER_USERNAME')
p = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
e = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')
if not u or not p:
    print('>>> Faltan DJANGO_SUPERUSER_USERNAME y/o DJANGO_SUPERUSER_PASSWORD, salto creacion.')
elif User.objects.filter(username=u).exists():
    print(f'>>> Superuser \"{u}\" ya existe, no se vuelve a crear.')
else:
    User.objects.create_superuser(username=u, password=p, email=e)
    print(f'>>> Superuser \"{u}\" creado.')
"
