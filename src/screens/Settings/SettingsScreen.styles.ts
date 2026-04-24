// estilos de settings

import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // banner azul con back y titulo
  banner: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  bannerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: {
    ...Typography.h3,
    color: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 40,
  },

  // tarjeta de perfil
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    margin: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...Typography.h3,
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: 2,
  },
  profileRole: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  profileInstitution: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // secciones
  sectionTitle: {
    ...Typography.label,
    color: Colors.textTertiary,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    marginHorizontal: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },

  // items
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemLabel: {
    ...Typography.body,
    color: Colors.text,
  },
  itemValue: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  itemChevron: {
    opacity: 0.5,
  },

  // boton logout
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutText: {
    ...Typography.button,
    color: Colors.danger,
  },

  versionText: {
    ...Typography.caption,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 20,
  },
});
