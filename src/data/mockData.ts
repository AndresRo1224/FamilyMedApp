/**
 * Datos de prueba (mock data) - FamilyMed App
 * Contenido clínico sobre Hipertensión Arterial.
 * Universidad de Santander - Medicina Familiar
 * Proyecto de grado 65-2026-071
 *
 * Todos los datos de la app se consumen desde este archivo.
 * Nunca se deben hardcodear en las pantallas.
 */

// ============================================================================
// TIPOS E INTERFACES GENERALES
// ============================================================================

/** Identificador único de cada módulo principal de la app */
export type ModuleId = 'hipertension' | 'calculadoras' | 'atlas' | 'guias';

/** Nivel de dificultad / profundidad del contenido clínico */
export type ContentLevel = 'basico' | 'intermedio' | 'avanzado';

/** Categoría general de los ítems del atlas visual */
export type AtlasCategory =
  | 'fondo_ojo'
  | 'ecg'
  | 'radiologia'
  | 'tecnica_clinica';

/** Tipo de guía clínica */
export type GuideType =
  | 'algoritmo'
  | 'protocolo'
  | 'tecnica'
  | 'situacion_especial';

// ============================================================================
// MÓDULO: HIPERTENSIÓN (CONTENIDO TEÓRICO)
// ============================================================================

export interface HypertensionSection {
  id: string;
  title: string;
  subtitle: string;
  level: ContentLevel;
  readingTimeMinutes: number;
  content: string;
  keyPoints: string[];
  references: string[];
}

