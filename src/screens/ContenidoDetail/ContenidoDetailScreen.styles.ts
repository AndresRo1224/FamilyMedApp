// estilos del detalle de contenido

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const makeContenidoDetailStyles = (c: UdesColorPalette) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: c.background,
  },
  errorText: {
    ...Typography.body,
    color: c.textSecondary,
  },
  retryButton: {
    backgroundColor: c.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    ...Typography.button,
    color: '#FFFFFF',
  },

  // banner
  banner: {
    backgroundColor: c.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: c.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'flex-end',
  },
  // fila con close a la izq y acciones (share + favorito) a la derecha
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAccent: {
    width: 40,
    height: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    marginBottom: 10,
    opacity: 0.7,
  },
  title: {
    ...Typography.h2,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    ...Typography.body,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  levelBadgeText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaText: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.85)',
    marginRight: 6,
  },

  // contenido
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    ...Typography.h4,
    color: c.text,
    marginTop: 18,
    marginBottom: 10,
  },
  body: {
    ...Typography.body,
    color: c.text,
    lineHeight: 24,
  },
  pointsBox: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: c.primary,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pointDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: c.primary,
    marginRight: 10,
    marginTop: 8,
  },
  pointText: {
    ...Typography.body,
    color: c.text,
    flex: 1,
    lineHeight: 22,
  },
  refsBox: {
    backgroundColor: c.surface,
    borderRadius: 12,
    padding: 14,
  },
  refText: {
    ...Typography.bodySmall,
    color: c.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
  },
  tagChip: {
    backgroundColor: c.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: c.border,
  },
  tagText: {
    ...Typography.caption,
    color: c.primary,
    fontWeight: '600',
  },
});
