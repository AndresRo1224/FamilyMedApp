/**
 * Paleta oficial de colores UDES - FamilyMed App
 * Universidad de Santander - Medicina Familiar
 * Proyecto de grado 65-2026-071
 */

export interface UdesColorPalette {
  // Colores primarios institucionales UDES
  primary: string;           // Azul principal UDES
  background: string;        // Fondo general de la app
  surface: string;           // Superficie de cards y contenedores
  gold: string;              // Oro UDES (acentos y detalles)

  // Colores de texto
  text: string;              // Texto principal
  textSecondary: string;     // Texto secundario / descripciones

  // Bordes y divisores
  border: string;            // Borde estándar

  // Estados funcionales
  success: string;           // Confirmaciones y valores normales
  warning: string;           // Advertencias y valores elevados
  danger: string;            // Alertas críticas e hipertensión severa
  info: string;              // Información general

  // Transparencias utilitarias
  overlay: string;           // Overlay oscuro para modales
  transparent: string;
}

/**
 * Objeto principal de colores UDES utilizado en toda la app.
 * Se importa como: import { Colors } from '@/constants/colors';
 */
export const Colors: UdesColorPalette = {
  // Institucionales
  primary: '#004899',
  background: '#0D1B3E',
  surface: '#1A3472',
  gold: '#C99F81',

  // Tipografía
  text: '#FFFFFF',
  textSecondary: '#B8C9E8',

  // Bordes
  border: '#1E3A6E',

  // Estados
  success: '#4CAF50',
  warning: '#FFB300',
  danger: '#E53935',
  info: '#29B6F6',

  // Utilidades
  overlay: 'rgba(13, 27, 62, 0.85)',
  transparent: 'transparent',
};

/**
 * Colores específicos para los módulos clínicos principales.
 * Permiten diferenciar visualmente cada sección de la app.
 */
export const ModuleColors = {
  hipertension: '#004899',      // Azul UDES
  calculadoras: '#C99F81',      // Oro UDES
  atlas: '#1A3472',             // Azul profundo
  guias: '#29B6F6',             // Azul info
} as const;

/**
 * Clasificación de presión arterial según JNC-8
 * Se usa para colorear tarjetas y resultados
 */
export const BloodPressureColors = {
  normal: '#4CAF50',            // < 120/80
  elevated: '#FFB300',          // 120-129/<80
  stage1: '#FF9800',            // 130-139/80-89
  stage2: '#E53935',            // ≥ 140/90
  crisis: '#B71C1C',            // > 180/120
} as const;

export default Colors;
