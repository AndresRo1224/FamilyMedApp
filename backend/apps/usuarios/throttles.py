# limites de peticiones para los endpoints de auth (anti fuerza bruta)
# las tasas se definen en settings.REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']

from rest_framework.throttling import AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    scope = 'login'


class RegistroRateThrottle(AnonRateThrottle):
    scope = 'registro'


class ResetSolicitarThrottle(AnonRateThrottle):
    scope = 'reset_solicitar'


class ResetConfirmarThrottle(AnonRateThrottle):
    scope = 'reset_confirmar'
