// estilos de la pantalla principal

import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // banner azul superior
  headerBanner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 26,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  headerAccent: {
    width: 42,
    height: 4,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    marginBottom: 14,
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
    color: Colors.text,
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
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  moduleAccent: {
    width: 36,
    height: 4,
    backgroundColor: Colors.gold,
    borderRadius: 2,
    marginBottom: 12,
  },
  moduleTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: 4,
  },
  moduleDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 10,
    minHeight: 36,
  },
  moduleCount: {
    ...Typography.caption,
    color: Colors.primary,
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
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  recentModule: {
    ...Typography.caption,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    fontWeight: '700',
  },
  recentTitle: {
    ...Typography.bodyLarge,
    color: Colors.text,
    marginBottom: 10,
    minHeight: 48,
  },
  recentDate: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
