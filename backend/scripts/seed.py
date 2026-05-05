# carga datos de prueba a las colecciones de mongodb atlas
# basados en el mockData del frontend
# uso: python backend/scripts/seed.py

import sys
from datetime import datetime
from pathlib import Path

# permite importar familymed.db desde este script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from familymed.db import get_db


def now():
    # timestamp actual en UTC
    return datetime.utcnow()


# ============================================================
# CONTENIDOS (modulo de hipertension)
# ============================================================

CONTENIDOS = [
    {
        'titulo': 'Definición y Clasificación',
        'subtitulo': 'Conceptos fundamentales de la HTA',
        'nivel': 'basico',
        'tiempo_lectura_min': 8,
        'cuerpo': (
            'La hipertensión arterial (HTA) es una elevación sostenida de la '
            'presión arterial sistólica (PAS) ≥ 140 mmHg y/o presión arterial '
            'diastólica (PAD) ≥ 90 mmHg en adultos. Según las guías JNC-8 y '
            'ACC/AHA 2017, se clasifica en: Normal (<120/<80), Elevada '
            '(120-129/<80), Estadio 1 (130-139/80-89) y Estadio 2 (≥140/≥90).'
        ),
        'puntos_clave': [
            'Umbral diagnóstico: ≥140/90 mmHg en consulta',
            'MAPA diurno: ≥135/85 mmHg',
            'AMPA: ≥135/85 mmHg',
            'Crisis hipertensiva: >180/120 mmHg',
        ],
        'referencias': [
            'Whelton PK, et al. ACC/AHA Guideline 2017',
            'James PA, et al. JNC-8 2014',
        ],
        'etiquetas': ['HTA', 'definición', 'clasificación'],
        'estado': 'publicado',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Epidemiología en Latinoamérica',
        'subtitulo': 'Datos demográficos y prevalencia regional',
        'nivel': 'basico',
        'tiempo_lectura_min': 10,
        'cuerpo': (
            'En Latinoamérica la prevalencia de HTA en adultos oscila entre '
            '20-40%. En Colombia la prevalencia reportada por la ENSIN y '
            'estudios de la Sociedad Colombiana de Cardiología es cercana al '
            '25.3% en adultos mayores de 18 años. Las tasas de control siguen '
            'siendo subóptimas: menos del 30% de los pacientes tratados '
            'alcanza las metas terapéuticas.'
        ),
        'puntos_clave': [
            'Prevalencia en Colombia: ~25%',
            'Sólo ~50% conoce su diagnóstico',
            'Control adecuado: <30%',
            'Primera causa de años de vida perdidos en la región',
        ],
        'referencias': [
            'OPS/OMS. Informe HEARTS en las Américas 2023',
            'Sociedad Colombiana de Cardiología 2022',
        ],
        'etiquetas': ['epidemiología', 'Latinoamérica', 'Colombia'],
        'estado': 'publicado',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Manifestaciones Clínicas',
        'subtitulo': 'Síntomas y signos de alerta',
        'nivel': 'intermedio',
        'tiempo_lectura_min': 7,
        'cuerpo': (
            'La HTA es generalmente asintomática (conocida como "el asesino '
            'silencioso"). Cuando aparecen síntomas suelen ser inespecíficos: '
            'cefalea occipital matutina, tinnitus, fosfenos, epistaxis, '
            'palpitaciones y fatiga. Los síntomas de daño a órgano blanco '
            'incluyen disnea (insuficiencia cardiaca), déficit neurológico '
            'focal (ECV), dolor torácico (cardiopatía isquémica) y '
            'alteraciones visuales (retinopatía).'
        ),
        'puntos_clave': [
            'Generalmente asintomática hasta complicaciones',
            'Cefalea occipital matutina es el síntoma clásico',
            'Buscar signos de daño a órgano blanco',
            'La ausencia de síntomas no excluye el diagnóstico',
        ],
        'referencias': [
            'Harrison Principios de Medicina Interna 21a ed.',
            'Guía ESC/ESH 2023',
        ],
        'etiquetas': ['síntomas', 'clínica', 'daño a órgano blanco'],
        'estado': 'publicado',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Diagnóstico y Evaluación',
        'subtitulo': 'Abordaje diagnóstico estructurado',
        'nivel': 'intermedio',
        'tiempo_lectura_min': 12,
        'cuerpo': (
            'El diagnóstico requiere al menos 2 mediciones en 2 visitas '
            'distintas, con técnica estandarizada. La evaluación inicial debe '
            'incluir: anamnesis dirigida, examen físico completo, laboratorios '
            '(creatinina, electrolitos, glicemia, perfil lipídico, '
            'uroanálisis, TSH), electrocardiograma y fondo de ojo. En '
            'pacientes seleccionados se solicita MAPA o AMPA para confirmar y '
            'descartar HTA de bata blanca o enmascarada.'
        ),
        'puntos_clave': [
            'Mínimo 2 mediciones en 2 visitas diferentes',
            'Evaluar siempre daño a órgano blanco',
            'MAPA: patrón dipper vs non-dipper',
            'Laboratorios iniciales obligatorios',
        ],
        'referencias': [
            'Guía Colombiana de HTA MinSalud 2021',
            'ESC/ESH 2023 Guidelines',
        ],
        'etiquetas': ['diagnóstico', 'MAPA', 'AMPA', 'evaluación'],
        'estado': 'publicado',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Tratamiento No Farmacológico',
        'subtitulo': 'Modificaciones del estilo de vida',
        'nivel': 'basico',
        'tiempo_lectura_min': 9,
        'cuerpo': (
            'Las intervenciones no farmacológicas pueden reducir la PAS entre '
            '5-20 mmHg. Incluyen: reducción de peso (1 mmHg por cada kg '
            'perdido), dieta DASH (reducción de 8-14 mmHg), restricción de '
            'sodio a <2.4 g/día (2-8 mmHg), actividad física aeróbica regular '
            '150 min/semana (4-9 mmHg), moderación del consumo de alcohol y '
            'cese del tabaquismo.'
        ),
        'puntos_clave': [
            'Dieta DASH: reduce hasta 14 mmHg la PAS',
            'Sodio <2 g/día',
            'Ejercicio aeróbico: 150 min/semana',
            'Alcohol: ≤2 tragos/día hombres, ≤1 mujeres',
            'Cese del tabaquismo obligatorio',
        ],
        'referencias': [
            'Sacks FM, et al. DASH Trial NEJM',
            'ACC/AHA Lifestyle Management Guidelines',
        ],
        'etiquetas': ['tratamiento', 'estilo de vida', 'DASH', 'prevención'],
        'estado': 'publicado',
        'vistas': 0,
        'creado_en': now(),
    },
]


