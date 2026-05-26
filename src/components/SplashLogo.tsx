// pantalla de bienvenida con branding UDES
// se muestra mientras se carga la sesion y como fallback en Expo Go
// (donde el splash nativo no aplica)

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
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // pulse sutil del logo para que no se vea estatico
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fade, pulse]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND_BLUE} />

      <Animated.View
        style={{
          opacity: fade,
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={[styles.logoCard, { transform: [{ scale: pulse }] }]}
        >
          <Image
            source={require('../../assets/images/logo udes color + EQUAA.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <View style={styles.accent} />

        <Text style={styles.title}>FamilyMed</Text>
        <Text style={styles.subtitle}>Medicina Familiar · UDES</Text>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator color="rgba(255, 255, 255, 0.9)" />
        <Text style={styles.footerText}>Universidad de Santander</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoCard: {
    width: 180,
    height: 180,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  accent: {
    width: 48,
    height: 4,
    backgroundColor: BRAND_GOLD,
    borderRadius: 2,
    marginTop: 28,
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 0.3,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    letterSpacing: 0.5,
  },
});

export default SplashLogo;
