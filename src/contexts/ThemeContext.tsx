// context del tema (claro / oscuro / sistema) con persistencia en AsyncStorage

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  UdesColorPalette,
  darkColors,
  lightColors,
} from '../constants/colors';

// 'system' sigue el ajuste del telefono
export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'familymed-theme';

interface ThemeContextType {
  colors: UdesColorPalette;
  mode: ThemeMode; // lo que eligio el usuario
  isDark: boolean; // el tema efectivo que se ve
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setModeState] = useState<ThemeMode>('system');

  // al iniciar carga la preferencia guardada
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved);
      }
    })();
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  // el tema efectivo: si es 'system' usa el del telefono
  const isDark =
    mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({ colors, mode, isDark, setMode }),
    [colors, mode, isDark, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// hook para leer el tema en cualquier pantalla
export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return ctx;
}
