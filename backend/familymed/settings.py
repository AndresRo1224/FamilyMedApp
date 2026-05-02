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
    # tema del admin (debe ir antes de django.contrib.admin)
    'jazzmin',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # api rest
    'rest_framework',

    # apps del proyecto
    'apps.contenidos',
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

# carpeta extra de archivos estaticos del proyecto (logo UDES, CSS custom)
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# configuracion del tema jazzmin (admin de django con branding UDES)
JAZZMIN_SETTINGS = {
    # textos del sitio
    'site_title': 'FamilyMed Admin',
    'site_header': 'FamilyMed',
    'site_brand': 'FamilyMed',
    'welcome_sign': 'Bienvenido al panel de FamilyMed',
    'copyright': 'Universidad de Santander · UDES',

    # logo UDES (en la sidebar y login)
    'site_logo': 'images/logo.png',
    'login_logo': 'images/logo.png',
    'site_logo_classes': 'img-circle',

    # CSS personalizado con paleta UDES (light + dark)
    'custom_css': 'css/admin-udes.css',

    # JS personalizado: toggle de tema claro / oscuro
    'custom_js': 'js/admin-theme.js',

    # buscador
    'search_model': ['auth.User'],

    # menu superior
    'topmenu_links': [
        {'name': 'Inicio', 'url': 'admin:index', 'permissions': ['auth.view_user']},
    ],

    # iconos por modelo (font awesome 5)
    'icons': {
        'auth': 'fas fa-users-cog',
        'auth.user': 'fas fa-user-md',
        'auth.Group': 'fas fa-users',
    },
    'default_icon_parents': 'fas fa-chevron-circle-right',
    'default_icon_children': 'fas fa-circle',

    # comportamiento
    'related_modal_active': True,
    'show_ui_builder': False,
    'changeform_format': 'horizontal_tabs',
}


# tweaks visuales del tema (paleta y layout)
JAZZMIN_UI_TWEAKS = {
    'navbar_small_text': False,
    'footer_small_text': False,
    'body_small_text': False,
    'brand_small_text': False,
    'brand_colour': 'navbar-primary',
    'accent': 'accent-primary',
    'navbar': 'navbar-primary navbar-dark',
    'no_navbar_border': False,
    'navbar_fixed': True,
    'layout_boxed': False,
    'footer_fixed': False,
    'sidebar_fixed': True,
    'sidebar': 'sidebar-dark-primary',
    'sidebar_nav_small_text': False,
    'sidebar_disable_expand': False,
    'sidebar_nav_child_indent': False,
    'sidebar_nav_compact_style': False,
    'sidebar_nav_legacy_style': False,
    'sidebar_nav_flat_style': False,
    'theme': 'default',
    'dark_mode_theme': None,
    'button_classes': {
        'primary': 'btn-primary',
        'secondary': 'btn-secondary',
        'info': 'btn-info',
        'warning': 'btn-warning',
        'danger': 'btn-danger',
        'success': 'btn-success',
    },
}
