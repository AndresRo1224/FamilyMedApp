// entrada principal de la app

import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { queryClient } from './src/services/queryClient';

// mantener el splash visible hasta que la app este lista
// (sino el splash desaparece tan pronto se monta JS y se ve un parpadeo blanco)
SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: ya estaba oculto
});

// envuelve la navegacion para que reaccione al tema (fondo + statusbar)
function ThemedApp() {
  const { colors, isDark } = useTheme();
  const { loading: authLoading } = useAuth();
  const [splashHidden, setSplashHidden] = useState(false);

  // tema de react-navigation para que el fondo entre transiciones sea el correcto
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

  // oculta el splash cuando ya termino la revision de sesion guardada
  // asi el usuario no ve un loading spinner feo al abrir la app
  const onLayoutRoot = useCallback(async () => {
    if (!authLoading && !splashHidden) {
      await SplashScreen.hideAsync();
      setSplashHidden(true);
    }
  }, [authLoading, splashHidden]);

  useEffect(() => {
    onLayoutRoot();
  }, [onLayoutRoot]);

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <ThemedApp />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
