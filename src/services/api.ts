// servicio http que habla con el backend django
// en produccion usa EXPO_PUBLIC_API_URL (set en .env del proyecto)
// en dev detecta automaticamente la ip del PC para que el celular fisico llegue

import Constants from 'expo-constants';

// url completa del backend en produccion (sin slash final, sin /api)
// ej: 'https://familymed-backend.onrender.com'
const PROD_API_URL = process.env.EXPO_PUBLIC_API_URL || '';

// si quieres forzar una IP en dev, ponla aqui (ej: '192.168.1.50')
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

const API_PORT = 8000;

// SERVER_BASE_URL = raiz del servidor (sin /api) para construir urls de media
// API_BASE_URL    = raiz de la api con /api al final
export const SERVER_BASE_URL = PROD_API_URL
  ? PROD_API_URL.replace(/\/$/, '')
  : `http://${getApiHost()}:${API_PORT}`;

export const API_BASE_URL = `${SERVER_BASE_URL}/api`;

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

// timeout en ms para todos los fetch, asi la app no se queda colgada
const FETCH_TIMEOUT_MS = 10000;

// helper generico para hacer GET
// agrega el header Authorization si hay JWT guardado
// lanza un Error con mensaje descriptivo si la respuesta no es 2xx, hay timeout
// o no se puede conectar
export async function apiGet<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  // import dinamico para evitar dependencia circular con auth.ts
  const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
  const token = await AsyncStorage.getItem('familymed-jwt');

  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // AbortController para cortar la request si pasa el timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { headers, signal: controller.signal });

    if (!response.ok) {
      throw new Error(
        `Error ${response.status} al consultar ${path}`,
      );
    }

    return (await response.json()) as T;
  } catch (e) {
    // si fue por timeout, mensaje especifico
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error(
        'La conexión tardó demasiado. Verifica tu internet e intenta de nuevo.',
      );
    }
    if (e instanceof TypeError) {
      throw new Error(
        `No se pudo conectar al servidor en ${API_BASE_URL}. ` +
          'Verifica que el backend este corriendo y la IP sea correcta.',
      );
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}