export const HypertensionContent: HypertensionSection[] = [
  {
    id: 'hta-definicion',
    title: 'Definición y Clasificación',
    subtitle: 'Conceptos fundamentales de la HTA',
    level: 'basico',
    readingTimeMinutes: 8,
    content:
      'La hipertensión arterial (HTA) es una elevación sostenida de la presión arterial sistólica (PAS) ≥ 140 mmHg y/o presión arterial diastólica (PAD) ≥ 90 mmHg en adultos. Según las guías JNC-8 y ACC/AHA 2017, se clasifica en: Normal (<120/<80), Elevada (120-129/<80), Estadio 1 (130-139/80-89) y Estadio 2 (≥140/≥90).',
    keyPoints: [
      'Umbral diagnóstico: ≥140/90 mmHg en consulta',
      'MAPA diurno: ≥135/85 mmHg',
      'AMPA: ≥135/85 mmHg',
      'Crisis hipertensiva: >180/120 mmHg',
    ],
    references: [
      'Whelton PK, et al. ACC/AHA Guideline 2017',
      'James PA, et al. JNC-8 2014',
    ],
  },
  {
    id: 'hta-epidemiologia',
    title: 'Epidemiología en Latinoamérica',
    subtitle: 'Datos demográficos y prevalencia regional',
    level: 'basico',
    readingTimeMinutes: 10,
    content:
      'En Latinoamérica la prevalencia de HTA en adultos oscila entre 20-40%. En Colombia la prevalencia reportada por la ENSIN y estudios de la Sociedad Colombiana de Cardiología es cercana al 25.3% en adultos mayores de 18 años. Las tasas de control siguen siendo subóptimas: menos del 30% de los pacientes tratados alcanza las metas terapéuticas.',
    keyPoints: [
      'Prevalencia en Colombia: ~25%',
      'Sólo ~50% conoce su diagnóstico',
      'Control adecuado: <30%',
      'Primera causa de años de vida perdidos en la región',
    ],
    references: [
      'OPS/OMS. Informe HEARTS en las Américas 2023',
      'Sociedad Colombiana de Cardiología 2022',
    ],
  },
  {
    id: 'hta-manifestaciones',
    title: 'Manifestaciones Clínicas',
    subtitle: 'Síntomas y signos de alerta',
    level: 'intermedio',
    readingTimeMinutes: 7,
    content:
      'La HTA es generalmente asintomática (conocida como "el asesino silencioso"). Cuando aparecen síntomas suelen ser inespecíficos: cefalea occipital matutina, tinnitus, fosfenos, epistaxis, palpitaciones y fatiga. Los síntomas de daño a órgano blanco incluyen disnea (insuficiencia cardiaca), déficit neurológico focal (ECV), dolor torácico (cardiopatía isquémica) y alteraciones visuales (retinopatía).',
    keyPoints: [
      'Generalmente asintomática hasta complicaciones',
      'Cefalea occipital matutina es el síntoma clásico',
      'Buscar signos de daño a órgano blanco',
      'La ausencia de síntomas no excluye el diagnóstico',
    ],
    references: [
      'Harrison Principios de Medicina Interna 21a ed.',
      'Guía ESC/ESH 2023',
    ],
  },
  {
    id: 'hta-diagnostico',
    title: 'Diagnóstico y Evaluación',
    subtitle: 'Abordaje diagnóstico estructurado',
    level: 'intermedio',
    readingTimeMinutes: 12,
    content:
      'El diagnóstico requiere al menos 2 mediciones en 2 visitas distintas, con técnica estandarizada. La evaluación inicial debe incluir: anamnesis dirigida, examen físico completo, laboratorios (creatinina, electrolitos, glicemia, perfil lipídico, uroanálisis, TSH), electrocardiograma y fondo de ojo. En pacientes seleccionados se solicita MAPA o AMPA para confirmar y descartar HTA de bata blanca o enmascarada.',
    keyPoints: [
      'Mínimo 2 mediciones en 2 visitas diferentes',
      'Evaluar siempre daño a órgano blanco',
      'MAPA: patrón dipper vs non-dipper',
      'Laboratorios iniciales obligatorios',
    ],
    references: [
      'Guía Colombiana de HTA MinSalud 2021',
      'ESC/ESH 2023 Guidelines',
    ],
  },
  {
    id: 'hta-tratamiento-no-farmacologico',
    title: 'Tratamiento No Farmacológico',
    subtitle: 'Modificaciones del estilo de vida',
    level: 'basico',
    readingTimeMinutes: 9,
    content:
      'Las intervenciones no farmacológicas pueden reducir la PAS entre 5-20 mmHg. Incluyen: reducción de peso (1 mmHg por cada kg perdido), dieta DASH (reducción de 8-14 mmHg), restricción de sodio a <2.4 g/día (2-8 mmHg), actividad física aeróbica regular 150 min/semana (4-9 mmHg), moderación del consumo de alcohol y cese del tabaquismo.',
    keyPoints: [
      'Dieta DASH: reduce hasta 14 mmHg la PAS',
      'Sodio <2 g/día',
      'Ejercicio aeróbico: 150 min/semana',
      'Alcohol: ≤2 tragos/día hombres, ≤1 mujeres',
      'Cese del tabaquismo obligatorio',
    ],
    references: [
      'Sacks FM, et al. DASH Trial NEJM',
      'ACC/AHA Lifestyle Management Guidelines',
    ],
  },
];

// ============================================================================
// MÓDULO: CALCULADORAS CLÍNICAS (SOLO EXHIBICIÓN)
// ============================================================================

export interface ClinicalCalculator {
  id: string;
  name: string;
  shortName: string;
  description: string;
  purpose: string;
  formula: string;
  inputs: string[];
  outputUnit: string;
  clinicalUse: string;
  reference: string;
}

