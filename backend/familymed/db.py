# conexion a mongodb atlas

import os
import sys
from pathlib import Path

import certifi
from pymongo import MongoClient
from pymongo.errors import ConfigurationError, ConnectionFailure

# si python-dotenv esta instalado, carga el .env del backend
try:
    from dotenv import load_dotenv

    env_path = Path(__file__).resolve().parent.parent / '.env'
    load_dotenv(env_path)
except ImportError:
    pass


# nombre de la base de datos en el cluster
DB_NAME = 'familymed'


def get_client():
    # crea el cliente de mongo leyendo la URI desde el .env
    # tlsCAFile usa los certificados raiz de certifi (arregla el SSL en Windows)
    uri = os.getenv('MONGODB_URI')
    if not uri:
        raise RuntimeError(
            'No se encontro MONGODB_URI. '
            'Crea backend/.env con esa variable apuntando al cluster de Atlas.'
        )
    return MongoClient(
        uri,
        tlsCAFile=certifi.where(),
        serverSelectionTimeoutMS=5000,
    )


def get_db():
    # devuelve la base de datos familymed
    return get_client()[DB_NAME]


def test_connection():
    # intenta hacer ping al cluster y muestra el resultado en consola
    try:
        client = get_client()
        client.admin.command('ping')

        db = client[DB_NAME]
        collections = db.list_collection_names()

        print('Conexion exitosa a MongoDB Atlas')
        print(f'Base de datos: {DB_NAME}')
        print(f'Colecciones encontradas ({len(collections)}):')
        for c in collections:
            print(f'  - {c}')
        return True

    except (ConnectionFailure, ConfigurationError) as e:
        print(f'Error de conexion: {e}')
        return False
    except Exception as e:
        print(f'Error inesperado: {e}')
        return False


# permite correr este archivo directamente para probar la conexion
if __name__ == '__main__':
    ok = test_connection()
    sys.exit(0 if ok else 1)
