// servicio http que habla con el backend django
// detecta automaticamente la ip del PC cuando corre en celular fisico

import Constants from 'expo-constants';

// si quieres forzar una IP, ponla aqui (ej: '192.168.1.50')
// si la dejas vacia, intenta detectar la del Metro Bundler
const MANUAL_API_HOST = '';

function getApiHost(): string {
  if (MANUAL_API_HOST) return MANUAL_API_HOST;

  // hostUri suele venir como '192.168.1.50:8081' (la ip del PC en la red wifi)
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(':')[0];
  }
  return 'localhost';
}

const API_HOST = getApiHost();
const API_PORT = 8000;
export const API_BASE_URL = `http://${API_HOST}:${API_PORT}/api`;

// raiz del servidor (sin /api) para construir urls de media
export const SERVER_BASE_URL = `http://${API_HOST}:${API_PORT}`;

// arma una URL completa para archivos en /media/
// si recibe una url absoluta (http...) la devuelve tal cual
export function buildMediaUrl(path: string | undefined | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // normaliza el path: quita / al inicio si lo tiene
  const clean = path.startsWith('/') ? path.substring(1) : path;
  // si ya viene con 'media/', no lo duplica
  if (clean.startsWith('media/')) {
    return `${SERVER_BASE_URL}/${clean}`;
  }
  return `${SERVER_BASE_URL}/media/${clean}`;
}

// helper generico para hacer GET
// lanza un Error con mensaje descriptivo si la respuesta no es 2xx
export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Error ${response.status} al consultar ${path}`,
      );
    }

    return (await response.json()) as T;
  } catch (e) {
    if (e instanceof TypeError) {
      // suele ser network error (server caido, sin wifi, ip mal)
      throw new Error(
        `No se pudo conectar al servidor en ${API_BASE_URL}. ` +
          'Verifica que el backend este corriendo y la IP sea correcta.',
      );
    }
    throw e;
  }
}