export const Calculators: ClinicalCalculator[] = [
  {
    id: 'calc-framingham',
    name: 'Riesgo Cardiovascular de Framingham',
    shortName: 'Framingham',
    description:
      'Estima el riesgo de evento cardiovascular mayor a 10 años.',
    purpose:
      'Clasificar al paciente en riesgo bajo, intermedio o alto para decidir intensidad del tratamiento.',
    formula:
      'Modelo logístico multivariado basado en edad, sexo, colesterol total, HDL, PAS, tabaquismo y diabetes.',
    inputs: [
      'Edad (años)',
      'Sexo',
      'Colesterol total (mg/dL)',
      'Colesterol HDL (mg/dL)',
      'Presión arterial sistólica (mmHg)',
      'Tabaquismo (sí/no)',
      'Diabetes (sí/no)',
      'Tratamiento antihipertensivo (sí/no)',
    ],
    outputUnit: '% de riesgo a 10 años',
    clinicalUse:
      'Riesgo <10% bajo, 10-20% intermedio, >20% alto. Define inicio de estatinas y metas de PA.',
    reference: "D'Agostino RB, et al. Framingham Heart Study 2008",
  },
  {
    id: 'calc-jnc8',
    name: 'Clasificación de PA según JNC-8',
    shortName: 'JNC-8',
    description:
      'Clasifica la presión arterial en categorías diagnósticas y terapéuticas.',
    purpose:
      'Determinar si el paciente es normotenso o hipertenso y en qué estadio.',
    formula:
      'Categorización basada en promedios de PAS y PAD según umbrales establecidos.',
    inputs: [
      'Presión arterial sistólica (mmHg)',
      'Presión arterial diastólica (mmHg)',
    ],
    outputUnit: 'Categoría (Normal / Elevada / Estadio 1 / Estadio 2)',
    clinicalUse:
      'Guía la decisión de iniciar tratamiento farmacológico y define metas terapéuticas.',
    reference: 'James PA, et al. JAMA 2014',
  },
  {
    id: 'calc-pam',
    name: 'Presión Arterial Media',
    shortName: 'PAM',
    description:
      'Calcula la presión promedio durante el ciclo cardiaco completo.',
    purpose:
      'Estimar la perfusión tisular; útil en pacientes críticos y renales.',
    formula: 'PAM = PAD + (PAS - PAD) / 3',
    inputs: [
      'Presión arterial sistólica (mmHg)',
      'Presión arterial diastólica (mmHg)',
    ],
    outputUnit: 'mmHg',
    clinicalUse:
      'Meta >65 mmHg para asegurar perfusión de órganos en pacientes críticos.',
    reference: 'Sesso HD, et al. Hypertension 2000',
  },
  {
    id: 'calc-egfr',
    name: 'Tasa de Filtración Glomerular estimada',
    shortName: 'eGFR',
    description:
      'Estima la función renal mediante fórmula CKD-EPI 2021.',
    purpose:
      'Clasificar la enfermedad renal crónica y ajustar dosis de medicamentos.',
    formula:
      'CKD-EPI 2021 basada en creatinina sérica, edad y sexo (sin ajuste por raza).',
    inputs: [
      'Creatinina sérica (mg/dL)',
      'Edad (años)',
      'Sexo',
    ],
    outputUnit: 'mL/min/1.73 m²',
    clinicalUse:
      'Clasificación KDIGO en estadios G1 a G5. Critico para seleccionar antihipertensivos.',
    reference: 'Inker LA, et al. NEJM 2021',
  },
  {
    id: 'calc-imc',
    name: 'Índice de Masa Corporal',
    shortName: 'IMC',
    description:
      'Relación entre el peso y la estatura al cuadrado.',
    purpose:
      'Clasificar el estado nutricional y detectar sobrepeso/obesidad.',
    formula: 'IMC = peso (kg) / estatura (m)²',
    inputs: [
      'Peso (kg)',
      'Estatura (m)',
    ],
    outputUnit: 'kg/m²',
    clinicalUse:
      'Bajo peso <18.5 / Normal 18.5-24.9 / Sobrepeso 25-29.9 / Obesidad ≥30. Factor de riesgo modificable para HTA.',
    reference: 'OMS. Obesity Classification Standards',
  },
  {
    id: 'calc-meta-pa',
    name: 'Meta de Presión Arterial',
    shortName: 'Meta PA',
    description:
      'Determina la meta individualizada de PA según perfil del paciente.',
    purpose:
      'Definir el objetivo terapéutico ajustado a edad, comorbilidades y riesgo.',
    formula:
      'Algoritmo por condiciones: diabetes, ERC, adulto mayor, prevención primaria/secundaria.',
    inputs: [
      'Edad (años)',
      'Diabetes (sí/no)',
      'Enfermedad renal crónica (sí/no)',
      'Enfermedad cardiovascular establecida (sí/no)',
    ],
    outputUnit: 'mmHg (meta individualizada)',
    clinicalUse:
      'Meta general <130/80. Adulto mayor frágil <140/90. Individualizar según tolerancia.',
    reference: 'ACC/AHA 2017 + Guía Colombiana 2021',
  },
];

