// context global para saber si hay usuario logueado

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  AuthUser,
  changePassword as apiChangePassword,
  clearAuth,
  fetchProfile,
  getCachedUser,
  getToken,
  loginWithEmail,
  registerWithEmail,
  saveToken,
  saveUser,
  updateProfile as apiUpdateProfile,
} from '../services/auth';

interface UpdateProfilePayload {
  nombre_completo?: string;
  cedula?: string;
  institucion?: string;
  codigo_programa?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (correo: string, password: string) => Promise<void>;
  signUp: (params: {
    correo: string;
    password: string;
    nombre_completo: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (cambios: UpdateProfilePayload) => Promise<void>;
  changePassword: (params: {
    password_actual: string;
    password_nueva: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // al iniciar la app revisa si hay sesion guardada
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const profile = await fetchProfile();
        if (profile) {
          await saveUser(profile);
          setUser(profile);
        } else {
          const cached = await getCachedUser();
          if (cached) setUser(cached);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (correo: string, password: string) => {
    const { jwt, user: u } = await loginWithEmail({ correo, password });
    await saveToken(jwt);
    await saveUser(u);
    setUser(u);
  }, []);

  const signUp = useCallback(
    async (params: {
      correo: string;
      password: string;
      nombre_completo: string;
    }) => {
      const { jwt, user: u } = await registerWithEmail(params);
      await saveToken(jwt);
      await saveUser(u);
      setUser(u);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await clearAuth();
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await fetchProfile();
    if (profile) {
      await saveUser(profile);
      setUser(profile);
    }
  }, []);

  // actualiza campos del perfil y refresca el usuario en el contexto
  const updateProfile = useCallback(
    async (cambios: UpdateProfilePayload) => {
      const updated = await apiUpdateProfile(cambios);
      await saveUser(updated);
      setUser(updated);
    },
    [],
  );

  // cambia la contraseña; no toca el usuario en contexto (no cambia datos visibles)
  const changePassword = useCallback(
    async (params: { password_actual: string; password_nueva: string }) => {
      await apiChangePassword(params);
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook para usar el contexto en cualquier pantalla
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
