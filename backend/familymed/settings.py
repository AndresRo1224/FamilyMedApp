# configuracion del proyecto django

import os
from pathlib import Path

# carga las variables del .env si python-dotenv esta instalado
try:
    from dotenv import load_dotenv

    load_dotenv(Path(__file__).resolve().parent.parent / '.env')
except ImportError:
    pass


# raiz del proyecto (carpeta backend/)
BASE_DIR = Path(__file__).resolve().parent.parent


# clave secreta - viene del .env, fallback solo para dev local
SECRET_KEY = os.getenv(
    'DJANGO_SECRET_KEY',
    'dev-insecure-cambiar-en-produccion',
)

# modo debug - en produccion debe ser False
DEBUG = os.getenv('DJANGO_DEBUG', 'True') == 'True'

# hosts permitidos
ALLOWED_HOSTS = os.getenv(
    'DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1',
).split(',')


# apps instaladas
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # api rest
    'rest_framework',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'familymed.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'familymed.wsgi.application'


# sqlite local solo para auth, sessions y meta del admin de django
# los datos clinicos del proyecto van por pymongo, no por ORM
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# validadores de password
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# idioma y zona horaria
LANGUAGE_CODE = 'es-co'
TIME_ZONE = 'America/Bogota'
USE_I18N = True
USE_TZ = True


# archivos estaticos
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