// ============================================================================
// MÓDULO: ATLAS VISUAL (CON FILTROS POR CATEGORÍA)
// ============================================================================

export interface AtlasItem {
  id: string;
  title: string;
  category: AtlasCategory;
  categoryLabel: string;
  description: string;
  findings: string[];
  clinicalSignificance: string;
  imagePlaceholder: string; // URL o identificador del recurso visual
}

export const AtlasItems: AtlasItem[] = [
  {
    id: 'atlas-retinopatia-i',
    title: 'Retinopatía Hipertensiva Grado I',
    category: 'fondo_ojo',
    categoryLabel: 'Fondo de Ojo',
    description:
      'Estrechamiento arteriolar generalizado con relación arteria:vena disminuida.',
    findings: [
      'Estrechamiento arteriolar difuso',
      'Relación A:V 1:2 (normal 2:3)',
      'Ausencia de hemorragias o exudados',
    ],
    clinicalSignificance:
      'Indica HTA de larga evolución pero sin daño agudo. Requiere control y seguimiento.',
    imagePlaceholder: 'retinopatia_grado_i.jpg',
  },
  {
    id: 'atlas-retinopatia-ii',
    title: 'Retinopatía Hipertensiva Grado II',
    category: 'fondo_ojo',
    categoryLabel: 'Fondo de Ojo',
    description:
      'Estrechamiento arteriolar con cruces AV patológicos (signo de Gunn y Salus).',
    findings: [
      'Cruces AV patológicos',
      'Signo de Gunn (adelgazamiento venoso en cruce)',
      'Signo de Salus (desviación venosa)',
      'Hilos de cobre',
    ],
    clinicalSignificance:
      'Daño vascular establecido. Marcador de cronicidad y mayor riesgo cardiovascular.',
    imagePlaceholder: 'retinopatia_grado_ii.jpg',
  },
  {
    id: 'atlas-cruces-av',
    title: 'Cruces AV Patológicos',
    category: 'fondo_ojo',
    categoryLabel: 'Fondo de Ojo',
    description:
      'Compresión venosa en los cruces arteriovenosos por rigidez arteriolar.',
    findings: [
      'Estrechamiento de la vena en el cruce',
      'Desviación del trayecto venoso',
      'Dilatación venosa distal',
    ],
    clinicalSignificance:
      'Signo temprano de arterioloesclerosis hipertensiva. Alta especificidad para HTA crónica.',
    imagePlaceholder: 'cruces_av.jpg',
  },
  {
    id: 'atlas-hvi-ecg',
    title: 'Hipertrofia Ventricular Izquierda en ECG',
    category: 'ecg',
    categoryLabel: 'Electrocardiograma',
    description:
      'Criterios electrocardiográficos de HVI por criterio de Sokolow-Lyon.',
    findings: [
      'S en V1 + R en V5/V6 ≥ 35 mm',
      'R en aVL ≥ 11 mm',
      'Criterios de Cornell: R en aVL + S en V3 > 28 mm (hombres)',
      'Alteraciones de la repolarización asociadas',
    ],
    clinicalSignificance:
      'Daño a órgano blanco establecido. Predictor independiente de eventos cardiovasculares.',
    imagePlaceholder: 'hvi_ecg.jpg',
  },
  {
    id: 'atlas-cardiomegalia',
    title: 'Cardiomegalia en Radiografía de Tórax',
    category: 'radiologia',
    categoryLabel: 'Radiología',
    description:
      'Aumento de la silueta cardiaca con índice cardiotorácico >0.5.',
    findings: [
      'Índice cardiotorácico > 0.50',
      'Prominencia del arco inferior izquierdo',
      'Elongación aórtica',
      'Posible redistribución vascular pulmonar',
    ],
    clinicalSignificance:
      'Marcador de cardiopatía hipertensiva avanzada. Asociado a disfunción ventricular.',
    imagePlaceholder: 'cardiomegalia.jpg',
  },
  {
    id: 'atlas-tecnica-pa',
    title: 'Técnica Correcta de Medición de PA',
    category: 'tecnica_clinica',
    categoryLabel: 'Técnica Clínica',
    description:
      'Posicionamiento y procedimiento estandarizado para medición de PA en consulta.',
    findings: [
      'Paciente sentado con espalda apoyada y pies en el piso',
      'Brazo a nivel del corazón, apoyado',
      'Brazalete cubriendo 80% de la circunferencia del brazo',
      'Reposo previo de 5 minutos',
      'Sin hablar durante la medición',
    ],
    clinicalSignificance:
      'La técnica incorrecta es la principal fuente de error diagnóstico. Puede sobreestimar 10-20 mmHg.',
    imagePlaceholder: 'tecnica_medicion_pa.jpg',
  },
];

