// context global de toasts (snackbars) - alternativa mas linda al Alert nativo
// uso: const { showToast } = useToast(); showToast('Guardado', 'success');

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from './ThemeContext';

export type ToastKind = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  kind: ToastKind;
}

interface ToastContextType {
  showToast: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      // si hay otro toast visible, limpia su timer
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
      setToast({ message, kind });
    },
    [],
  );

  useEffect(() => {
    if (!toast) return;

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        speed: 14,
        bounciness: 5,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    hideTimeout.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setToast(null);
      });
    }, 2600);

    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [toast, translateY, opacity]);

  // configuracion visual por tipo
  const visualFor = (kind: ToastKind) => {
    if (kind === 'success') {
      return { bg: colors.success, icon: 'checkmark-circle' as const };
    }
    if (kind === 'error') {
      return { bg: colors.danger, icon: 'alert-circle' as const };
    }
    return { bg: colors.primary, icon: 'information-circle' as const };
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.wrapper,
            {
              top: insets.top + 8,
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <View
            style={[
              styles.bubble,
              { backgroundColor: visualFor(toast.kind).bg },
            ]}
          >
            <Ionicons
              name={visualFor(toast.kind).icon}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.text} numberOfLines={3}>
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return ctx;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
});
