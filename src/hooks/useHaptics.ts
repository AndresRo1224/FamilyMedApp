// wrapper sobre expo-haptics que no se cae en plataformas sin soporte
// uso: const { tap, success, warning, error } = useHaptics();

import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const safe = (fn: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => {
    // no-op: algunos dispositivos no soportan haptics
  });
};

export function useHaptics() {
  return {
    // toque ligero, ideal para tabs, chips, botones secundarios
    tap: () =>
      safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
    // toque medio, para acciones principales (abrir detalle, guardar)
    medium: () =>
      safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
    // confirmacion positiva (guardado exitoso)
    success: () =>
      safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
    // advertencia (validacion no critica)
    warning: () =>
      safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
    // error (validacion critica, accion fallida)
    error: () =>
      safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  };
}
