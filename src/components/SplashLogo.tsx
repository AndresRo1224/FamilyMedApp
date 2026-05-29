// pantalla de bienvenida con branding UDES
// se muestra mientras se carga la sesion y como fallback en Expo Go
// (donde el splash nativo no aplica). Fondo blanco + logo, igual que el splash nativo.

import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const BRAND_BLUE = '#004899';
const BRAND_GOLD = '#C99F81';

const SplashLogo: React.FC = () => {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(rise, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY: rise }],
          alignItems: 'center',
          paddingHorizontal: 28,
        }}
      >
        <Image
          source={require('../../assets/images/logo udes color + EQUAA.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <View style={styles.accent} />

        <Text style={styles.title}>FamilyMed</Text>
        <Text style={styles.subtitle}>Medicina Familiar</Text>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator color={BRAND_BLUE} />
        <Text style={styles.footerText}>Universidad de Santander</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 280,
    height: 110,
  },
  accent: {
    width: 48,
    height: 4,
    backgroundColor: BRAND_GOLD,
    borderRadius: 2,
    marginTop: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: BRAND_BLUE,
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    color: '#5B6378',
    letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 56,
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#8891A4',
    letterSpacing: 0.5,
  },
});

export default SplashLogo;
