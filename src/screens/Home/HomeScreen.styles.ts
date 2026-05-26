// estilos de la pantalla principal

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const makeHomeStyles = (c: UdesColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // banner azul superior
  headerBanner: {
    backgroundColor: c.primary,
    paddingHorizontal: 20,
    paddingBottom: 26,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: c.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerAccent: {
    width: 42,
    height: 4,
    backgroundColor: c.gold,
    borderRadius: 2,
    marginBottom: 14,
  },
  settingsButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  greeting: {
    ...Typography.h1,
    color: '#FFFFFF',
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },

  // titulos de seccion
  sectionTitle: {
    ...Typography.h3,
    color: c.text,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },

  // grid de modulos
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  moduleCard: {
    backgroundColor: c.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  moduleAccent: {
    width: 36,
    height: 4,
    backgroundColor: c.gold,
    borderRadius: 2,
    marginBottom: 12,
  },
  moduleTitle: {
    ...Typography.h4,
    color: c.text,
    marginBottom: 4,
  },
  moduleDescription: {
    ...Typography.bodySmall,
    color: c.textSecondary,
    marginBottom: 10,
    minHeight: 36,
  },
  moduleCount: {
    ...Typography.caption,
    color: c.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },

  // recientes
  recentList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  recentCard: {
    width: 210,
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  recentModule: {
    ...Typography.caption,
    color: c.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    fontWeight: '700',
  },
  recentTitle: {
    ...Typography.bodyLarge,
    color: c.text,
    marginBottom: 10,
    minHeight: 48,
  },
  recentDate: {
    ...Typography.caption,
    color: c.textTertiary,
  },
});
