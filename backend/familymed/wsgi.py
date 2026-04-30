# wsgi para servir el proyecto en produccion

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'familymed.settings')

application = get_wsgi_application()
