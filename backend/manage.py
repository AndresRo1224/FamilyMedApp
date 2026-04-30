#!/usr/bin/env python
# punto de entrada de comandos de django

import os
import sys


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'familymed.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            'No se pudo importar Django. Verifica que este instalado '
            '(pip install -r requirements.txt) y que el venv este activo.'
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
