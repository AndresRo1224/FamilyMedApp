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


# headers de seguridad: solo se activan en produccion (DEBUG=False)
# en dev local quedan apagados para no forzar https en localhost
if not DEBUG:
    # render termina el TLS en su proxy, este header le dice a django que la
    # conexion original fue https
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    # cookies solo por https
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    # HSTS: obliga https por 1 año
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    # evita que el navegador adivine el content-type
    SECURE_CONTENT_TYPE_NOSNIFF = True
    # no permite que el sitio se cargue en un iframe (clickjacking)
    X_FRAME_OPTIONS = 'DENY'
    # confia en el dominio de render para formularios del admin (CSRF)
    # un host '.onrender.com' se convierte en 'https://*.onrender.com'
    CSRF_TRUSTED_ORIGINS = []
    for h in ALLOWED_HOSTS:
        h = h.strip()
        if not h or h == '*':
            continue
        if h.startswith('.'):
            CSRF_TRUSTED_ORIGINS.append(f'https://*{h}')
        else:
            CSRF_TRUSTED_ORIGINS.append(f'https://{h}')


# duracion del JWT propio que emitimos
JWT_LIFETIME_DAYS = 7


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
    'corsheaders',

    # apps del proyecto
    'apps.contenidos',
    'apps.calculadoras',
    'apps.atlas',
    'apps.guias',
    'apps.bibliografia',
    'apps.usuarios',

    # app dummy para mostrar el CMS en la sidebar de jazzmin
    'apps.cms',
]


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # whitenoise sirve los static en produccion sin nginx
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # cors antes de CommonMiddleware
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# permite que la app movil (otro origen) llame al backend
# si se define CORS_ALLOWED_ORIGINS en el .env, se restringe a esos origenes;
# si no, permite todos (la API usa JWT en header, no cookies, asi que el
# riesgo de CSRF es bajo)
_cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', '').strip()
if _cors_origins:
    CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_origins.split(',') if o.strip()]
else:
    CORS_ALLOW_ALL_ORIGINS = True


# configuracion de Django REST Framework
# throttling: limita peticiones por IP para frenar fuerza bruta en auth
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_RATES': {
        'login': '10/min',
        'registro': '5/hour',
        # recuperacion de contraseña: limites estrictos anti abuso
        'reset_solicitar': '5/hour',
        'reset_confirmar': '10/hour',
    },
}


# email: en produccion usa SMTP si EMAIL_HOST esta configurado en el .env;
# en dev (sin config) imprime el correo en la consola para poder ver el codigo
EMAIL_HOST = os.getenv('EMAIL_HOST', '').strip()
if EMAIL_HOST:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
    EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
    DEFAULT_FROM_EMAIL = os.getenv(
        'DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'no-reply@familymed.udes',
    )
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    DEFAULT_FROM_EMAIL = 'FamilyMed UDES <no-reply@familymed.udes>'

# minutos que dura valido el codigo de recuperacion
PASSWORD_RESET_CODE_TTL_MIN = 15
# maximo de intentos de codigo antes de invalidarlo
PASSWORD_RESET_MAX_ATTEMPTS = 5


# logging: imprime tracebacks de errores 500 en los logs del hosting
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
    },
}


ROOT_URLCONF = 'familymed.urls'


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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

# whitenoise comprime los estaticos en produccion
# usamos CompressedStaticFilesStorage (sin Manifest) porque el bootstrap
# que trae django-jazzmin referencia un .map.js que no esta empaquetado
# y el modo Manifest falla si hay referencias rotas
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
    },
}