# ============================================================
# CALCULADORAS
# ============================================================

CALCULADORAS = [
    {
        'nombre': 'Riesgo Cardiovascular de Framingham',
        'nombre_corto': 'Framingham',
        'descripcion': 'Estima el riesgo de evento cardiovascular mayor a 10 años.',
        'proposito': 'Clasificar al paciente en riesgo bajo, intermedio o alto para decidir intensidad del tratamiento.',
        'formula': 'Modelo logístico multivariado basado en edad, sexo, colesterol total, HDL, PAS, tabaquismo y diabetes.',
        'parametros': [
            'Edad (años)',
            'Sexo',
            'Colesterol total (mg/dL)',
            'Colesterol HDL (mg/dL)',
            'Presión arterial sistólica (mmHg)',
            'Tabaquismo (sí/no)',
            'Diabetes (sí/no)',
            'Tratamiento antihipertensivo (sí/no)',
        ],
        'unidad_salida': '% de riesgo a 10 años',
        'uso_clinico': 'Riesgo <10% bajo, 10-20% intermedio, >20% alto. Define inicio de estatinas y metas de PA.',
        'referencia': "D'Agostino RB, et al. Framingham Heart Study 2008",
        'categoria': 'riesgo_cardiovascular',
        'etiquetas': ['Framingham', 'riesgo', 'CVD'],
        'creado_en': now(),
    },
    {
        'nombre': 'Clasificación de PA según JNC-8',
        'nombre_corto': 'JNC-8',
        'descripcion': 'Clasifica la presión arterial en categorías diagnósticas y terapéuticas.',
        'proposito': 'Determinar si el paciente es normotenso o hipertenso y en qué estadio.',
        'formula': 'Categorización basada en promedios de PAS y PAD según umbrales establecidos.',
        'parametros': [
            'Presión arterial sistólica (mmHg)',
            'Presión arterial diastólica (mmHg)',
        ],
        'unidad_salida': 'Categoría (Normal / Elevada / Estadio 1 / Estadio 2)',
        'uso_clinico': 'Guía la decisión de iniciar tratamiento farmacológico y define metas terapéuticas.',
        'referencia': 'James PA, et al. JAMA 2014',
        'categoria': 'clasificacion_pa',
        'etiquetas': ['JNC-8', 'clasificación', 'PA'],
        'creado_en': now(),
    },
    {
        'nombre': 'Presión Arterial Media',
        'nombre_corto': 'PAM',
        'descripcion': 'Calcula la presión promedio durante el ciclo cardiaco completo.',
        'proposito': 'Estimar la perfusión tisular; útil en pacientes críticos y renales.',
        'formula': 'PAM = PAD + (PAS - PAD) / 3',
        'parametros': [
            'Presión arterial sistólica (mmHg)',
            'Presión arterial diastólica (mmHg)',
        ],
        'unidad_salida': 'mmHg',
        'uso_clinico': 'Meta >65 mmHg para asegurar perfusión de órganos en pacientes críticos.',
        'referencia': 'Sesso HD, et al. Hypertension 2000',
        'categoria': 'hemodinamia',
        'etiquetas': ['PAM', 'perfusión', 'crítico'],
        'creado_en': now(),
    },
    {
        'nombre': 'Tasa de Filtración Glomerular estimada',
        'nombre_corto': 'eGFR',
        'descripcion': 'Estima la función renal mediante fórmula CKD-EPI 2021.',
        'proposito': 'Clasificar la enfermedad renal crónica y ajustar dosis de medicamentos.',
        'formula': 'CKD-EPI 2021 basada en creatinina sérica, edad y sexo (sin ajuste por raza).',
        'parametros': [
            'Creatinina sérica (mg/dL)',
            'Edad (años)',
            'Sexo',
        ],
        'unidad_salida': 'mL/min/1.73 m²',
        'uso_clinico': 'Clasificación KDIGO en estadios G1 a G5. Crítico para seleccionar antihipertensivos.',
        'referencia': 'Inker LA, et al. NEJM 2021',
        'categoria': 'funcion_renal',
        'etiquetas': ['eGFR', 'CKD-EPI', 'renal'],
        'creado_en': now(),
    },
    {
        'nombre': 'Índice de Masa Corporal',
        'nombre_corto': 'IMC',
        'descripcion': 'Relación entre el peso y la estatura al cuadrado.',
        'proposito': 'Clasificar el estado nutricional y detectar sobrepeso/obesidad.',
        'formula': 'IMC = peso (kg) / estatura (m)²',
        'parametros': [
            'Peso (kg)',
            'Estatura (m)',
        ],
        'unidad_salida': 'kg/m²',
        'uso_clinico': 'Bajo peso <18.5 / Normal 18.5-24.9 / Sobrepeso 25-29.9 / Obesidad ≥30. Factor de riesgo modificable para HTA.',
        'referencia': 'OMS. Obesity Classification Standards',
        'categoria': 'antropometria',
        'etiquetas': ['IMC', 'obesidad', 'nutrición'],
        'creado_en': now(),
    },
    {
        'nombre': 'Meta de Presión Arterial',
        'nombre_corto': 'Meta PA',
        'descripcion': 'Determina la meta individualizada de PA según perfil del paciente.',
        'proposito': 'Definir el objetivo terapéutico ajustado a edad, comorbilidades y riesgo.',
        'formula': 'Algoritmo por condiciones: diabetes, ERC, adulto mayor, prevención primaria/secundaria.',
        'parametros': [
            'Edad (años)',
            'Diabetes (sí/no)',
            'Enfermedad renal crónica (sí/no)',
            'Enfermedad cardiovascular establecida (sí/no)',
        ],
        'unidad_salida': 'mmHg (meta individualizada)',
        'uso_clinico': 'Meta general <130/80. Adulto mayor frágil <140/90. Individualizar según tolerancia.',
        'referencia': 'ACC/AHA 2017 + Guía Colombiana 2021',
        'categoria': 'metas_terapeuticas',
        'etiquetas': ['meta PA', 'tratamiento', 'individualización'],
        'creado_en': now(),
    },
]


