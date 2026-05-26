// estilos del login

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const makeLoginStyles = (c: UdesColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 40,
    },

    // banner azul con logo
    banner: {
      backgroundColor: c.primary,
      paddingHorizontal: 20,
      paddingBottom: 36,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      alignItems: 'center',
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 8,
    },
    logoContainer: {
      width: 150,
      height: 150,
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
      padding: 10,
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    appName: {
      ...Typography.h1,
      color: '#FFFFFF',
      marginBottom: 4,
    },
    institution: {
      ...Typography.body,
      color: 'rgba(255, 255, 255, 0.85)',
    },

    // formulario
    form: {
      padding: 24,
      marginTop: 8,
    },
    formTitle: {
      ...Typography.h3,
      color: c.text,
      marginBottom: 4,
    },
    formSubtitle: {
      ...Typography.body,
      color: c.textSecondary,
      marginBottom: 24,
    },

    // inputs
    inputGroup: {
      marginBottom: 16,
    },
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
    inputWrapperFocused: {
      borderColor: c.primary,
      borderWidth: 2,
    },
    inputIcon: {
      marginRight: 10,
    },
    input: {
      ...Typography.body,
      flex: 1,
      color: c.text,
      paddingVertical: 0,
    },
    togglePassword: {
      padding: 4,
    },

    // link olvide contraseña
    forgotLink: {
      alignSelf: 'flex-end',
      marginTop: 4,
      marginBottom: 24,
    },
    forgotText: {
      ...Typography.bodySmall,
      color: c.primary,
      fontWeight: '600',
    },

    // boton principal
    primaryButton: {
      backgroundColor: c.primary,
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
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

    // divider
    dividerWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: c.border,
    },
    dividerText: {
      ...Typography.caption,
      color: c.textTertiary,
      marginHorizontal: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // boton secundario
    secondaryButton: {
      backgroundColor: c.surface,
      borderRadius: 12,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: c.border,
    },
    secondaryButtonText: {
      ...Typography.button,
      color: c.primary,
    },

    // footer
    footer: {
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 16,
    },
    footerText: {
      ...Typography.caption,
      color: c.textTertiary,
      textAlign: 'center',
    },
  });
