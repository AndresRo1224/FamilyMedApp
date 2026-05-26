// banner global que aparece cuando se pierde conexion a internet
// se monta una sola vez en App.tsx, se posiciona absoluto arriba

import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';

const OfflineBanner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [offline, setOffline] = useState(false);
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected && state.isInternetReachable !== false;
      setOffline(!isOnline);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: offline ? 0 : -100,
      useNativeDriver: true,
      speed: 14,
      bounciness: 4,
    }).start();
  }, [offline, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrapper,
        {
          paddingTop: insets.top + 8,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.bar}>
        <Ionicons name="cloud-offline" size={16} color="#1A1F35" />
        <Text style={styles.text}>
          Sin conexión · Mostrando datos guardados
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    // amarillo UDES con buen contraste; se ve sobre cualquier banner
    backgroundColor: '#FFB300',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  text: {
    color: '#1A1F35',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default OfflineBanner;