/**
 * Categorías disponibles para filtrar el atlas visual.
 * Se usa en el componente de filtros.
 */
export const AtlasCategories: { id: AtlasCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'fondo_ojo', label: 'Fondo de Ojo' },
  { id: 'ecg', label: 'Electrocardiograma' },
  { id: 'radiologia', label: 'Radiología' },
  { id: 'tecnica_clinica', label: 'Técnica Clínica' },
];

// ============================================================================
// MÓDULO: GUÍAS CLÍNICAS
// ============================================================================

export interface ClinicalGuide {
  id: string;
  title: string;
  type: GuideType;
  typeLabel: string;
  summary: string;
  steps: string[];
  warnings: string[];
  source: string;
  lastUpdated: string; // Formato YYYY-MM-DD
}

export const ClinicalGuides: ClinicalGuide[] = [
  {
    id: 'guia-algoritmo-diagnostico',
    title: 'Algoritmo Diagnóstico de HTA',
    type: 'algoritmo',
    typeLabel: 'Algoritmo',
    summary:
      'Ruta diagnóstica paso a paso desde la toma inicial hasta la confirmación por MAPA/AMPA.',
    steps: [
      'Toma de PA en consulta con técnica estandarizada',
      'Si PA ≥140/90: segunda medición en la misma consulta',
      'Promediar ambas mediciones',
      'Agendar segunda visita en 1-4 semanas',
      'Confirmar con MAPA o AMPA si hay discordancia',
      'Clasificar según JNC-8 / ACC-AHA',
      'Solicitar estudios iniciales',
      'Estadificar y evaluar daño a órgano blanco',
    ],
    warnings: [
      'No diagnosticar con una sola medición',
      'Descartar HTA de bata blanca y enmascarada',
      'Evaluar causas secundarias en jóvenes o HTA resistente',
    ],
    source: 'Guía Colombiana MinSalud 2021 / ACC-AHA 2017',
    lastUpdated: '2026-01-15',
  },
  {
    id: 'guia-algoritmo-terapeutico',
    title: 'Algoritmo Terapéutico de HTA',
    type: 'algoritmo',
    typeLabel: 'Algoritmo',
    summary:
      'Esquema de inicio y escalamiento del tratamiento antihipertensivo.',
    steps: [
      'Modificaciones del estilo de vida a todos los pacientes',
      'Estadio 1 con bajo riesgo: MEV por 3-6 meses',
      'Estadio 1 con alto riesgo o Estadio 2: iniciar farmacoterapia',
      'Primera línea: IECA/ARA-II, calcioantagonistas o tiazidas',
      'Si no se alcanza meta: combinar 2 fármacos de clases diferentes',
      'Si persiste no control: triple terapia incluyendo tiazida',
      'HTA resistente: añadir espironolactona',
    ],
    warnings: [
      'Evitar IECA + ARA-II combinados',
      'Precaución con diuréticos en adulto mayor deshidratado',
      'Monitorizar función renal y potasio al iniciar IECA/ARA-II',
    ],
    source: 'ACC/AHA 2017 + ESC/ESH 2023',
    lastUpdated: '2026-02-01',
  },
  {
    id: 'guia-crisis-hipertensiva',
    title: 'Manejo de Crisis Hipertensiva',
    type: 'protocolo',
    typeLabel: 'Protocolo',
    summary:
      'Diferenciación y manejo de urgencia vs emergencia hipertensiva.',
    steps: [
      'Confirmar PA >180/120 en dos tomas',
      'Evaluar daño agudo a órgano blanco',
      'Sin daño agudo: Urgencia → tratamiento oral ambulatorio',
      'Con daño agudo: Emergencia → hospitalización y tratamiento IV',
      'Reducir PA 20-25% en la primera hora (emergencia)',
      'Descenso gradual: evitar hipoperfusión cerebral',
      'Fármacos IV: labetalol, nicardipino, nitroprusiato',
    ],
    warnings: [
      'No bajar bruscamente la PA',
      'Evitar nifedipino sublingual (riesgo ECV)',
      'Descartar disección aórtica en dolor torácico',
    ],
    source: 'ACC/AHA Emergency Hypertension Guidelines',
    lastUpdated: '2026-01-20',
  },
  {
    id: 'guia-hta-embarazo',
    title: 'HTA en el Embarazo',
    type: 'situacion_especial',
    typeLabel: 'Situación Especial',
    summary:
      'Abordaje de los trastornos hipertensivos en la gestación.',
    steps: [
      'Clasificar: HTA crónica, gestacional, preeclampsia o eclampsia',
      'Meta de PA: <140/90 mmHg',
      'Fármacos seguros: alfametildopa, labetalol, nifedipino',
      'Preeclampsia severa: sulfato de magnesio',
      'Monitoreo materno-fetal estricto',
      'Planear finalización según edad gestacional y severidad',
    ],
    warnings: [
      'Contraindicados: IECA, ARA-II, inhibidores de renina, atenolol',
      'Vigilar signos de severidad: cefalea, epigastralgia, visión borrosa',
      'Profilaxis con ASA desde semana 12 en alto riesgo',
    ],
    source: 'FIGO 2021 / ACOG 2022',
    lastUpdated: '2026-01-10',
  },
  {
    id: 'guia-hta-secundaria',
    title: 'HTA Secundaria',
    type: 'protocolo',
    typeLabel: 'Protocolo',
    summary:
      'Cuándo y cómo sospechar causas secundarias de hipertensión.',
    steps: [
      'Sospecha clínica en: HTA <30 años, HTA resistente, inicio súbito',
      'Evaluar apnea del sueño (epworth, polisomnografía)',
      'Descartar hiperaldosteronismo: relación aldosterona/renina',
      'Feocromocitoma: metanefrinas en orina de 24 horas',
      'Estenosis de arteria renal: doppler renal, angio-TC',
      'Enfermedad renal parenquimatosa: creatinina, uroanálisis',
      'Coartación aórtica: examen físico + imagen',
    ],
    warnings: [
      'Sospechar en HTA resistente a 3 fármacos incluyendo diurético',
      'Suspender espironolactona 4-6 semanas antes del estudio hormonal',
      'Referir a endocrinología/nefrología según hallazgos',
    ],
    source: 'Endocrine Society / Guía ESC 2023',
    lastUpdated: '2026-02-10',
  },
  {
    id: 'guia-medicion-pa',
    title: 'Medición Correcta de Presión Arterial',
    type: 'tecnica',
    typeLabel: 'Técnica',
    summary:
      'Pasos estandarizados para una medición válida y reproducible.',
    steps: [
      'Paciente en reposo mínimo 5 minutos',
      'Sin cafeína ni tabaco en los 30 minutos previos',
      'Vejiga vacía',
      'Sentado con espalda apoyada y pies en el piso',
      'Brazo desnudo, apoyado a nivel del corazón',
      'Brazalete del tamaño adecuado (80% circunferencia)',
      'Realizar 2-3 mediciones separadas por 1-2 minutos',
      'Registrar el promedio de las últimas dos',
    ],
    warnings: [
      'Medir en ambos brazos en la primera consulta',
      'No hablar durante la medición',
      'Evitar ropa que comprima el brazo',
      'Equipo calibrado y validado',
    ],
    source: 'AHA Measurement Guidelines 2019',
    lastUpdated: '2026-01-05',
  },
];

