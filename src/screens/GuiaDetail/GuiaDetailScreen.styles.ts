// estilos del detalle de guia clinica

import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const guiaDetailStyles = StyleSheet.create({
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
  typeBadge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, alignSelf: 'flex-start', marginBottom: 8,
  },
  typeBadgeText: {
    ...Typography.caption, color: '#FFFFFF',
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5,
  },
  title: { ...Typography.h2, color: '#FFFFFF', marginBottom: 6 },
  metaText: { ...Typography.bodySmall, color: 'rgba(255,255,255,0.85)' },

  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    ...Typography.h4, color: Colors.text,
    marginTop: 18, marginBottom: 10,
  },
  body: { ...Typography.body, color: Colors.text, lineHeight: 24 },

  stepsBox: {
    backgroundColor: Colors.surface, borderRadius: 12, padding: 14,
  },
  stepRow: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12,
  },
  stepNumber: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12, marginTop: 1,
  },
  stepNumberText: {
    ...Typography.caption, color: '#FFFFFF', fontWeight: '700',
  },
  stepText: { ...Typography.body, color: Colors.text, flex: 1, lineHeight: 22 },

  warningBox: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 3, borderLeftColor: '#dc2626',
    borderRadius: 8, padding: 12,
  },
  warningRow: {
    flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8,
  },
  warningText: {
    ...Typography.bodySmall, color: '#7f1d1d',
    flex: 1, lineHeight: 20,
  },

  source: {
    ...Typography.caption, color: Colors.textTertiary,
    fontStyle: 'italic', marginTop: 18,
  },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 },
  tagChip: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14,
    marginRight: 6, marginBottom: 6,
    borderWidth: 1, borderColor: Colors.border,
  },
  tagText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
});
