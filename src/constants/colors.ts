// colores de la app FamilyMed

export interface UdesColorPalette {
  primary: string;
  background: string;
  surface: string;
  gold: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  overlay: string;
  transparent: string;
}

export const Colors: UdesColorPalette = {
  primary: '#004899',
  background: '#0D1B3E',
  surface: '#1A3472',
  gold: '#C99F81',

  text: '#FFFFFF',
  textSecondary: '#B8C9E8',

  border: '#1E3A6E',

  success: '#4CAF50',
  warning: '#FFB300',
  danger: '#E53935',
  info: '#29B6F6',

  overlay: 'rgba(13, 27, 62, 0.85)',
  transparent: 'transparent',
};

// colores por modulo
export const ModuleColors = {
  hipertension: '#004899',
  calculadoras: '#C99F81',
  atlas: '#1A3472',
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
