// estilos de recuperar contraseña

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const makeRecuperarPasswordStyles = (c: UdesColorPalette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.background },

    banner: {
      backgroundColor: c.primary,
      paddingHorizontal: 16,
      paddingBottom: 18,
      borderBottomLeftRadius: 22,
      borderBottomRightRadius: 22,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 6,
    },
    bannerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.18)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bannerTitle: {
      ...Typography.h3,
      color: '#FFFFFF',
    },

    scrollContent: { padding: 20, paddingBottom: 40 },

    // indicador de pasos
    stepsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 20,
    },
    stepDot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepDotActive: {
      backgroundColor: c.primary,
    },
    stepDotInactive: {
      backgroundColor: c.surfaceAlt,
      borderWidth: 1,
      borderColor: c.border,
    },
    stepDotText: {
      ...Typography.label,
      fontWeight: '700',
    },
    stepLine: {
      width: 40,
      height: 2,
      backgroundColor: c.border,
    },
    stepLineActive: {
      backgroundColor: c.primary,
    },

    helperText: {
      ...Typography.bodySmall,
      color: c.textSecondary,
      marginBottom: 18,
      lineHeight: 20,
    },
    emailHint: {
      ...Typography.body,
      color: c.text,
      fontWeight: '700',
    },

    inputGroup: { marginBottom: 16 },
    inputLabel: {
      ...Typography.label,
      color: c.textSecondary,
      marginBottom: 6,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
      height: 50,
    },
    inputIcon: { marginRight: 10 },
    input: {
      ...Typography.body,
      flex: 1,
      color: c.text,
      paddingVertical: 0,
    },
    // input del codigo: grande y centrado
    codeInput: {
      ...Typography.h2,
      backgroundColor: c.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      color: c.text,
      textAlign: 'center',
      letterSpacing: 8,
      height: 60,
    },

    primaryButton: {
      backgroundColor: c.primary,
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      ...Typography.button,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    linkButton: {
      marginTop: 16,
      alignItems: 'center',
    },
    linkText: {
      ...Typography.bodySmall,
      color: c.primary,
      fontWeight: '600',
    },
  });
