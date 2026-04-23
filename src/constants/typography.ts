// tipografia de la app - Open Sans

import { Platform, TextStyle } from 'react-native';

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

// tamaños de fuente
export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 34,
  display: 42,
} as const;

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

export const FontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
} as const;

// estilos listos para usar
export const Typography: Record<string, TextStyle> = {
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

export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

export default Typography;
