// estilos de bibliografia

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const makeBibliografiaStyles = (c: UdesColorPalette) => StyleSheet.create({
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

  // buscador
  searchWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: c.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    ...Typography.body,
    flex: 1,
    color: c.text,
    paddingVertical: 0,
  },

  // lista
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
  typeBadge: {
    backgroundColor: c.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    flexShrink: 0,
  },
  typeBadgeText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  year: {
    ...Typography.caption,
    color: c.textTertiary,
  },
  cardTitle: {
    ...Typography.h4,
    color: c.text,
    marginBottom: 6,
  },
  authors: {
    ...Typography.bodySmall,
    color: c.textSecondary,
    marginBottom: 4,
  },
  journal: {
    ...Typography.caption,
    color: c.textTertiary,
    fontStyle: 'italic',
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
