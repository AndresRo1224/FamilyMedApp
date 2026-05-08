// servicio de autenticacion: registro + login con email/password + manejo del JWT

import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_BASE_URL } from './api';

const TOKEN_KEY = 'familymed-jwt';
const USER_KEY = 'familymed-user';

// info del usuario logueado
export interface AuthUser {
  id: string;
  correo: string;
  nombre_completo: string;
  rol: string;
  institucion?: string;
  codigo_programa?: string;
}

// guarda el JWT en AsyncStorage
export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

// lee el JWT guardado, o null si no hay
export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

// guarda el usuario en cache local
export async function saveUser(user: AuthUser): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

// lee el usuario del cache local
export async function getCachedUser(): Promise<AuthUser | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

// borra el JWT y el usuario (para logout)
export async function clearAuth(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

// helper que parsea la respuesta y lanza error con el mensaje del backend
async function parseAuthResponse(
  response: Response,
): Promise<{ jwt: string; user: AuthUser }> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Error ${response.status}`);
  }
  return { jwt: data.jwt, user: data.usuario };
}

// crea una cuenta nueva
export async function registerWithEmail(params: {
  correo: string;
  password: string;
  nombre_completo: string;
}): Promise<{ jwt: string; user: AuthUser }> {
  const response = await fetch(`${API_BASE_URL}/auth/registro/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return parseAuthResponse(response);
}

// inicia sesion con email + password
export async function loginWithEmail(params: {
  correo: string;
  password: string;
}): Promise<{ jwt: string; user: AuthUser }> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return parseAuthResponse(response);
}

// trae el perfil actual desde el backend usando el JWT guardado
export async function fetchProfile(): Promise<AuthUser | null> {
  const token = await getToken();
  if (!token) return null;

  const response = await fetch(`${API_BASE_URL}/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;
  return (await response.json()) as AuthUser;
}
