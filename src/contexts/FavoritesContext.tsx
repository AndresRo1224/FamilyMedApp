// context de favoritos: guarda en AsyncStorage qué items marco el usuario
// se almacena por tipo: contenido, calculadora, atlas, guia, bibliografia
// uso: const { isFavorite, toggleFavorite } = useFavorites();

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoriteKind =
  | 'contenido'
  | 'calculadora'
  | 'atlas'
  | 'guia'
  | 'bibliografia';

export interface FavoriteEntry {
  kind: FavoriteKind;
  id: string;
  title: string;
  // se guarda fecha para poder ordenar en la pantalla de favoritos
  addedAt: string;
}

const STORAGE_KEY = 'familymed-favorites-v1';

interface FavoritesContextType {
  favorites: FavoriteEntry[];
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  toggleFavorite: (entry: Omit<FavoriteEntry, 'addedAt'>) => void;
  // util para listar favoritos filtrados por tipo
  byKind: (kind: FavoriteKind) => FavoriteEntry[];
  clearAll: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  // carga inicial desde AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as FavoriteEntry[];
          if (Array.isArray(parsed)) setFavorites(parsed);
        }
      } catch {
        // si falla la carga, arranca con lista vacia
      }
    })();
  }, []);

  // helper para persistir
  const persist = useCallback(async (next: FavoriteEntry[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // no-op: si falla la escritura, en memoria sigue funcionando
    }
  }, []);

  const isFavorite = useCallback(
    (kind: FavoriteKind, id: string) =>
      favorites.some((f) => f.kind === kind && f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (entry: Omit<FavoriteEntry, 'addedAt'>) => {
      setFavorites((prev) => {
        const exists = prev.some(
          (f) => f.kind === entry.kind && f.id === entry.id,
        );
        const next = exists
          ? prev.filter((f) => !(f.kind === entry.kind && f.id === entry.id))
          : [
              { ...entry, addedAt: new Date().toISOString() },
              ...prev,
            ];
        persist(next);
        return next;
      });
    },
    [persist],
  );

  const byKind = useCallback(
    (kind: FavoriteKind) => favorites.filter((f) => f.kind === kind),
    [favorites],
  );

  const clearAll = useCallback(() => {
    setFavorites([]);
    persist([]);
  }, [persist]);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, byKind, clearAll }),
    [favorites, isFavorite, toggleFavorite, byKind, clearAll],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites(): FavoritesContextType {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  }
  return ctx;
}