# archivos subidos por usuarios (imagenes del atlas, etc.)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


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

    # favicon de la pestaña del navegador (escudo UDES)
    'site_icon': 'images/favicon.png',

    # CSS personalizado con paleta UDES (light + dark)
    'custom_css': 'css/admin-udes.css',

    # JS personalizado: toggle de tema claro / oscuro
    'custom_js': 'js/admin-theme.js',

    # buscador
    'search_model': ['auth.User'],

    # apps que solo ve el superusuario admin
    # (los docentes con is_staff=True no veran el modulo de usuarios)
    'hide_apps': [],
    'hide_models': [],

    # menu superior con accesos directos al CMS
    # usamos cms.view_panelcms para que docentes vean el CMS sin necesitar
    # auth.view_user (que mostraria la seccion de Usuarios Django)
    # auth.delete_user lo usamos como heuristica para "es admin"
    'topmenu_links': [
        {'name': 'Inicio', 'url': 'admin:index', 'permissions': ['cms.view_panelcms']},
        {'name': 'Dashboard', 'url': 'cms_dashboard', 'permissions': ['cms.view_panelcms']},
        {'name': 'Contenidos', 'url': 'cms_contenidos_list', 'permissions': ['cms.view_panelcms']},
        {'name': 'Calculadoras', 'url': 'cms_calculadoras_list', 'permissions': ['cms.view_panelcms']},
        {'name': 'Atlas', 'url': 'cms_atlas_list', 'permissions': ['cms.view_panelcms']},
        {'name': 'Guías', 'url': 'cms_guias_list', 'permissions': ['cms.view_panelcms']},
        {'name': 'Bibliografía', 'url': 'cms_bibliografia_list', 'permissions': ['cms.view_panelcms']},
        {'name': 'Usuarios app', 'url': 'cms_usuarios_app_list', 'permissions': ['auth.delete_user']},
        {'name': 'Auditoría', 'url': 'cms_audit', 'permissions': ['auth.delete_user']},
    ],

    # links extra en la sidebar izquierda, todos bajo la app virtual "cms"
    # asi en movil tambien se ven, no solo en el topmenu
    'custom_links': {
        'cms': [
            {
                'name': 'Dashboard',
                'url': 'cms_dashboard',
                'icon': 'fas fa-chart-line',
                'permissions': ['cms.view_panelcms'],
            },
            {
                'name': 'Contenidos',
                'url': 'cms_contenidos_list',
                'icon': 'fas fa-book-open',
                'permissions': ['cms.view_panelcms'],
            },
            {
                'name': 'Calculadoras',
                'url': 'cms_calculadoras_list',
                'icon': 'fas fa-calculator',
                'permissions': ['cms.view_panelcms'],
            },
            {
                'name': 'Atlas',
                'url': 'cms_atlas_list',
                'icon': 'fas fa-images',
                'permissions': ['cms.view_panelcms'],
            },
            {
                'name': 'Guías',
                'url': 'cms_guias_list',
                'icon': 'fas fa-clipboard-list',
                'permissions': ['cms.view_panelcms'],
            },
            {
                'name': 'Bibliografía',
                'url': 'cms_bibliografia_list',
                'icon': 'fas fa-bookmark',
                'permissions': ['cms.view_panelcms'],
            },
            {
                'name': 'Usuarios de la app',
                'url': 'cms_usuarios_app_list',
                'icon': 'fas fa-user-friends',
                'permissions': ['auth.delete_user'],
            },
            {
                'name': 'Auditoría',
                'url': 'cms_audit',
                'icon': 'fas fa-history',
                'permissions': ['auth.delete_user'],
            },
        ],
    },

    # orden de las secciones en la sidebar (CMS arriba, auth abajo)
    'order_with_respect_to': ['cms', 'auth'],

    # iconos por modelo (font awesome 5)
    'icons': {
        'auth': 'fas fa-users-cog',
        'auth.user': 'fas fa-user-md',
        'auth.Group': 'fas fa-users',
        'cms': 'fas fa-th-large',
        'cms.panelcms': 'fas fa-th-large',
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
    'button_classes': {
        'primary': 'btn-primary',
        'secondary': 'btn-secondary',
        'info': 'btn-info',
        'warning': 'btn-warning',
        'danger': 'btn-danger',
        'success': 'btn-success',
    },
}
