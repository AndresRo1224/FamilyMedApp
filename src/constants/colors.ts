// colores de la app FamilyMed (tema claro y oscuro)

export interface UdesColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  gold: string;
  goldLight: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderSubtle: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  shadow: string;
  overlay: string;
  transparent: string;
}

// tema claro (el original)
export const lightColors: UdesColorPalette = {
  // azules UDES como acento
  primary: '#004899',
  primaryLight: '#2E6FD9',
  primaryDark: '#003270',

  // fondos claros
  background: '#F5F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#FAFBFD',

  // oro UDES
  gold: '#C99F81',
  goldLight: '#E8C6A8',

  // texto
  text: '#1A1F35',
  textSecondary: '#5B6378',
  textTertiary: '#8891A4',

  // bordes
  border: '#E2E5EC',
  borderSubtle: '#EEF0F4',

  // estados
  success: '#4CAF50',
  warning: '#FFB300',
  danger: '#E53935',
  info: '#29B6F6',

  // sombras y overlays
  shadow: '#000000',
  overlay: 'rgba(26, 31, 53, 0.55)',
  transparent: 'transparent',
};

// tema oscuro
export const darkColors: UdesColorPalette = {
  // azul un poco mas brillante para que resalte sobre fondo oscuro
  primary: '#2E6FD9',
  primaryLight: '#5B91E8',
  primaryDark: '#1A3A6B',

  // fondos oscuros (azulados, no negro puro)
  background: '#0F1420',
  surface: '#1A2032',
  surfaceAlt: '#232A3D',

  // oro UDES (se mantiene)
  gold: '#D4A988',
  goldLight: '#E8C6A8',

  // texto claro
  text: '#F0F2F8',
  textSecondary: '#A8B0C2',
  textTertiary: '#6E7689',

  // bordes
  border: '#2C3447',
  borderSubtle: '#222942',

  // estados (un poco mas claros para contraste en oscuro)
  success: '#5CC75F',
  warning: '#FFC233',
  danger: '#EF5350',
  info: '#4FC3F7',

  // sombras y overlays
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',
  transparent: 'transparent',
};

// alias por defecto = tema claro
// se mantiene para compatibilidad; las pantallas usan useTheme() para el color vivo
export const Colors: UdesColorPalette = lightColors;

// colores por modulo
export const ModuleColors = {
  hipertension: '#004899',
  calculadoras: '#C99F81',
  atlas: '#2E6FD9',
  guias: '#29B6F6',
} as const;

// colores segun clasificacion de presion arterial
export const BloodPressureColors = {
  normal: '#4CAF50',
  elevated: '#FFB300',
  stage1: '#FF9800',
  stage2: '#E53935',
  crisis: '#B71C1C',
} as const;

export default Colors;
