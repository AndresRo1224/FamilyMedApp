// estilos de contenidos

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const makeContenidosStyles = (c: UdesColorPalette) => StyleSheet.create({
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

  // filtros
  filtersWrapper: {
    paddingVertical: 16,
    backgroundColor: c.surface,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  filtersList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  chipInactive: {
    backgroundColor: c.surfaceAlt,
    borderColor: c.border,
  },
  chipText: {
    ...Typography.label,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chipTextInactive: {
    color: c.textSecondary,
  },

  // lista de cards
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    backgroundColor: c.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelBadgeText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  readingTime: {
    ...Typography.caption,
    color: c.textTertiary,
    letterSpacing: 0.3,
  },
  cardTitle: {
    ...Typography.h4,
    color: c.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...Typography.bodySmall,
    color: c.textSecondary,
    marginBottom: 12,
  },

  // key points
  keyPointsContainer: {
    marginTop: 4,
    gap: 6,
  },
  keyPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  keyPointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: c.gold,
  },
  keyPointText: {
    ...Typography.bodySmall,
    color: c.textSecondary,
    flex: 1,
  },

  // empty
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: c.textSecondary,
  },
});