# ============================================================
# ATLAS IMAGENES
# ============================================================

ATLAS_IMAGENES = [
    {
        'titulo': 'Retinopatía Hipertensiva Grado I',
        'descripcion': 'Estrechamiento arteriolar generalizado con relación arteria:vena disminuida.',
        'categoria': 'fondo_ojo',
        'hallazgos': [
            'Estrechamiento arteriolar difuso',
            'Relación A:V 1:2 (normal 2:3)',
            'Ausencia de hemorragias o exudados',
        ],
        'significancia_clinica': 'Indica HTA de larga evolución pero sin daño agudo. Requiere control y seguimiento.',
        'imagen_url': 'retinopatia_grado_i.jpg',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Retinopatía Hipertensiva Grado II',
        'descripcion': 'Estrechamiento arteriolar con cruces AV patológicos (signo de Gunn y Salus).',
        'categoria': 'fondo_ojo',
        'hallazgos': [
            'Cruces AV patológicos',
            'Signo de Gunn (adelgazamiento venoso en cruce)',
            'Signo de Salus (desviación venosa)',
            'Hilos de cobre',
        ],
        'significancia_clinica': 'Daño vascular establecido. Marcador de cronicidad y mayor riesgo cardiovascular.',
        'imagen_url': 'retinopatia_grado_ii.jpg',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Cruces AV Patológicos',
        'descripcion': 'Compresión venosa en los cruces arteriovenosos por rigidez arteriolar.',
        'categoria': 'fondo_ojo',
        'hallazgos': [
            'Estrechamiento de la vena en el cruce',
            'Desviación del trayecto venoso',
            'Dilatación venosa distal',
        ],
        'significancia_clinica': 'Signo temprano de arterioloesclerosis hipertensiva. Alta especificidad para HTA crónica.',
        'imagen_url': 'cruces_av.jpg',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Hipertrofia Ventricular Izquierda en ECG',
        'descripcion': 'Criterios electrocardiográficos de HVI por criterio de Sokolow-Lyon.',
        'categoria': 'ecg',
        'hallazgos': [
            'S en V1 + R en V5/V6 ≥ 35 mm',
            'R en aVL ≥ 11 mm',
            'Criterios de Cornell: R en aVL + S en V3 > 28 mm (hombres)',
            'Alteraciones de la repolarización asociadas',
        ],
        'significancia_clinica': 'Daño a órgano blanco establecido. Predictor independiente de eventos cardiovasculares.',
        'imagen_url': 'hvi_ecg.jpg',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Cardiomegalia en Radiografía de Tórax',
        'descripcion': 'Aumento de la silueta cardiaca con índice cardiotorácico >0.5.',
        'categoria': 'radiologia',
        'hallazgos': [
            'Índice cardiotorácico > 0.50',
            'Prominencia del arco inferior izquierdo',
            'Elongación aórtica',
            'Posible redistribución vascular pulmonar',
        ],
        'significancia_clinica': 'Marcador de cardiopatía hipertensiva avanzada. Asociado a disfunción ventricular.',
        'imagen_url': 'cardiomegalia.jpg',
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Técnica Correcta de Medición de PA',
        'descripcion': 'Posicionamiento y procedimiento estandarizado para medición de PA en consulta.',
        'categoria': 'tecnica_clinica',
        'hallazgos': [
            'Paciente sentado con espalda apoyada y pies en el piso',
            'Brazo a nivel del corazón, apoyado',
            'Brazalete cubriendo 80% de la circunferencia del brazo',
            'Reposo previo de 5 minutos',
            'Sin hablar durante la medición',
        ],
        'significancia_clinica': 'La técnica incorrecta es la principal fuente de error diagnóstico. Puede sobreestimar 10-20 mmHg.',
        'imagen_url': 'tecnica_medicion_pa.jpg',
        'vistas': 0,
        'creado_en': now(),
    },
]


