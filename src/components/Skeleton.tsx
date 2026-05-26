// componentes skeleton (placeholders animados que se ven mientras carga la data)
// la idea es que se sienta mas rapido que un ActivityIndicator y respeta el layout final

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '../contexts/ThemeContext';

interface SkeletonProps {
  width?: number | `${number}%` | 'auto';
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

// bloque base animado (pulse de opacidad)
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 14,
  borderRadius = 6,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });

  // mas claro en dark, mas oscuro en light, para que destaque
  const bgColor = isDark ? colors.surfaceAlt : colors.borderSubtle;

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: bgColor, opacity },
        style,
      ]}
    />
  );
};

// card skeleton generica que imita una card de contenido/calculadora/guia
export const SkeletonCard: React.FC<{ variant?: 'content' | 'compact' | 'tall' }> = ({
  variant = 'content',
}) => {
  const { colors } = useTheme();
  const s = makeSkeletonStyles(colors);

  if (variant === 'compact') {
    return (
      <View style={s.card}>
        <View style={s.row}>
          <Skeleton width={60} height={22} borderRadius={10} />
          <Skeleton width={50} height={12} />
        </View>
        <Skeleton width="80%" height={18} style={{ marginTop: 12 }} />
        <Skeleton width="60%" height={14} style={{ marginTop: 8 }} />
      </View>
    );
  }

  if (variant === 'tall') {
    return (
      <View style={s.card}>
        <Skeleton width="100%" height={140} borderRadius={10} />
        <Skeleton width="85%" height={18} style={{ marginTop: 14 }} />
        <Skeleton width="55%" height={14} style={{ marginTop: 8 }} />
      </View>
    );
  }

  // content (default)
  return (
    <View style={s.card}>
      <View style={s.row}>
        <Skeleton width={80} height={22} borderRadius={10} />
        <Skeleton width={45} height={12} />
      </View>
      <Skeleton width="90%" height={18} style={{ marginTop: 12 }} />
      <Skeleton width="70%" height={14} style={{ marginTop: 8 }} />
      <View style={{ marginTop: 14, gap: 8 }}>
        <Skeleton width="95%" height={12} />
        <Skeleton width="80%" height={12} />
      </View>
    </View>
  );
};

// lista de N skeleton cards para usar como placeholder de pantallas de listado
interface SkeletonListProps {
  count?: number;
  variant?: 'content' | 'compact' | 'tall';
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 5,
  variant = 'content',
}) => {
  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 14 }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </View>
  );
};

const makeSkeletonStyles = (c: ReturnType<typeof useTheme>['colors']) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: 14,
      padding: 16,
      borderWidth: 1,
      borderColor: c.border,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
