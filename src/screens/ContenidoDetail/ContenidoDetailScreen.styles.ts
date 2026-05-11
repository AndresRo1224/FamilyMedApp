// estilos del detalle de contenido

import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const contenidoDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  errorText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  retryButton: {
    backgroundColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: Colors.shadow,
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
    color: Colors.text,
    marginTop: 18,
    marginBottom: 10,
  },
  body: {
    ...Typography.body,
    color: Colors.text,
    lineHeight: 24,
  },
  pointsBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
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
    backgroundColor: Colors.primary,
    marginRight: 10,
    marginTop: 8,
  },
  pointText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  refsBox: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
  },
  refText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
  },
  tagChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
});
