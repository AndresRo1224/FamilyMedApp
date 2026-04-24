// colores de la app FamilyMed

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

export const Colors: UdesColorPalette = {
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
