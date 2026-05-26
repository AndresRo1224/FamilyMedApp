// estilos del tab bar

import { StyleSheet } from 'react-native';
import { UdesColorPalette } from '../constants/colors';
import { Typography } from '../constants/typography';

export const makeTabNavigatorStyles = (c: UdesColorPalette) => StyleSheet.create({
  tabBar: {
    backgroundColor: c.surface,
    borderTopColor: c.border,
    borderTopWidth: 1,
    height: 76,
    paddingTop: 8,
    paddingBottom: 10,
    shadowColor: c.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },

  // contenedor del boton custom
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },

  // indicador superior del tab activo
  indicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: c.primary,
  },

  // contenido interno (icono + label)
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  iconBox: {
    marginBottom: 3,
  },
  label: {
    ...Typography.label,
    fontSize: 10.5,
  },
  labelActive: {
    color: c.primary,
    fontWeight: '700',
  },
  labelInactive: {
    color: c.textSecondary,
    fontWeight: '500',
  },
});
