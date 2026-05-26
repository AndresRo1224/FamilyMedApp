// entrada principal de la app

import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen, {
  ONBOARDING_KEY,
} from './src/screens/Onboarding/OnboardingScreen';
import OfflineBanner from './src/components/OfflineBanner';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { queryClient } from './src/services/queryClient';

// tiempo minimo que se queda el splash visible (ms) para que se alcance a ver
// el branding incluso cuando la sesion se resuelve en <100ms
const MIN_SPLASH_MS = 1200;

// mantener el splash visible hasta que la app este lista
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op
});

// envuelve la navegacion para que reaccione al tema (fondo + statusbar)
function ThemedApp() {
  const { colors, isDark } = useTheme();
  const { loading: authLoading } = useAuth();
  const [splashHidden, setSplashHidden] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);

  // onboarding: revisa una sola vez si ya se vio
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const done = await AsyncStorage.getItem(ONBOARDING_KEY);
        setNeedsOnboarding(done !== '1');
      } catch {
        setNeedsOnboarding(false);
      }
    })();
  }, []);

  // garantiza que el splash se vea al menos MIN_SPLASH_MS
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), MIN_SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  // tema de react-navigation
  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  // oculta el splash cuando ya termino la sesion + paso el tiempo minimo + se sabe si necesita onboarding
  const onLayoutRoot = useCallback(async () => {
    const ready =
      !authLoading && minTimePassed && needsOnboarding !== null && !splashHidden;
    if (ready) {
      await SplashScreen.hideAsync();
      setSplashHidden(true);
    }
  }, [authLoading, minTimePassed, needsOnboarding, splashHidden]);

  useEffect(() => {
    onLayoutRoot();
  }, [onLayoutRoot]);

  // mientras estemos en splash, no renderizamos nada (lo muestra el RootNavigator vacio)
  const stillLoading =
    authLoading || !minTimePassed || needsOnboarding === null;

  // si nunca ha visto el onboarding, mostrarlo antes de la app
  if (!stillLoading && needsOnboarding) {
    return (
      <>
        <StatusBar style="light" />
        <OnboardingScreen onDone={() => setNeedsOnboarding(false)} />
      </>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator forceLoading={stillLoading} />
      <OfflineBanner />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <FavoritesProvider>
              <AuthProvider>
                <ThemedApp />
              </AuthProvider>
            </FavoritesProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