// ============================================================================
// ÍTEMS RECIENTES / HISTORIAL (para el Home)
// ============================================================================

export interface RecentItem {
  id: string;
  title: string;
  moduleId: ModuleId;
  moduleLabel: string;
  accessedAt: string; // Formato YYYY-MM-DD
}

export const RecentItems: RecentItem[] = [
  {
    id: 'recent-1',
    title: 'Definición y Clasificación',
    moduleId: 'hipertension',
    moduleLabel: 'Hipertensión',
    accessedAt: '2026-04-21',
  },
  {
    id: 'recent-2',
    title: 'Clasificación PA JNC-8',
    moduleId: 'calculadoras',
    moduleLabel: 'Calculadoras',
    accessedAt: '2026-04-20',
  },
  {
    id: 'recent-3',
    title: 'Retinopatía Grado II',
    moduleId: 'atlas',
    moduleLabel: 'Atlas',
    accessedAt: '2026-04-19',
  },
  {
    id: 'recent-4',
    title: 'Algoritmo Terapéutico',
    moduleId: 'guias',
    moduleLabel: 'Guías',
    accessedAt: '2026-04-18',
  },
];

// ============================================================================
// MÓDULOS PRINCIPALES (para el grid del Home)
// ============================================================================

export interface AppModule {
  id: ModuleId;
  title: string;
  description: string;
  itemCount: number;
  route: string; // Nombre de la ruta de navegación
}

export const AppModules: AppModule[] = [
  {
    id: 'hipertension',
    title: 'Hipertensión',
    description: 'Contenido teórico y clínico',
    itemCount: HypertensionContent.length,
    route: 'Contenidos',
  },
  {
    id: 'calculadoras',
    title: 'Calculadoras',
    description: 'Herramientas clínicas',
    itemCount: Calculators.length,
    route: 'Calculadoras',
  },
  {
    id: 'atlas',
    title: 'Atlas',
    description: 'Galería visual con filtros',
    itemCount: AtlasItems.length,
    route: 'Atlas',
  },
  {
    id: 'guias',
    title: 'Guías',
    description: 'Algoritmos y protocolos',
    itemCount: ClinicalGuides.length,
    route: 'Guias',
  },
];

// ============================================================================
// INFORMACIÓN DE USUARIO DE PRUEBA (para Login y Settings)
// ============================================================================

export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  institution: string;
  programCode: string;
}

export const MockCurrentUser: MockUser = {
  id: 'user-001',
  fullName: 'Andrés Felipe Rangel Ochoa',
  email: 'andresrangel8a@gmail.com',
  role: 'Estudiante de Medicina',
  institution: 'Universidad de Santander - UDES',
  programCode: '65-2026-071',
};
