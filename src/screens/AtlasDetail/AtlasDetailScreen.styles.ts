// estilos del detalle de atlas

import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const atlasDetailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 24, backgroundColor: Colors.background,
  },
  errorText: { ...Typography.body, color: Colors.textSecondary },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
  },
  retryText: { ...Typography.button, color: '#FFFFFF' },

  banner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20, paddingBottom: 24,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 8,
  },
  closeButton: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, alignSelf: 'flex-end',
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
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
  },
  image: { width: '100%', height: '100%' },
  placeholderBox: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: {
    ...Typography.bodySmall, color: Colors.textTertiary, marginTop: 8,
  },

  sectionTitle: {
    ...Typography.h4, color: Colors.text,
    marginTop: 18, marginBottom: 10,
  },
  body: { ...Typography.body, color: Colors.text, lineHeight: 24 },

  listBox: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  row: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8,
  },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.primary, marginRight: 10, marginTop: 8,
  },
  rowText: { ...Typography.body, color: Colors.text, flex: 1, lineHeight: 22 },

  clinicalBox: {
    backgroundColor: Colors.gold + '15',
    borderLeftWidth: 3, borderLeftColor: Colors.gold,
    borderRadius: 8, padding: 14,
  },
  clinicalText: { ...Typography.body, color: Colors.text, lineHeight: 22 },
});