# ============================================================
# GUIAS CLINICAS
# ============================================================

GUIAS = [
    {
        'titulo': 'Algoritmo Diagnóstico de HTA',
        'tipo': 'algoritmo',
        'resumen': 'Ruta diagnóstica paso a paso desde la toma inicial hasta la confirmación por MAPA/AMPA.',
        'pasos': [
            'Toma de PA en consulta con técnica estandarizada',
            'Si PA ≥140/90: segunda medición en la misma consulta',
            'Promediar ambas mediciones',
            'Agendar segunda visita en 1-4 semanas',
            'Confirmar con MAPA o AMPA si hay discordancia',
            'Clasificar según JNC-8 / ACC-AHA',
            'Solicitar estudios iniciales',
            'Estadificar y evaluar daño a órgano blanco',
        ],
        'advertencias': [
            'No diagnosticar con una sola medición',
            'Descartar HTA de bata blanca y enmascarada',
            'Evaluar causas secundarias en jóvenes o HTA resistente',
        ],
        'fuente': 'Guía Colombiana MinSalud 2021 / ACC-AHA 2017',
        'ultima_actualizacion': '2026-01-15',
        'etiquetas': ['diagnóstico', 'algoritmo', 'HTA'],
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Algoritmo Terapéutico de HTA',
        'tipo': 'algoritmo',
        'resumen': 'Esquema de inicio y escalamiento del tratamiento antihipertensivo.',
        'pasos': [
            'Modificaciones del estilo de vida a todos los pacientes',
            'Estadio 1 con bajo riesgo: MEV por 3-6 meses',
            'Estadio 1 con alto riesgo o Estadio 2: iniciar farmacoterapia',
            'Primera línea: IECA/ARA-II, calcioantagonistas o tiazidas',
            'Si no se alcanza meta: combinar 2 fármacos de clases diferentes',
            'Si persiste no control: triple terapia incluyendo tiazida',
            'HTA resistente: añadir espironolactona',
        ],
        'advertencias': [
            'Evitar IECA + ARA-II combinados',
            'Precaución con diuréticos en adulto mayor deshidratado',
            'Monitorizar función renal y potasio al iniciar IECA/ARA-II',
        ],
        'fuente': 'ACC/AHA 2017 + ESC/ESH 2023',
        'ultima_actualizacion': '2026-02-01',
        'etiquetas': ['tratamiento', 'farmacoterapia', 'algoritmo'],
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Manejo de Crisis Hipertensiva',
        'tipo': 'protocolo',
        'resumen': 'Diferenciación y manejo de urgencia vs emergencia hipertensiva.',
        'pasos': [
            'Confirmar PA >180/120 en dos tomas',
            'Evaluar daño agudo a órgano blanco',
            'Sin daño agudo: Urgencia → tratamiento oral ambulatorio',
            'Con daño agudo: Emergencia → hospitalización y tratamiento IV',
            'Reducir PA 20-25% en la primera hora (emergencia)',
            'Descenso gradual: evitar hipoperfusión cerebral',
            'Fármacos IV: labetalol, nicardipino, nitroprusiato',
        ],
        'advertencias': [
            'No bajar bruscamente la PA',
            'Evitar nifedipino sublingual (riesgo ECV)',
            'Descartar disección aórtica en dolor torácico',
        ],
        'fuente': 'ACC/AHA Emergency Hypertension Guidelines',
        'ultima_actualizacion': '2026-01-20',
        'etiquetas': ['crisis', 'emergencia', 'urgencia'],
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'HTA en el Embarazo',
        'tipo': 'situacion_especial',
        'resumen': 'Abordaje de los trastornos hipertensivos en la gestación.',
        'pasos': [
            'Clasificar: HTA crónica, gestacional, preeclampsia o eclampsia',
            'Meta de PA: <140/90 mmHg',
            'Fármacos seguros: alfametildopa, labetalol, nifedipino',
            'Preeclampsia severa: sulfato de magnesio',
            'Monitoreo materno-fetal estricto',
            'Planear finalización según edad gestacional y severidad',
        ],
        'advertencias': [
            'Contraindicados: IECA, ARA-II, inhibidores de renina, atenolol',
            'Vigilar signos de severidad: cefalea, epigastralgia, visión borrosa',
            'Profilaxis con ASA desde semana 12 en alto riesgo',
        ],
        'fuente': 'FIGO 2021 / ACOG 2022',
        'ultima_actualizacion': '2026-01-10',
        'etiquetas': ['embarazo', 'preeclampsia', 'gestación'],
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'HTA Secundaria',
        'tipo': 'protocolo',
        'resumen': 'Cuándo y cómo sospechar causas secundarias de hipertensión.',
        'pasos': [
            'Sospecha clínica en: HTA <30 años, HTA resistente, inicio súbito',
            'Evaluar apnea del sueño (epworth, polisomnografía)',
            'Descartar hiperaldosteronismo: relación aldosterona/renina',
            'Feocromocitoma: metanefrinas en orina de 24 horas',
            'Estenosis de arteria renal: doppler renal, angio-TC',
            'Enfermedad renal parenquimatosa: creatinina, uroanálisis',
            'Coartación aórtica: examen físico + imagen',
        ],
        'advertencias': [
            'Sospechar en HTA resistente a 3 fármacos incluyendo diurético',
            'Suspender espironolactona 4-6 semanas antes del estudio hormonal',
            'Referir a endocrinología/nefrología según hallazgos',
        ],
        'fuente': 'Endocrine Society / Guía ESC 2023',
        'ultima_actualizacion': '2026-02-10',
        'etiquetas': ['secundaria', 'feocromocitoma', 'hiperaldosteronismo'],
        'vistas': 0,
        'creado_en': now(),
    },
    {
        'titulo': 'Medición Correcta de Presión Arterial',
        'tipo': 'tecnica',
        'resumen': 'Pasos estandarizados para una medición válida y reproducible.',
        'pasos': [
            'Paciente en reposo mínimo 5 minutos',
            'Sin cafeína ni tabaco en los 30 minutos previos',
            'Vejiga vacía',
            'Sentado con espalda apoyada y pies en el piso',
            'Brazo desnudo, apoyado a nivel del corazón',
            'Brazalete del tamaño adecuado (80% circunferencia)',
            'Realizar 2-3 mediciones separadas por 1-2 minutos',
            'Registrar el promedio de las últimas dos',
        ],
        'advertencias': [
            'Medir en ambos brazos en la primera consulta',
            'No hablar durante la medición',
            'Evitar ropa que comprima el brazo',
            'Equipo calibrado y validado',
        ],
        'fuente': 'AHA Measurement Guidelines 2019',
        'ultima_actualizacion': '2026-01-05',
        'etiquetas': ['técnica', 'medición', 'PA'],
        'vistas': 0,
        'creado_en': now(),
    },
]


