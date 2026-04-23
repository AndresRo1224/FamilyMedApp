/**
 * Sistema tipográfico UDES - FamilyMed App
 * Fuente oficial: Open Sans
 * Universidad de Santander - Medicina Familiar
 */

import { Platform, TextStyle } from 'react-native';

/**
 * Familias tipográficas Open Sans.
 * En React Native se usan nombres del postScriptName en iOS
 * y nombres del archivo en Android (sin extensión).
 */
export const FontFamily = {
  regular: Platform.select({
    ios: 'OpenSans-Regular',
    android: 'OpenSans-Regular',
    default: 'System',
  }) as string,

  medium: Platform.select({
    ios: 'OpenSans-Medium',
    android: 'OpenSans-Medium',
    default: 'System',
  }) as string,

  semiBold: Platform.select({
    ios: 'OpenSans-SemiBold',
    android: 'OpenSans-SemiBold',
    default: 'System',
  }) as string,

  bold: Platform.select({
    ios: 'OpenSans-Bold',
    android: 'OpenSans-Bold',
    default: 'System',
  }) as string,

  light: Platform.select({
    ios: 'OpenSans-Light',
    android: 'OpenSans-Light',
    default: 'System',
  }) as string,
} as const;

/**
 * Escala de tamaños de fuente (en píxeles).
 * Basada en una escala modular 1.25 para buena jerarquía visual.
 */
export const FontSize = {
  xs: 11,    // Etiquetas diminutas, pies de página
  sm: 13,    // Texto secundario, captions
  base: 15,  // Texto base de lectura
  md: 17,    // Texto destacado
  lg: 20,    // Subtítulos
  xl: 24,    // Títulos de sección
  xxl: 28,   // Títulos de pantalla
  xxxl: 34,  // Títulos principales / hero
  display: 42, // Números grandes (resultados de calculadoras)
} as const;

/**
 * Alturas de línea coherentes con cada tamaño de fuente.
 * Factor ~1.4 para texto general y ~1.2 para títulos.
 */
export const LineHeight = {
  xs: 16,
  sm: 18,
  base: 22,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 36,
  xxxl: 42,
  display: 50,
} as const;

/**
 * Pesos de fuente estandarizados.
 */
export const FontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

/**
 * Estilos tipográficos predefinidos listos para usar en componentes.
 * Garantizan consistencia en toda la app.
 */
export const Typography: Record<string, TextStyle> = {
  // Títulos principales
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxxl,
    lineHeight: LineHeight.xxxl,
    fontWeight: FontWeight.bold,
  },
  h2: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    lineHeight: LineHeight.xxl,
    fontWeight: FontWeight.bold,
  },
  h3: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xl,
    lineHeight: LineHeight.xl,
    fontWeight: FontWeight.semiBold,
  },
  h4: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    lineHeight: LineHeight.lg,
    fontWeight: FontWeight.semiBold,
  },

  // Texto corporal
  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    lineHeight: LineHeight.md,
    fontWeight: FontWeight.regular,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontWeight: FontWeight.regular,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.regular,
  },

  // Elementos utilitarios
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: LineHeight.xs,
    fontWeight: FontWeight.regular,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.3,
  },
  button: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    lineHeight: LineHeight.base,
    fontWeight: FontWeight.semiBold,
    letterSpacing: 0.4,
  },

  // Específicos para datos clínicos
  metricValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.display,
    lineHeight: LineHeight.display,
    fontWeight: FontWeight.bold,
  },
  metricLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: LineHeight.sm,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
  },
};

/**
 * Espaciado entre letras estandarizado.
 */
export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

export default Typography;
