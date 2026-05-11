#!/usr/bin/env bash
# script de build para Render: instala deps, recolecta estaticos y corre migraciones

set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input

python manage.py migrate