# ============================================================
# USUARIOS (usuario de prueba)
# ============================================================

USUARIOS = [
    {
        'correo': 'andresrangel8a@gmail.com',
        'clave_hash': '',  # se llenara despues con auth real
        'nombre_completo': 'Andrés Felipe Rangel Ochoa',
        'cedula': '',
        'rol': 'estudiante',
        'institucion': 'Universidad de Santander - UDES',
        'codigo_programa': '65-2026-071',
        'activo': True,
        'creado_en': now(),
    },
]


# ============================================================
# EJECUCION DEL SEED
# ============================================================

def seed():
    db = get_db()

    print('Conectado a MongoDB Atlas. Iniciando seed...\n')

    # limpia primero (cuidado: borra todo lo que haya)
    print('Limpiando colecciones existentes...')
    db.contenidos.delete_many({})
    db.calculadoras.delete_many({})
    db.atlas_imagenes.delete_many({})
    db.guias.delete_many({})
    db.usuarios.delete_many({})

    print('Insertando datos...\n')

    db.contenidos.insert_many(CONTENIDOS)
    print(f'  contenidos:      {len(CONTENIDOS)} insertados')

    db.calculadoras.insert_many(CALCULADORAS)
    print(f'  calculadoras:    {len(CALCULADORAS)} insertadas')

    db.atlas_imagenes.insert_many(ATLAS_IMAGENES)
    print(f'  atlas_imagenes:  {len(ATLAS_IMAGENES)} insertadas')

    db.guias.insert_many(GUIAS)
    print(f'  guias:           {len(GUIAS)} insertadas')

    db.usuarios.insert_many(USUARIOS)
    print(f'  usuarios:        {len(USUARIOS)} insertados')

    print('\nSeed completado exitosamente.')


if __name__ == '__main__':
    seed()
