// tipos del json que devuelve el backend django
// los nombres estan en español para coincidir con la BD mongo

// nivel de cada contenido
export type ContenidoNivel = 'basico' | 'intermedio' | 'avanzado';

// categorias del atlas
export type AtlasCategoria =
  | 'fondo_ojo'
  | 'ecg'
  | 'radiologia'
  | 'tecnica_clinica';

// tipos de guia
export type GuiaTipo =
  | 'algoritmo'
  | 'protocolo'
  | 'tecnica'
  | 'situacion_especial';


// item del modulo de contenidos
export interface Contenido {
  id: string;
  titulo: string;
  subtitulo: string;
  nivel: ContenidoNivel | string;
  tiempo_lectura_min: number;
  cuerpo: string;
  puntos_clave: string[];
  referencias: string[];
  etiquetas: string[];
  estado: string;
  vistas: number;
  creado_en: string;
}


// calculadora clinica
export interface Calculadora {
  id: string;
  nombre: string;
  nombre_corto: string;
  descripcion: string;
  proposito: string;
  formula: string;
  parametros: string[];
  unidad_salida: string;
  uso_clinico: string;
  referencia: string;
  categoria: string;
  etiquetas: string[];
  creado_en: string;
}


// imagen del atlas
export interface AtlasImagen {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: AtlasCategoria | string;
  hallazgos: string[];
  significancia_clinica: string;
  imagen_url: string;
  vistas: number;
  creado_en: string;
}


// guia clinica
export interface Guia {
  id: string;
  titulo: string;
  tipo: GuiaTipo | string;
  resumen: string;
  pasos: string[];
  advertencias: string[];
  fuente: string;
  ultima_actualizacion: string;
  etiquetas: string[];
  vistas: number;
  creado_en: string;
}


// referencia bibliografica
export interface BibliografiaItem {
  id: string;
  titulo: string;
  autores: string[];
  anio: number;
  tipo: string;
  revista: string;
  resumen: string;
  etiquetas: string[];
  creado_en: string;
}
