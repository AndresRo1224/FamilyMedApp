// estilos de calculadoras

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const makeCalculadorasStyles = (c: UdesColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },

  // banner azul
  headerBanner: {
    backgroundColor: c.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
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
  title: {
    ...Typography.h1,
    color: '#FFFFFF',
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 4,
  },

  // lista
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 14,
  },
  card: {
    backgroundColor: c.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: c.border,
    shadowColor: c.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // encabezado de la card
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  shortNameBadge: {
    backgroundColor: c.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexShrink: 0,
  },
  shortNameText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  outputBadge: {
    ...Typography.caption,
    color: c.gold,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
    flexShrink: 1,
    marginLeft: 10,
    textAlign: 'right',
  },

  cardTitle: {
    ...Typography.h4,
    color: c.text,
    marginBottom: 4,
  },
  cardDescription: {
    ...Typography.bodySmall,
    color: c.textSecondary,
    marginBottom: 12,
  },

  // caja de formula
  formulaBox: {
    backgroundColor: c.surfaceAlt,
    borderLeftWidth: 3,
    borderLeftColor: c.primary,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  formulaLabel: {
    ...Typography.caption,
    color: c.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  formulaText: {
    ...Typography.bodySmall,
    color: c.text,
  },

  // seccion de inputs
  sectionLabel: {
    ...Typography.caption,
    color: c.textTertiary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  inputsList: {
    gap: 5,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inputDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: c.gold,
  },
  inputText: {
    ...Typography.bodySmall,
    color: c.textSecondary,
    flex: 1,
  },

  // uso clinico
  clinicalUseBox: {
    backgroundColor: c.surfaceAlt,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  clinicalUseText: {
    ...Typography.bodySmall,
    color: c.textSecondary,
  },

  reference: {
    ...Typography.caption,
    color: c.textTertiary,
    fontStyle: 'italic',
  },

  // estados loading / error / empty
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Typography.body,
    color: c.textSecondary,
    textAlign: 'center',
  },
});
