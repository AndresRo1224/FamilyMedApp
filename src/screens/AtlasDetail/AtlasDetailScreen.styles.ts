// estilos del detalle de atlas

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const makeAtlasDetailStyles = (c: UdesColorPalette) => StyleSheet.create({
  container: { flex: 1, backgroundColor: c.background },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 24, backgroundColor: c.background,
  },
  errorText: { ...Typography.body, color: c.textSecondary },
  retryButton: {
    backgroundColor: c.primary,
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
  },
  retryText: { ...Typography.button, color: '#FFFFFF' },

  banner: {
    backgroundColor: c.primary,
    paddingHorizontal: 20, paddingBottom: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: c.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 8,
  },
  closeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, alignSelf: 'flex-end',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionsRow: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerAccent: {
    width: 40, height: 3, backgroundColor: '#FFFFFF',
    borderRadius: 2, marginBottom: 10, opacity: 0.7,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, alignSelf: 'flex-start', marginBottom: 8,
  },
  categoryBadgeText: {
    ...Typography.caption, color: '#FFFFFF',
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  title: { ...Typography.h2, color: '#FFFFFF', marginBottom: 6 },
  metaText: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.85)' },

  scrollContent: { padding: 20, paddingBottom: 40 },

  imageBox: {
    width: '100%', height: 240,
    backgroundColor: c.surfaceAlt,
    borderRadius: 12, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  placeholderBox: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: {
    ...Typography.bodySmall, color: c.textTertiary, marginTop: 8,
  },

  sectionTitle: {
    ...Typography.h4, color: c.text,
    marginTop: 18, marginBottom: 10,
  },
  body: { ...Typography.body, color: c.text, lineHeight: 24 },

  listBox: {
    backgroundColor: c.surface, borderRadius: 12, padding: 14,
    borderLeftWidth: 3, borderLeftColor: c.primary,
  },
  row: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: c.primary, marginRight: 10, marginTop: 8,
  },
  rowText: { ...Typography.body, color: c.text, flex: 1, lineHeight: 22 },

  clinicalBox: {
    backgroundColor: c.gold + '15',
    borderLeftWidth: 3, borderLeftColor: c.gold,
    borderRadius: 8, padding: 14,
  },
  clinicalText: { ...Typography.body, color: c.text, lineHeight: 22 },
});
