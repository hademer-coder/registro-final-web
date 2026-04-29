import React, { useEffect, useMemo, useState } from "react";

type Nivel = "" | "AD" | "A" | "B" | "C";
type UnidadKey = "unidad1" | "unidad2";
type FiltroRiesgo = "todos" | "riesgo";
type AreaKey =
  | "Matemática"
  | "Comunicación"
  | "Personal Social"
  | "Ciencia y Tecnología"
  | "Religión"
  | "Razonamiento Matemático"
  | "Razonamiento Verbal";

type Student = { id: number; nombre: string };
type UnitConfig = { titulo: string; sesiones: string[]; infoKeys: string[] };
type AreaConfig = Record<UnidadKey, UnitConfig>;
type RegistroState = Record<number, Record<UnidadKey, Nivel[]>>;
type InfoTema = {
  area: string;
  competencia: string;
  estandar: string;
  contenido: string;
  criterio: string;
  evidencias: string;
};
type ReporteEstudiante = {
  logros: string[];
  dificultades: string[];
  recomendaciones: string[];
  logroFinal1: Nivel;
  logroFinal2: Nivel;
  reporteIA?: string;
};
type UnidadAprendizaje = {
  codigo: "U1" | "U2";
  titulo: string;
  duracion: string;
  situacion: string;
  productoGeneral: string;
};
type CompetenciaGroup = {
  nombre: string;
  sesiones: { unidad: UnidadKey; index: number; label: string }[];
};

const students: Student[] = [
  { id: 1, nombre: "APAZA DAZA, Alexis Michael" },
  { id: 2, nombre: "APAZA MACHACA, Noemi Celeste" },
  { id: 3, nombre: "AQUINO ITO, Genesis Camila" },
  { id: 4, nombre: "BELLIDO QUILA, Ronald Thiago" },
  { id: 5, nombre: "CAIRA CONDORI, Camil Benyamin Adelqui" },
  { id: 6, nombre: "CALLO GARATE, Loan" },
  { id: 7, nombre: "CALSINA QUISPE, Brittany Rousse" },
  { id: 8, nombre: "CARRASCO ADCO, Kaori Candelaria" },
  { id: 9, nombre: "CONDORI AQUISE, Galya Luciana" },
  { id: 10, nombre: "CORI RAMOS, Erick Thiago" },
  { id: 11, nombre: "FARFAN CORNEJO, Jhon Jefferson" },
  { id: 12, nombre: "FLORES ALVAREZ, Kristel Adhara" },
  { id: 13, nombre: "GALLEGOS UTURUNCO, Juan Eduardo" },
  { id: 14, nombre: "GONZALO ZELA, Natalia" },
  { id: 15, nombre: "HUARSOUCCA LUNA, Angy Merlya" },
  { id: 16, nombre: "LARICO QUISPE, Argen Harold" },
  { id: 17, nombre: "MACHACA MARTINEZ, Abby Daylin" },
  { id: 18, nombre: "MAMANI CALLA, Reymer Joel" },
  { id: 19, nombre: "MAMANI MOLLEAPAZA, Alessandro Joao" },
  { id: 20, nombre: "MAMANI PILCO, Teofilo" },
  { id: 21, nombre: "MOLLEAPAZA PARI, Genesis Jaziel" },
  { id: 22, nombre: "OCHOA CONDORI, Briannee Valeria" },
  { id: 23, nombre: "PACORI YANQUI, Reick Thiago" },
  { id: 24, nombre: "QUISPE ARAPA, Carlos Daniel" },
  { id: 25, nombre: "QUISPE BRAVO, Sebastian" },
  { id: 26, nombre: "QUISPE MOLLEAPAZA, Prevti Estefany" },
  { id: 27, nombre: "QUISPE QUISPE, Marco Antonio" },
  { id: 28, nombre: "ROJAS RAMOS, Xavi Raul" },
  { id: 29, nombre: "SANCHEZ SUCASACA, Milet Alizon" },
  { id: 30, nombre: "YAPO PARIAPAZA, Cristel Alexa" },
  { id: 31, nombre: "ZELA CONDORI, Yeannie Alejandra" },
];

const niveles: Nivel[] = ["", "AD", "A", "B", "C"];
const weekLabels = ["SEMANA 1", "SEMANA 2", "SEMANA 3", "SEMANA 4", "SEMANA 5"];
const sessionLabels5 = ["Sesión 1", "Sesión 2", "Sesión 3", "Sesión 4", "Sesión 5"];
const sessionLabels10 = [
  "Sesión 1",
  "Sesión 2",
  "Sesión 3",
  "Sesión 4",
  "Sesión 5",
  "Sesión 6",
  "Sesión 7",
  "Sesión 8",
  "Sesión 9",
  "Sesión 10",
];
const nivelToValue: Record<Exclude<Nivel, "">, number> = { AD: 4, A: 3, B: 2, C: 1 };

const unidadesAprendizaje: Record<"U1" | "U2", UnidadAprendizaje> = {
  U1: {
    codigo: "U1",
    titulo: "Nos reencontramos con alegría con nuestros amigos",
    duracion: "02/03/2026 - 03/04/2026",
    situacion:
      "Los estudiantes de 6.º grado se preparan para desarrollar un proyecto institucional que requiere organización, responsabilidad y trabajo colaborativo. Se observan dificultades en la participación equitativa, comentarios poco empáticos y escaso reconocimiento del esfuerzo, lo cual debilita los vínculos de amistad y afecta el clima escolar.",
    productoGeneral:
      "Compromiso del Aula Unida, firmado por todos los estudiantes con acciones concretas para fortalecer la amistad y valorar el esfuerzo.",
  },
  U2: {
    codigo: "U2",
    titulo: "Fortalecemos nuestros vínculos de amistad y valoramos el esfuerzo en el trabajo",
    duracion: "06/04/2026 - 08/05/2026",
    situacion:
      "Durante proyectos grupales y actividades institucionales se observa que algunos estudiantes no cumplen sus responsabilidades a tiempo, otros no reconocen el esfuerzo de sus compañeros y surgen pequeños conflictos que afectan la armonía del aula. Se busca fortalecer la amistad, el compromiso y la valoración del esfuerzo.",
    productoGeneral:
      "Pacto del Aula Unida, consensuado y firmado por todos los estudiantes con compromisos claros para fortalecer la amistad y valorar el esfuerzo.",
  },
};

function buildInfo(
  area: string,
  competencia: string,
  estandar: string,
  contenido: string,
  criterio: string,
  evidencias: string,
): InfoTema {
  return { area, competencia, estandar, contenido, criterio, evidencias };
}

function placeholderInfo(area: string, contenido: string): InfoTema {
  return buildInfo(
    area,
    "Información pendiente de completar.",
    "Información pendiente de completar.",
    contenido,
    "Información pendiente de completar.",
    "Información pendiente de completar.",
  );
}

function getSessionCount(area: AreaKey): number {
  return area === "Matemática" || area === "Comunicación" ? 10 : 5;
}

const unitsByArea: Record<AreaKey, AreaConfig> = {
  "Matemática": {
    unidad1: {
      titulo: "I UNIDAD",
      sesiones: [
        "Razón aritmética",
        "Razón geométrica",
        "Proporciones: aritmética y geométrica",
        "Magnitudes directamente proporcionales",
        "Magnitudes inversamente proporcionales",
        "Regla de tres simple",
        "Regla de tres compuesta",
        "Operaciones con números enteros Z",
        "Potenciación I",
        "Potenciación II",
      ],
      infoKeys: [
        "MATE_U1_S1",
        "MATE_U1_S2",
        "MATE_U1_S3",
        "MATE_U1_S4",
        "MATE_U1_S5",
        "MATE_U1_S6",
        "MATE_U1_S7",
        "MATE_U1_S8",
        "MATE_U1_S9",
        "MATE_U1_S10",
      ],
    },
    unidad2: {
      titulo: "II UNIDAD",
      sesiones: [
        "Potenciación III",
        "Potenciación IV",
        "Potenciación V",
        "Radicación 1",
        "Segmentos",
        "Ángulos según su medida",
        "Ángulos por posición de sus lados",
        "Ángulos según su suma",
        "Ángulos entre rectas paralelas y secante",
        "Triángulos",
      ],
      infoKeys: [
        "MATE_U2_S1",
        "MATE_U2_S2",
        "MATE_U2_S3",
        "MATE_U2_S4",
        "MATE_U2_S5",
        "MATE_U2_S6",
        "MATE_U2_S7",
        "MATE_U2_S8",
        "MATE_U2_S9",
        "MATE_U2_S10",
      ],
    },
  },
  "Comunicación": {
    unidad1: {
      titulo: "I UNIDAD",
      sesiones: [
        "La comunicación: elementos y clases",
        "Signo lingüístico",
        "Mensajes implícitos, sentido figurado, denotación y connotación",
        "El lenguaje: funciones",
        "El lenguaje: planos",
        "El sustantivo",
        "Clasificación general del sustantivo",
        "La sílaba",
        "Concurrencia vocálica: diptongo y triptongo",
        "Concurrencia vocálica: hiato",
      ],
      infoKeys: [
        "COMU_U1_S1",
        "COMU_U1_S2",
        "COMU_U1_S3",
        "COMU_U1_S4",
        "COMU_U1_S5",
        "COMU_U1_S6",
        "COMU_U1_S7",
        "COMU_U1_S8",
        "COMU_U1_S9",
        "COMU_U1_S10",
      ],
    },
    unidad2: {
      titulo: "II UNIDAD",
      sesiones: [
        "Uso de la B y V",
        "Uso de mayúsculas I",
        "Uso de mayúsculas II",
        "Magnitudes directamente proporcionales - gráficos",
        "Normativa del sustantivo",
        "Los géneros literarios",
        "Mitología griega - Los dioses del Olimpo",
        "Mitología griega - Héroes griegos",
        "Poemas homéricos - La Odisea",
        "Esquilo",
      ],
      infoKeys: [
        "COMU_U2_S1",
        "COMU_U2_S2",
        "COMU_U2_S3",
        "COMU_U2_S4",
        "COMU_U2_S5",
        "COMU_U2_S6",
        "COMU_U2_S7",
        "COMU_U2_S8",
        "COMU_U2_S9",
        "COMU_U2_S10",
      ],
    },
  },
  "Personal Social": {
    unidad1: {
      titulo: "I UNIDAD",
      sesiones: [
        "Identidad personal",
        "Identidad cultural",
        "Diversidad cultural del Perú",
        "Autoestima",
        "Respeto a las diferencias",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "PS_U1_S1",
        "PS_U1_S2",
        "PS_U1_S3",
        "PS_U1_S4",
        "PS_U1_S5",
        "PS_U1_S6",
        "PS_U1_S7",
        "PS_U1_S8",
        "PS_U1_S9",
        "PS_U1_S10",
      ],
    },
    unidad2: {
      titulo: "II UNIDAD",
      sesiones: [
        "La convivencia escolar",
        "Los derechos humanos",
        "La defensa de los derechos humanos",
        "Derechos y responsabilidades de los niños y niñas",
        "Discriminación por género y origen étnico",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "PS_U2_S1",
        "PS_U2_S2",
        "PS_U2_S3",
        "PS_U2_S4",
        "PS_U2_S5",
        "PS_U2_S6",
        "PS_U2_S7",
        "PS_U2_S8",
        "PS_U2_S9",
        "PS_U2_S10",
      ],
    },
  },
  "Ciencia y Tecnología": {
    unidad1: {
      titulo: "I UNIDAD",
      sesiones: [
        "Las mareas",
        "Los satélites artificiales",
        "Los viajes espaciales",
        "Movimiento mecánico",
        "Movimiento rectilíneo uniforme",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "CYT_U1_S1",
        "CYT_U1_S2",
        "CYT_U1_S3",
        "CYT_U1_S4",
        "CYT_U1_S5",
        "CYT_U1_S6",
        "CYT_U1_S7",
        "CYT_U1_S8",
        "CYT_U1_S9",
        "CYT_U1_S10",
      ],
    },
    unidad2: {
      titulo: "II UNIDAD",
      sesiones: [
        "Método científico",
        "Materia I",
        "Materia II",
        "Materia III",
        "Fenómenos de la materia",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "CYT_U2_S1",
        "CYT_U2_S2",
        "CYT_U2_S3",
        "CYT_U2_S4",
        "CYT_U2_S5",
        "CYT_U2_S6",
        "CYT_U2_S7",
        "CYT_U2_S8",
        "CYT_U2_S9",
        "CYT_U2_S10",
      ],
    },
  },
  "Religión": {
    unidad1: {
      titulo: "I UNIDAD",
      sesiones: [
        "Saber elegir",
        "Consecuencias de la desobediencia",
        "Caín y Abel",
        "La construcción del arca",
        "El diluvio",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "REL_U1_S1",
        "REL_U1_S2",
        "REL_U1_S3",
        "REL_U1_S4",
        "REL_U1_S5",
        "REL_U1_S6",
        "REL_U1_S7",
        "REL_U1_S8",
        "REL_U1_S9",
        "REL_U1_S10",
      ],
    },
    unidad2: {
      titulo: "II UNIDAD",
      sesiones: [
        "Un hombre de Ur",
        "Confianza en Dios",
        "Esaú y Jacob",
        "El engaño de Jacob",
        "José y las desigualdades familiares",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "REL_U2_S1",
        "REL_U2_S2",
        "REL_U2_S3",
        "REL_U2_S4",
        "REL_U2_S5",
        "REL_U2_S6",
        "REL_U2_S7",
        "REL_U2_S8",
        "REL_U2_S9",
        "REL_U2_S10",
      ],
    },
  },
  "Razonamiento Matemático": {
    unidad1: {
      titulo: "I UNIDAD",
      sesiones: [
        "Psicotécnico",
        "Operaciones matemáticas I",
        "Operaciones matemáticas II",
        "Operaciones matemáticas con tablas I",
        "Operaciones matemáticas con tablas II",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "RM_U1_S1",
        "RM_U1_S2",
        "RM_U1_S3",
        "RM_U1_S4",
        "RM_U1_S5",
        "RM_U1_S6",
        "RM_U1_S7",
        "RM_U1_S8",
        "RM_U1_S9",
        "RM_U1_S10",
      ],
    },
    unidad2: {
      titulo: "II UNIDAD",
      sesiones: [
        "Criptograma numérico",
        "Cuatro operaciones I",
        "Cuatro operaciones II",
        "Ordenamiento lineal I",
        "Ordenamiento lineal II",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "RM_U2_S1",
        "RM_U2_S2",
        "RM_U2_S3",
        "RM_U2_S4",
        "RM_U2_S5",
        "RM_U2_S6",
        "RM_U2_S7",
        "RM_U2_S8",
        "RM_U2_S9",
        "RM_U2_S10",
      ],
    },
  },
  "Razonamiento Verbal": {
    unidad1: {
      titulo: "I UNIDAD",
      sesiones: [
        "Signo lingüístico: la palabra",
        "Formación de palabras",
        "Sinónimos I",
        "Sinónimos II",
        "Antónimos I",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "RV_U1_S1",
        "RV_U1_S2",
        "RV_U1_S3",
        "RV_U1_S4",
        "RV_U1_S5",
        "RV_U1_S6",
        "RV_U1_S7",
        "RV_U1_S8",
        "RV_U1_S9",
        "RV_U1_S10",
      ],
    },
    unidad2: {
      titulo: "II UNIDAD",
      sesiones: [
        "Antónimos II",
        "Parónimos I",
        "Parónimos II",
        "Homonimia",
        "Campo semántico",
        "Sesión 6",
        "Sesión 7",
        "Sesión 8",
        "Sesión 9",
        "Sesión 10",
      ],
      infoKeys: [
        "RV_U2_S1",
        "RV_U2_S2",
        "RV_U2_S3",
        "RV_U2_S4",
        "RV_U2_S5",
        "RV_U2_S6",
        "RV_U2_S7",
        "RV_U2_S8",
        "RV_U2_S9",
        "RV_U2_S10",
      ],
    },
  },
};

const infoPorTema: Record<string, InfoTema> = {
  MATE_U1_S1: buildInfo("Matemática", "Resuelve problemas de regularidad, equivalencia y cambio. Traduce datos a expresiones numéricas. Comunica su comprensión sobre relaciones. Usa estrategias y procedimientos. Argumenta afirmaciones.", "Resuelve problemas que implican razones, proporciones y relaciones de dependencia entre magnitudes; representa dichas relaciones en tablas y gráficos; explica y verifica sus procedimientos con argumentos matemáticos.", "Sesión 1: Razón aritmética.", "Establece y compara razones en situaciones contextualizadas.", "Resolución de problemas contextualizados al trabajo en equipo."),
  MATE_U1_S2: buildInfo("Matemática", "Resuelve problemas de regularidad, equivalencia y cambio. Traduce datos a expresiones numéricas. Comunica su comprensión sobre relaciones. Usa estrategias y procedimientos. Argumenta afirmaciones.", "Resuelve problemas que implican razones, proporciones y relaciones de dependencia entre magnitudes; representa dichas relaciones en tablas y gráficos; explica y verifica sus procedimientos con argumentos matemáticos.", "Sesión 2: Razón geométrica.", "Establece y compara razones en situaciones contextualizadas.", "Tablas y gráficos de proporcionalidad y ejercicios aplicados."),
  MATE_U1_S3: buildInfo("Matemática", "Resuelve problemas de regularidad, equivalencia y cambio. Traduce datos a expresiones numéricas. Comunica su comprensión sobre relaciones. Usa estrategias y procedimientos. Argumenta afirmaciones.", "Resuelve problemas que implican razones, proporciones y relaciones de dependencia entre magnitudes; representa dichas relaciones en tablas y gráficos; explica y verifica sus procedimientos con argumentos matemáticos.", "Sesión 3: Proporciones: aritmética y geométrica.", "Establece y compara razones y proporciones en situaciones contextualizadas.", "Ejercicios aplicados y sustentación oral del procedimiento."),
  MATE_U1_S4: buildInfo("Matemática", "Resuelve problemas de regularidad, equivalencia y cambio. Traduce datos a expresiones numéricas. Comunica su comprensión sobre relaciones. Usa estrategias y procedimientos. Argumenta afirmaciones.", "Resuelve problemas que implican razones, proporciones y relaciones de dependencia entre magnitudes; representa dichas relaciones en tablas y gráficos; explica y verifica sus procedimientos con argumentos matemáticos.", "Sesión 4: Magnitudes proporcionales: magnitudes directamente proporcionales - gráficos.", "Representa relaciones de proporcionalidad directa mediante tablas y gráficos.", "Tablas y gráficos de proporcionalidad."),
  MATE_U1_S5: buildInfo("Matemática", "Resuelve problemas de regularidad, equivalencia y cambio. Traduce datos a expresiones numéricas. Comunica su comprensión sobre relaciones. Usa estrategias y procedimientos. Argumenta afirmaciones.", "Resuelve problemas que implican razones, proporciones y relaciones de dependencia entre magnitudes; representa dichas relaciones en tablas y gráficos; explica y verifica sus procedimientos con argumentos matemáticos.", "Sesión 5: Magnitudes inversamente proporcionales - gráficos.", "Representa relaciones de proporcionalidad inversa mediante tablas y gráficos.", "Tablas y gráficos de proporcionalidad."),
  MATE_U1_S6: buildInfo("Matemática", "Resuelve problemas de regularidad, equivalencia y cambio. Traduce datos a expresiones numéricas. Comunica su comprensión sobre relaciones. Usa estrategias y procedimientos. Argumenta afirmaciones.", "Resuelve problemas que implican razones, proporciones y relaciones de dependencia entre magnitudes; representa dichas relaciones en tablas y gráficos; explica y verifica sus procedimientos con argumentos matemáticos.", "Sesión 6: Regla de tres simple.", "Resuelve problemas aplicando regla de tres simple.", "Ejercicios aplicados de regla de tres."),
  MATE_U1_S7: buildInfo("Matemática", "Resuelve problemas de regularidad, equivalencia y cambio. Traduce datos a expresiones numéricas. Comunica su comprensión sobre relaciones. Usa estrategias y procedimientos. Argumenta afirmaciones.", "Resuelve problemas que implican razones, proporciones y relaciones de dependencia entre magnitudes; representa dichas relaciones en tablas y gráficos; explica y verifica sus procedimientos con argumentos matemáticos.", "Sesión 7: Regla de tres compuesta.", "Resuelve problemas aplicando regla de tres compuesta.", "Ejercicios aplicados de regla de tres."),
  MATE_U1_S8: buildInfo("Matemática", "Resuelve problemas de regularidad, equivalencia y cambio. Traduce datos a expresiones numéricas. Comunica su comprensión sobre relaciones. Usa estrategias y procedimientos. Argumenta afirmaciones.", "Resuelve problemas que implican razones, proporciones y relaciones de dependencia entre magnitudes; representa dichas relaciones en tablas y gráficos; explica y verifica sus procedimientos con argumentos matemáticos.", "Sesión 8: Operaciones con números enteros Z.", "Opera correctamente con números enteros justificando el procedimiento.", "Ejercicios aplicados de números enteros y sustentación oral del procedimiento."),
  MATE_U1_S9: buildInfo("Matemática", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican potenciación con exponente natural y bases especiales; aplica propiedades y explica el procedimiento verificando la coherencia de los resultados.", "Sesión 9: Potenciación I: exponente natural y base entera.", "Aplica correctamente la potenciación en la resolución de problemas.", "Ejercicios aplicados de potenciación y resolución de problemas contextualizados."),
  MATE_U1_S10: buildInfo("Matemática", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican potenciación con exponente natural y bases especiales; aplica propiedades y explica el procedimiento verificando la coherencia de los resultados.", "Sesión 10: Potenciación II: exponente y bases especiales.", "Utiliza propiedades de los exponentes justificando cada procedimiento y explica sus resultados con lenguaje matemático adecuado.", "Ejercicios aplicados de potenciación, resolución de problemas contextualizados y producto final del proyecto con aplicación matemática."),
  MATE_U2_S1: buildInfo("Matemática", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican potenciación y radicación empleando leyes de exponentes; explica y verifica procedimientos usando lenguaje matemático adecuado.", "Sesión 1: Potenciación III: leyes de exponentes.", "Aplica correctamente las leyes de exponentes y justifica el procedimiento empleado.", "Resolución de ejercicios contextualizados."),
  MATE_U2_S2: buildInfo("Matemática", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican potenciación y radicación empleando leyes de exponentes; explica y verifica procedimientos usando lenguaje matemático adecuado.", "Sesión 2: Potenciación IV: leyes de exponentes.", "Aplica correctamente las leyes de exponentes y justifica el procedimiento empleado.", "Práctica aplicada y sustentación oral."),
  MATE_U2_S3: buildInfo("Matemática", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican potenciación y radicación empleando leyes de exponentes; explica y verifica procedimientos usando lenguaje matemático adecuado.", "Sesión 3: Potenciación V.", "Aplica correctamente las leyes de exponentes en la resolución de problemas contextualizados y justifica el procedimiento empleado.", "Resolución de ejercicios contextualizados y práctica aplicada."),
  MATE_U2_S4: buildInfo("Matemática", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican potenciación y radicación empleando leyes de exponentes; explica y verifica procedimientos usando lenguaje matemático adecuado.", "Sesión 4: Radicación 1.", "Aplica correctamente la radicación en la resolución de problemas contextualizados y justifica el procedimiento empleado.", "Práctica aplicada y sustentación oral."),
  MATE_U2_S5: buildInfo("Matemática", "Resuelve problemas de forma, movimiento y localización. Modela objetos con formas geométricas. Usa procedimientos de medición. Argumenta relaciones geométricas.", "Resuelve problemas que implican segmentos, ángulos y triángulos; establece relaciones geométricas y explica procedimientos utilizando lenguaje formal.", "Sesión 5: Segmentos: operaciones de adición y sustracción, punto medio.", "Clasifica, representa y opera con segmentos justificando sus procedimientos con argumentos geométricos claros.", "Construcciones geométricas y resolución de problemas."),
  MATE_U2_S6: buildInfo("Matemática", "Resuelve problemas de forma, movimiento y localización. Modela objetos con formas geométricas. Usa procedimientos de medición. Argumenta relaciones geométricas.", "Resuelve problemas que implican segmentos, ángulos y triángulos; establece relaciones geométricas y explica procedimientos utilizando lenguaje formal.", "Sesión 6: Ángulos: clasificación según su medida y operaciones de adición y sustracción.", "Clasifica, representa y opera con ángulos justificando sus procedimientos con argumentos geométricos claros.", "Resolución de problemas y diseño gráfico colaborativo."),
  MATE_U2_S7: buildInfo("Matemática", "Resuelve problemas de forma, movimiento y localización. Modela objetos con formas geométricas. Usa procedimientos de medición. Argumenta relaciones geométricas.", "Resuelve problemas que implican segmentos, ángulos y triángulos; establece relaciones geométricas y explica procedimientos utilizando lenguaje formal.", "Sesión 7: Ángulos: clasificación por la posición de sus lados, bisectriz.", "Clasifica y representa ángulos según la posición de sus lados justificando sus procedimientos.", "Construcciones geométricas y sustentación grupal."),
  MATE_U2_S8: buildInfo("Matemática", "Resuelve problemas de forma, movimiento y localización. Modela objetos con formas geométricas. Usa procedimientos de medición. Argumenta relaciones geométricas.", "Resuelve problemas que implican segmentos, ángulos y triángulos; establece relaciones geométricas y explica procedimientos utilizando lenguaje formal.", "Sesión 8: Ángulos: clasificación según su suma.", "Clasifica y representa ángulos según su suma justificando sus procedimientos con argumentos geométricos claros.", "Resolución de problemas y diseño gráfico colaborativo."),
  MATE_U2_S9: buildInfo("Matemática", "Resuelve problemas de forma, movimiento y localización. Modela objetos con formas geométricas. Usa procedimientos de medición. Argumenta relaciones geométricas.", "Resuelve problemas que implican segmentos, ángulos y triángulos; establece relaciones geométricas y explica procedimientos utilizando lenguaje formal.", "Sesión 9: Ángulos entre rectas paralelas y una secante.", "Reconoce relaciones entre ángulos formados por rectas paralelas y una secante justificando sus procedimientos.", "Construcciones geométricas y resolución de problemas."),
  MATE_U2_S10: buildInfo("Matemática", "Resuelve problemas de forma, movimiento y localización. Modela objetos con formas geométricas. Usa procedimientos de medición. Argumenta relaciones geométricas.", "Resuelve problemas que implican segmentos, ángulos y triángulos; establece relaciones geométricas y explica procedimientos utilizando lenguaje formal.", "Sesión 10: Triángulos: propiedades fundamentales.", "Clasifica, representa y opera con triángulos justificando sus procedimientos con argumentos geométricos claros.", "Construcciones geométricas, resolución de problemas, diseño gráfico colaborativo y sustentación grupal."),
  COMU_U1_S1: buildInfo("Comunicación", "Se comunica oralmente en su lengua materna. Obtiene información del texto oral. Infiere e interpreta información. Adecúa, organiza y desarrolla sus ideas.", "Comprende y produce mensajes orales considerando propósito, destinatario y contexto, usando recursos verbales y no verbales.", "Sesión 1: La comunicación: elementos y clases.", "Identifica los elementos y tipos de comunicación en situaciones cotidianas.", "Participación en asamblea y diálogo grupal."),
  COMU_U1_S2: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Infiere e interpreta información.", "Interpreta textos considerando información explícita e implícita, reconociendo sentidos figurados.", "Sesión 2: Signo lingüístico.", "Explica la relación entre significante y significado en textos sencillos.", "Fichas de análisis y ejemplos escritos."),
  COMU_U1_S3: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Reflexiona y evalúa la forma y contenido.", "Analiza el lenguaje con sentido crítico, reconociendo intención y significado.", "Sesión 3: Mensajes implícitos, sentido figurado, denotación y connotación.", "Distingue entre significado literal y figurado en textos orales y escritos.", "Resolución de actividades y ejemplos contextualizados."),
  COMU_U1_S4: buildInfo("Comunicación", "Se comunica oralmente en su lengua materna. Adecúa su discurso.", "Usa el lenguaje según su intención comunicativa.", "Sesión 4: El lenguaje: funciones.", "Identifica la función del lenguaje según la intención del mensaje.", "Intervenciones orales y dramatizaciones."),
  COMU_U1_S5: buildInfo("Comunicación", "Reflexiona sobre la forma, contenido y contexto del texto.", "Reconoce los niveles del lenguaje y los emplea adecuadamente.", "Sesión 5: El lenguaje: planos.", "Reconoce y diferencia los planos del lenguaje en ejemplos cotidianos.", "Producciones orales y escritas."),
  COMU_U1_S6: buildInfo("Comunicación", "Escribe diversos tipos de textos. Usa convenciones del lenguaje escrito.", "Emplea categorías gramaticales de manera adecuada en textos.", "Sesión 6: El sustantivo.", "Identifica y usa correctamente sustantivos en oraciones.", "Ejercicios escritos."),
  COMU_U1_S7: buildInfo("Comunicación", "Escribe diversos tipos de textos. Organiza ideas.", "Clasifica palabras según criterios gramaticales.", "Sesión 7: Clasificación general del sustantivo.", "Clasifica los sustantivos según su tipo y uso.", "Cuadro clasificatorio."),
  COMU_U1_S8: buildInfo("Comunicación", "Lee y escribe textos. Usa recursos ortográficos.", "Reconoce la estructura silábica para una correcta escritura.", "Sesión 8: La sílaba: definición, estructura y clases.", "Identifica y clasifica sílabas en palabras dadas.", "Fichas de trabajo."),
  COMU_U1_S9: buildInfo("Comunicación", "Escribe textos. Usa normas ortográficas.", "Aplica reglas de concurrencia vocálica en la escritura.", "Sesión 9: Concurrencia vocálica: diptongo y triptongo.", "Reconoce diptongos y triptongos en palabras y textos.", "Producciones escritas."),
  COMU_U1_S10: buildInfo("Comunicación", "Escribe textos. Reflexiona sobre la lengua.", "Usa adecuadamente la separación vocálica.", "Sesión 10: Concurrencia vocálica: hiato.", "Identifica y explica el uso del hiato en palabras.", "Ejercicios y ejemplos contextualizados."),
  COMU_U2_S1: buildInfo("Comunicación", "Escribe diversos tipos de textos en su lengua materna. Adecúa el texto a la situación comunicativa. Usa convenciones del lenguaje escrito.", "Escribe textos claros y coherentes, aplicando normas ortográficas y gramaticales según la intención comunicativa.", "Sesión 1: Uso de la B y V.", "Aplica correctamente el uso de la B y V en palabras y oraciones.", "Ejercicios escritos y textos breves."),
  COMU_U2_S2: buildInfo("Comunicación", "Escribe diversos tipos de textos en su lengua materna. Adecúa el texto a la situación comunicativa. Usa convenciones del lenguaje escrito.", "Escribe textos claros y coherentes, aplicando normas ortográficas y gramaticales según la intención comunicativa.", "Sesión 2: Uso de mayúsculas I.", "Aplica correctamente el uso de mayúsculas en palabras y oraciones.", "Ejercicios escritos y textos breves."),
  COMU_U2_S3: buildInfo("Comunicación", "Se comunica oralmente y escribe diversos tipos de textos. Reflexiona sobre el uso del lenguaje. Representa relaciones entre magnitudes.", "Produce textos respetando normas ortográficas y representa relaciones de proporcionalidad directa usando gráficos.", "Sesión 3: Uso de mayúsculas II.", "Usa adecuadamente las mayúsculas y las aplica en producciones escritas.", "Producciones escritas y gráficos elaborados."),
  COMU_U2_S4: buildInfo("Comunicación", "Se comunica oralmente y escribe diversos tipos de textos. Reflexiona sobre el uso del lenguaje. Representa relaciones entre magnitudes.", "Produce textos respetando normas ortográficas y representa relaciones de proporcionalidad directa usando gráficos.", "Sesión 4: Magnitudes directamente proporcionales - gráficos.", "Representa magnitudes proporcionales mediante tablas y gráficos.", "Producciones escritas y gráficos elaborados."),
  COMU_U2_S5: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Infiere e interpreta información.", "Identifica características del sustantivo y reconoce los principales géneros literarios.", "Sesión 5: Normativa del sustantivo.", "Reconoce y clasifica sustantivos en textos leídos.", "Cuadros comparativos y fichas de lectura."),
  COMU_U2_S6: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Infiere e interpreta información.", "Identifica características del sustantivo y reconoce los principales géneros literarios.", "Sesión 6: Los géneros literarios.", "Distingue los géneros literarios en textos leídos.", "Cuadros comparativos y fichas de lectura."),
  COMU_U2_S7: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Reflexiona sobre la forma y contenido.", "Interpreta textos narrativos mitológicos, identificando personajes y valores culturales.", "Sesión 7: Mitología griega - Los dioses del Olimpo.", "Identifica características de los dioses del Olimpo y reflexiona sobre sus acciones.", "Resúmenes y organizadores gráficos."),
  COMU_U2_S8: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Reflexiona sobre la forma y contenido.", "Interpreta textos narrativos mitológicos, identificando personajes y valores culturales.", "Sesión 8: Mitología griega - Héroes griegos.", "Identifica características de los héroes griegos y reflexiona sobre sus acciones.", "Resúmenes y organizadores gráficos."),
  COMU_U2_S9: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Opina sobre textos literarios.", "Analiza textos clásicos, reconociendo su valor literario y cultural.", "Sesión 9: Poemas homéricos - La Odisea.", "Explica ideas principales y valora el aporte de la literatura clásica.", "Comentarios orales y escritos y reflexiones personales."),
  COMU_U2_S10: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Opina sobre textos literarios.", "Analiza textos clásicos, reconociendo su valor literario y cultural.", "Sesión 10: Esquilo.", "Explica ideas principales y valora el aporte de la literatura clásica.", "Comentarios orales y escritos y reflexiones personales."),
  PS_U1_S1: buildInfo("Personal Social", "Construye su identidad. Se valora a sí mismo. Autorregula sus emociones. Reflexiona sobre sus características personales.", "Reconoce sus características personales, fortalezas y emociones, valorándose como persona única con derechos y responsabilidades.", "Sesión 1: Identidad personal.", "Describe sus características personales y reconoce sus fortalezas mostrando seguridad y respeto por sí mismo.", "Ficha personal 'Así soy yo' y participación en la Asamblea del Aula Unida."),
  PS_U1_S2: buildInfo("Personal Social", "Construye su identidad. Valora su pertenencia cultural.", "Explica la importancia de su identidad cultural y respeta las manifestaciones culturales de su comunidad y del país.", "Sesión 2: Identidad cultural.", "Explica con ejemplos cómo sus costumbres y tradiciones forman parte de su identidad.", "Presentación breve sobre una manifestación cultural familiar o local."),
  PS_U1_S3: buildInfo("Personal Social", "Convive y participa democráticamente en la búsqueda del bien común. Interactúa respetando diferencias. Asume responsabilidades.", "Participa en actividades colectivas asumiendo responsabilidades y respetando la diversidad cultural del país.", "Sesión 3: Diversidad cultural del Perú.", "Reconoce y valora la diversidad cultural del Perú mostrando actitudes de respeto e inclusión.", "Organizador visual sobre la diversidad cultural y desempeño en roles rotativos."),
  PS_U1_S4: buildInfo("Personal Social", "Construye su identidad. Se valora a sí mismo. Reflexiona sobre sus acciones.", "Expresa de manera reflexiva sus logros, dificultades y emociones, fortaleciendo su autoestima.", "Sesión 4: Autoestima.", "Reflexiona sobre sus logros y dificultades valorando su esfuerzo y el de sus compañeros.", "Diario del esfuerzo compartido."),
  PS_U1_S5: buildInfo("Personal Social", "Convive y participa democráticamente en la búsqueda del bien común. Delibera sobre asuntos públicos. Construye normas y acuerdos.", "Participa activamente en la construcción de acuerdos que promueven el respeto y la convivencia armoniosa.", "Sesión 5: Respeto a las diferencias.", "Propone acciones concretas para fomentar el respeto y demuestra actitudes inclusivas.", "Proyecto grupal 'Somos un Solo Equipo' (afiche, mural o compromiso firmado)."),
  PS_U2_S1: buildInfo("Personal Social", "Convive y participa democráticamente en la búsqueda del bien común. Interactúa respetando normas. Construye acuerdos.", "Participa en la convivencia escolar respetando normas y promoviendo relaciones armoniosas.", "Sesión 1: La convivencia escolar.", "Explica la importancia de la convivencia escolar y propone normas para el aula.", "Acuerdos de convivencia elaborados. Participación en la Rueda del Reconocimiento."),
  PS_U2_S2: buildInfo("Personal Social", "Convive y participa democráticamente. Delibera sobre asuntos públicos.", "Reconoce los derechos humanos y su importancia en la vida diaria.", "Sesión 2: Los derechos humanos.", "Identifica los derechos humanos y los relaciona con situaciones cotidianas.", "Mapa conceptual o esquema de derechos humanos."),
  PS_U2_S3: buildInfo("Personal Social", "Convive y participa democráticamente. Propone acciones para el bien común.", "Analiza situaciones de vulneración de derechos y propone acciones de defensa.", "Sesión 3: La defensa de los derechos humanos.", "Explica cómo defender los derechos humanos en su entorno.", "Análisis de casos y propuestas de solución. Diario del Esfuerzo Compartido."),
  PS_U2_S4: buildInfo("Personal Social", "Construye su identidad. Conoce sus derechos y responsabilidades.", "Reconoce sus derechos y responsabilidades como niño o niña en la sociedad.", "Sesión 4: Derechos y responsabilidades de los niños y niñas.", "Diferencia derechos y responsabilidades y propone acciones para cumplirlos.", "Cuadro comparativo y reflexión escrita."),
  PS_U2_S5: buildInfo("Personal Social", "Convive y participa democráticamente. Interactúa respetando diferencias.", "Reconoce situaciones de discriminación y promueve el respeto e inclusión.", "Sesión 5: Discriminación por género y origen étnico.", "Identifica situaciones de discriminación y propone acciones inclusivas.", "Proyecto 'Somos un Solo Equipo' (afiche o campaña de sensibilización)."),
  CYT_U1_S1: buildInfo("Ciencia y Tecnología Personal Social", "Indaga mediante métodos científicos: Problematiza situaciones, diseña estrategias, analiza datos. Convive y participa democráticamente: Interactúa con respeto y asume responsabilidades.", "Explica fenómenos naturales como las mareas considerando la influencia de la fuerza de gravedad y participa activamente respetando normas y acuerdos.", "Sesión 1: Las mareas.", "Explica con fundamentos científicos el fenómeno de las mareas y reconoce el aporte de sus compañeros en el trabajo grupal.", "Esquema o maqueta del fenómeno de las mareas. Participación en la Rueda del Reconocimiento."),
  CYT_U1_S2: buildInfo("Ciencia y Tecnología Personal Social", "Explica el mundo físico basándose en conocimientos científicos: Comprende y usa conocimientos científicos. Convive y participa democráticamente: Asume roles y responsabilidades.", "Describe el funcionamiento de los satélites artificiales considerando principios científicos y asume responsabilidades dentro del equipo.", "Sesión 2: Los satélites artificiales.", "Explica la función de los satélites artificiales y cumple adecuadamente el rol asignado en el equipo.", "Infografía o maqueta sobre satélites. Registro de cumplimiento de roles."),
  CYT_U1_S3: buildInfo("Ciencia y Tecnología Comunicación", "Indaga mediante métodos científicos. Se comunica oralmente y por escrito: Organiza y desarrolla ideas con claridad.", "Explica avances científicos como los viajes espaciales y comunica sus ideas de manera clara y coherente.", "Sesión 3: Los viajes espaciales.", "Investiga y comunica información relevante sobre los viajes espaciales reflexionando sobre el trabajo colaborativo.", "Línea de tiempo o exposición grupal. Diario reflexivo."),
  CYT_U1_S4: buildInfo("Ciencia y Tecnología", "Explica el mundo físico basándose en conocimientos científicos: Comprende conceptos de movimiento.", "Describe el movimiento mecánico considerando trayectoria, desplazamiento y velocidad en situaciones cotidianas.", "Sesión 4: Movimiento mecánico.", "Describe y ejemplifica el movimiento mecánico mediante experiencias prácticas.", "Experimento sencillo y registro de observaciones."),
  CYT_U1_S5: buildInfo("Ciencia y Tecnología Matemática", "Resuelve problemas de cantidad. Explica el mundo físico.", "Interpreta y representa datos del movimiento rectilíneo uniforme utilizando relaciones entre distancia, tiempo y velocidad.", "Sesión 5: Movimiento rectilíneo uniforme (M.R.U.V.).", "Resuelve problemas aplicando fórmulas del MRU y representa los resultados en gráficos.", "Resolución de problemas. Gráficos de movimiento."),
  CYT_U2_S1: buildInfo("Ciencia y Tecnología", "Indaga mediante métodos científicos para construir conocimientos. Problematiza situaciones. Diseña estrategias de indagación. Genera y registra datos. Analiza datos e información.", "Formula preguntas investigables y explica fenómenos naturales utilizando el método científico, argumentando con base en evidencias.", "Sesión 1: Método científico.", "Formula preguntas y propone hipótesis coherentes aplicando los pasos del método científico.", "Esquema del método científico y desarrollo de una experiencia sencilla."),
  CYT_U2_S2: buildInfo("Ciencia y Tecnología", "Explica el mundo físico basándose en conocimientos sobre materia y energía. Comprende y usa conocimientos científicos.", "Describe las propiedades y estructura básica de la materia relacionándolas con situaciones cotidianas.", "Sesión 2: Materia I.", "Describe y ejemplifica las propiedades generales de la materia en situaciones del entorno.", "Cuadro comparativo y resolución de actividades prácticas."),
  CYT_U2_S3: buildInfo("Ciencia y Tecnología", "Explica el mundo físico basándose en conocimientos sobre materia y energía. Comprende y usa conocimientos científicos.", "Explica los estados físicos de la materia y los cambios que experimenta usando lenguaje científico.", "Sesión 3: Materia II.", "Explica los estados de la materia utilizando ejemplos claros y vocabulario científico adecuado.", "Mapa conceptual y exposición grupal."),
  CYT_U2_S4: buildInfo("Ciencia y Tecnología", "Indaga mediante métodos científicos. Analiza y evalúa resultados.", "Diferencia cambios físicos y químicos a partir de evidencias experimentales.", "Sesión 4: Materia III.", "Identifica y diferencia cambios físicos y químicos mediante experiencias sencillas.", "Informe de experimento y conclusiones escritas."),
  CYT_U2_S5: buildInfo("Ciencia y Tecnología", "Explica el mundo físico. Evalúa implicancias del saber científico.", "Relaciona fenómenos físicos con situaciones de la vida diaria proponiendo explicaciones fundamentadas.", "Sesión 5: Fenómenos de la materia.", "Explica fenómenos de la materia vinculándolos con experiencias cotidianas.", "Organizador visual y participación en diálogo reflexivo."),
  REL_U1_S1: buildInfo("Educación Religiosa", "Construye su identidad como persona humana amada por Dios. Conoce a Dios y asume su identidad religiosa. Actúa coherentemente según su fe.", "Reconoce en los relatos bíblicos enseñanzas que orientan su toma de decisiones y su comportamiento en la vida diaria.", "Sesión 1: Saber elegir. Adán y Eva y la decisión de obedecer (Génesis 2:15-17; 3:1-6).", "Explica la importancia de obedecer a Dios y reflexiona sobre la toma de decisiones responsables.", "Organizador visual del relato bíblico. Participación en la Asamblea y Rueda del Reconocimiento."),
  REL_U1_S2: buildInfo("Educación Religiosa", "Construye su identidad cristiana. Reflexiona sobre sus acciones.", "Analiza las consecuencias de las decisiones humanas a la luz de la Palabra de Dios.", "Sesión 2: Consecuencias de la desobediencia. Promesa de salvación (Génesis 3).", "Reconoce las consecuencias del pecado y valora la promesa de salvación.", "Cuadro comparativo causa-consecuencia. Reflexión escrita."),
  REL_U1_S3: buildInfo("Educación Religiosa", "Vive su fe en comunidad. Asume compromisos coherentes con el mensaje bíblico.", "Interpreta relatos bíblicos y los relaciona con actitudes de obediencia y adoración.", "Sesión 3: Caín y Abel. La adoración y la obediencia (Génesis 4).", "Explica el significado de la verdadera adoración y propone acciones coherentes.", "Diario del Esfuerzo Compartido. Participación en roles rotativos."),
  REL_U1_S4: buildInfo("Educación Religiosa", "Testifica su fe en la vida diaria. Actúa con coherencia moral.", "Analiza hechos bíblicos considerando el contexto y sus enseñanzas para la vida actual.", "Sesión 4: La construcción del arca. La predicación de Noé (Génesis 6).", "Explica la obediencia de Noé como ejemplo de fe y compromiso.", "Esquema contextual del relato. Compromisos personales escritos."),
  REL_U1_S5: buildInfo("Educación Religiosa", "Construye su identidad y actúa según su conciencia moral.", "Reconoce oportunidades de cambio y restauración en los relatos bíblicos.", "Sesión 5: El diluvio. Evidencias y oportunidad para todos (Génesis 7-8).", "Relaciona el relato del diluvio con valores como obediencia, fe y oportunidad de cambio.", "Proyecto 'Somos un Solo Equipo' (compromiso grupal basado en valores)."),
  REL_U2_S1: buildInfo("Educación Religiosa", "Construye su identidad como persona humana amada por Dios. Conoce a Dios y asume su identidad religiosa. Actúa coherentemente según su fe.", "Reconoce en los relatos bíblicos el llamado de Dios y responde con decisiones coherentes en su vida diaria.", "Sesión 1: Un hombre de Ur. El llamado de Abram (Génesis 12).", "Explica el llamado de Abram y reflexiona sobre la importancia de obedecer a Dios.", "Organizador visual del llamado de Abram. Participación en el Semáforo del Trabajo en Equipo."),
  REL_U2_S2: buildInfo("Educación Religiosa", "Construye su identidad cristiana. Reflexiona sobre sus acciones.", "Analiza la fe y obediencia de Abraham como ejemplo de confianza en Dios.", "Sesión 2: Confianza en Dios. Abraham hombre de fe (Génesis 13-24).", "Explica cómo Abraham demostró fe y aplica esa enseñanza a su vida.", "Cuadro comparativo sobre fe y obediencia. Reflexión escrita en el Banco de Palabras que Construyen."),
  REL_U2_S3: buildInfo("Educación Religiosa", "Vive su fe en comunidad. Reconoce la importancia de las relaciones familiares.", "Interpreta relatos bíblicos reconociendo valores y conflictos familiares.", "Sesión 3: Esaú y Jacob. Relaciones intrafamiliares (Génesis 25:19-26).", "Identifica actitudes correctas e incorrectas en la relación entre hermanos.", "Diario reflexivo y análisis comparativo de actitudes."),
  REL_U2_S4: buildInfo("Educación Religiosa", "Testifica su fe en la vida diaria. Actúa con coherencia moral.", "Analiza consecuencias de acciones incorrectas a la luz del mensaje bíblico.", "Sesión 4: El engaño de Jacob (Génesis 26-27).", "Explica las consecuencias del engaño y propone acciones basadas en la honestidad.", "Esquema causa-consecuencia. Compromiso personal escrito."),
  REL_U2_S5: buildInfo("Educación Religiosa", "Construye su identidad y actúa según su conciencia moral. Reflexiona sobre justicia y perdón.", "Reconoce conflictos familiares y sus consecuencias, proponiendo actitudes de reconciliación.", "Sesión 5: José y las desigualdades familiares (Génesis 37).", "Analiza las consecuencias de la preferencia y propone actitudes de justicia y respeto.", "Proyecto grupal 'Pacto del Buen Compañero'. Organizador visual y reflexión escrita."),
  RM_U1_S1: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales y enteros; selecciona estrategias de cálculo pertinentes; representa datos en tablas y explica el procedimiento verificando resultados.", "Sesión 1: Psicotécnico.", "Resuelve ejercicios psicotécnicos aplicando razonamiento lógico.", "Ficha de ejercicios psicotécnicos."),
  RM_U1_S2: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales y enteros; selecciona estrategias de cálculo pertinentes; representa datos en tablas y explica el procedimiento verificando resultados.", "Sesión 2: Operaciones matemáticas I.", "Ejecuta correctamente operaciones matemáticas justificando el procedimiento.", "Resolución de operaciones matemáticas."),
  RM_U1_S3: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales y enteros; selecciona estrategias de cálculo pertinentes; representa datos en tablas y explica el procedimiento verificando resultados.", "Sesión 3: Operaciones matemáticas II.", "Ejecuta correctamente operaciones matemáticas justificando el procedimiento.", "Resolución de operaciones matemáticas."),
  RM_U1_S4: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales y enteros; selecciona estrategias de cálculo pertinentes; representa datos en tablas y explica el procedimiento verificando resultados.", "Sesión 4: Operaciones matemáticas con tablas I.", "Organiza datos en tablas y resuelve operaciones a partir de ellas.", "Tablas completadas con procedimientos."),
  RM_U1_S5: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales y enteros; selecciona estrategias de cálculo pertinentes; representa datos en tablas y explica el procedimiento verificando resultados.", "Sesión 5: Operaciones matemáticas con tablas II.", "Organiza datos en tablas y resuelve operaciones a partir de ellas. Explica sus resultados con claridad y coherencia matemática.", "Tablas completadas con procedimientos. Sustentación oral de resultados."),
  RM_U2_S1: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales; selecciona estrategias de cálculo pertinentes; interpreta relaciones de orden y equivalencia; explica y verifica procedimientos utilizando lenguaje matemático adecuado.", "Sesión 1: Criptograma numérico.", "Resuelve criptogramas numéricos aplicando razonamiento lógico y operaciones básicas.", "Ficha resuelta de criptograma."),
  RM_U2_S2: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales; selecciona estrategias de cálculo pertinentes; interpreta relaciones de orden y equivalencia; explica y verifica procedimientos utilizando lenguaje matemático adecuado.", "Sesión 2: Cuatro operaciones I.", "Ejecuta correctamente las cuatro operaciones justificando el procedimiento.", "Ejercicios desarrollados de las cuatro operaciones."),
  RM_U2_S3: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales; selecciona estrategias de cálculo pertinentes; interpreta relaciones de orden y equivalencia; explica y verifica procedimientos utilizando lenguaje matemático adecuado.", "Sesión 3: Cuatro operaciones II.", "Ejecuta correctamente las cuatro operaciones justificando el procedimiento.", "Ejercicios desarrollados de las cuatro operaciones."),
  RM_U2_S4: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales; selecciona estrategias de cálculo pertinentes; interpreta relaciones de orden y equivalencia; explica y verifica procedimientos utilizando lenguaje matemático adecuado.", "Sesión 4: Ordenamiento lineal I.", "Establece relaciones de orden en secuencias numéricas con precisión.", "Secuencias de ordenamiento lineal completadas."),
  RM_U2_S5: buildInfo("Razonamiento Matemático", "Resuelve problemas de cantidad. Traduce cantidades a expresiones numéricas. Usa estrategias y procedimientos de cálculo. Argumenta afirmaciones sobre relaciones numéricas.", "Resuelve problemas que implican operaciones con números naturales; selecciona estrategias de cálculo pertinentes; interpreta relaciones de orden y equivalencia; explica y verifica procedimientos utilizando lenguaje matemático adecuado.", "Sesión 5: Ordenamiento lineal II.", "Establece relaciones de orden en secuencias numéricas con precisión. Argumenta sus respuestas con coherencia matemática.", "Secuencias de ordenamiento lineal completadas. Sustentación oral del procedimiento."),
  RV_U1_S1: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Obtiene información del texto. Reflexiona sobre la forma y el contenido.", "Comprende conceptos básicos del lenguaje y los utiliza para interpretar palabras y textos sencillos.", "Sesión 1: Signo lingüístico: la palabra.", "Explica el concepto de signo lingüístico e identifica sus elementos en palabras de uso cotidiano.", "Ficha de trabajo y participación oral."),
  RV_U1_S2: buildInfo("Comunicación", "Escribe diversos tipos de textos en su lengua materna. Usa convenciones del lenguaje escrito.", "Aplica conocimientos sobre la formación de palabras para mejorar su producción escrita.", "Sesión 2: Formación de palabras.", "Identifica y forma palabras usando prefijos y sufijos correctamente.", "Ejercicios escritos y ejemplos en cuaderno."),
  RV_U1_S3: buildInfo("Comunicación", "Amplía y enriquece su vocabulario integrado a lectura y escritura.", "Utiliza sinónimos para evitar repeticiones y enriquecer el sentido de los textos.", "Sesión 3: Sinónimos I.", "Reconoce sinónimos en oraciones y textos breves.", "Subrayado y clasificación de palabras."),
  RV_U1_S4: buildInfo("Comunicación", "Lee y escribe textos con mayor precisión léxica.", "Emplea sinónimos adecuados según el contexto comunicativo.", "Sesión 4: Sinónimos II.", "Usa sinónimos de manera pertinente en la redacción de textos cortos.", "Producción escrita mejorada."),
  RV_U1_S5: buildInfo("Comunicación", "Reflexiona sobre el uso del lenguaje.", "Distingue relaciones de oposición entre palabras para comprender mejor los textos.", "Sesión 5: Antónimos I.", "Identifica y utiliza antónimos en oraciones y situaciones comunicativas.", "Ejercicios escritos y participación en clase."),
  RV_U2_S1: buildInfo("Comunicación", "Lee diversos tipos de textos escritos. Obtiene información del texto. Reflexiona sobre el uso del lenguaje.", "Comprende relaciones semánticas entre palabras para mejorar la comprensión lectora.", "Sesión 1: Antónimos II.", "Identifica y emplea antónimos adecuados según el contexto.", "Ejercicios de identificación y uso en oraciones."),
  RV_U2_S2: buildInfo("Comunicación", "Escribe diversos tipos de textos en su lengua materna. Usa convenciones del lenguaje escrito.", "Distingue palabras de forma similar y significado diferente para evitar errores en la escritura.", "Sesión 2: Parónimos I.", "Reconoce parónimos y diferencia su significado en ejemplos dados.", "Fichas de trabajo y ejercicios escritos."),
  RV_U2_S3: buildInfo("Comunicación", "Escribe textos con precisión léxica.", "Utiliza correctamente parónimos en la redacción de textos breves.", "Sesión 3: Parónimos II.", "Emplea parónimos de manera pertinente en situaciones comunicativas.", "Producciones escritas contextualizadas."),
  RV_U2_S4: buildInfo("Comunicación", "Lee y reflexiona sobre textos.", "Reconoce palabras homónimas y comprende su significado según el contexto.", "Sesión 4: Homonimia.", "Identifica homónimos en oraciones y explica su significado contextual.", "Análisis de oraciones y ejemplos propios."),
  RV_U2_S5: buildInfo("Comunicación", "Amplía su vocabulario y comprende el léxico.", "Agrupa palabras según su significado común, fortaleciendo la comprensión textual.", "Sesión 5: Campo semántico.", "Organiza palabras en campos semánticos correctamente.", "Organizadores gráficos y mapas semánticos."),
};

function valueToNivel(average: number): Nivel {
  if (average >= 3.5) return "AD";
  if (average >= 2.5) return "A";
  if (average >= 1.5) return "B";
  return "C";
}

function createInitialState(): RegistroState {
  const state: RegistroState = {};
  for (const student of students) {
    state[student.id] = {
      unidad1: Array.from({ length: 10 }, () => "" as Nivel),
      unidad2: Array.from({ length: 10 }, () => "" as Nivel),
    };
  }
  return state;
}

function calcLogroFinal(values: Nivel[]): Nivel {
  const valid = values.filter((v): v is Exclude<Nivel, ""> => v !== "");
  if (valid.length === 0) return "";
  const average = valid.reduce((acc, value) => acc + nivelToValue[value], 0) / valid.length;
  return valueToNivel(average);
}

function getNivelStyle(nivel: Nivel): React.CSSProperties {
  switch (nivel) {
    case "AD":
      return { backgroundColor: "#DCFCE7", color: "#166534", fontWeight: 700 };
    case "A":
      return { backgroundColor: "#DBEAFE", color: "#1E40AF", fontWeight: 700 };
    case "B":
      return { backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: 700 };
    case "C":
      return { backgroundColor: "#FEE2E2", color: "#991B1B", fontWeight: 700 };
    default:
      return { backgroundColor: "#FFFFFF", color: "#111827" };
  }
}

function isStudentAtRisk(registro: Record<UnidadKey, Nivel[]>, area: AreaKey): boolean {
  const sessionCount = getSessionCount(area);
  const logro1 = calcLogroFinal(registro.unidad1.slice(0, sessionCount));
  const logro2 = calcLogroFinal(registro.unidad2.slice(0, sessionCount));
  return logro1 === "B" || logro1 === "C" || logro2 === "B" || logro2 === "C";
}

function buildStudentReportLocal(
  registro: Record<UnidadKey, Nivel[]>,
  area: AreaKey,
): ReporteEstudiante {
  const sessionCount = getSessionCount(area);
  const unidad1 = registro.unidad1.slice(0, sessionCount);
  const unidad2 = registro.unidad2.slice(0, sessionCount);
  const logroFinal1 = calcLogroFinal(unidad1);
  const logroFinal2 = calcLogroFinal(unidad2);
  const dificultades =
    logroFinal1 === "B" || logroFinal1 === "C" || logroFinal2 === "B" || logroFinal2 === "C"
      ? ["Requiere mayor acompañamiento para consolidar aprendizajes fundamentales."]
      : ["No se observan dificultades significativas en el periodo evaluado."];

  return {
    logroFinal1,
    logroFinal2,
    logros: ["Participa en el proceso de aprendizaje del área de " + area + "."],
    dificultades,
    recomendaciones: ["Mantener práctica constante y refuerzo semanal de los contenidos desarrollados."],
  };
}


function exportToExcelCompatible(registros: RegistroState, area: AreaKey): void {
  const sessionCount = getSessionCount(area);
  const labels = sessionCount === 10 ? sessionLabels10 : sessionLabels5;

  let html = "<table border='1'>";
  html += "<tr><th colspan='30'>REGISTRO AUXILIAR DE EVALUACIÓN DE LOS APRENDIZAJES</th></tr>";
  html += "<tr><th>Área</th><th>" + area + "</th></tr>";
  html += "<tr><th>Grado</th><th>6.º grado</th></tr>";
  html += "<tr></tr>";

  html += "<tr><th>N°</th><th>APELLIDOS Y NOMBRES</th>";
  labels.forEach(l => html += "<th>" + l + "</th>");
  html += "<th>LOGRO FINAL I</th>";
  labels.forEach(l => html += "<th>" + l + "</th>");
  html += "<th>LOGRO FINAL II</th></tr>";

  for (const student of students) {
    const unidad1 = registros[student.id].unidad1.slice(0, sessionCount);
    const unidad2 = registros[student.id].unidad2.slice(0, sessionCount);

    html += "<tr>";
    html += "<td>" + student.id + "</td>";
    html += "<td>" + student.nombre + "</td>";

    unidad1.forEach(v => html += "<td>" + v + "</td>");
    html += "<td>" + calcLogroFinal(unidad1) + "</td>";

    unidad2.forEach(v => html += "<td>" + v + "</td>");
    html += "<td>" + calcLogroFinal(unidad2) + "</td>";

    html += "</tr>";
  }

  html += "</table>";

  const uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html);
  const link = document.createElement('a');
  link.href = uri;
  link.download = 'registro_auxiliar_' + area.replace(/ /g, '_') + '.xls';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function InfoModal({
  open,
  tema,
  onClose,
}: {
  open: boolean;
  tema: string;
  onClose: () => void;
}) {
  if (!open) return null;
  const info = infoPorTema[tema] ?? placeholderInfo("General", tema);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-[98%] max-w-6xl overflow-auto rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">{info.contenido}</h2>
        <table className="min-w-full border-collapse text-sm text-slate-800">
          <thead className="sticky top-0 z-30 bg-[#1E3A8A] text-white">
            <tr className="bg-slate-100">
              <th className="border px-3 py-2 text-left">ÁREAS</th>
              <th className="border px-3 py-2 text-left">COMPETENCIAS / CAPACIDADES</th>
              <th className="border px-3 py-2 text-left">ESTÁNDARES</th>
              <th className="border px-3 py-2 text-left">CONTENIDOS</th>
              <th className="border px-3 py-2 text-left">CRITERIO</th>
              <th className="border px-3 py-2 text-left">EVIDENCIAS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{info.area}</td>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{info.competencia}</td>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{info.estandar}</td>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{info.contenido}</td>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{info.criterio}</td>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{info.evidencias}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function UnidadModal({
  open,
  unidad,
  area,
  sesiones,
  onClose,
}: {
  open: boolean;
  unidad: UnidadAprendizaje | null;
  area: AreaKey;
  sesiones: string[];
  onClose: () => void;
}) {
  if (!open || !unidad) return null;
  const sesionesTexto = sesiones.map((s, i) => "Sesión " + String(i + 1) + ": " + s).join(" | ");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-[98%] max-w-6xl overflow-auto rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-bold">{unidad.titulo}</h2>
        <table className="min-w-full border-collapse text-sm text-slate-800">
          <thead>
            <tr className="bg-slate-100">
              <th className="border px-3 py-2 text-left">UNIDAD</th>
              <th className="border px-3 py-2 text-left">ÁREA</th>
              <th className="border px-3 py-2 text-left">GRADO</th>
              <th className="border px-3 py-2 text-left">DURACIÓN</th>
              <th className="border px-3 py-2 text-left">SITUACIÓN SIGNIFICATIVA</th>
              <th className="border px-3 py-2 text-left">SESIONES</th>
              <th className="border px-3 py-2 text-left">PRODUCTO GENERAL</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-3 py-2 align-top">{unidad.codigo}</td>
              <td className="border px-3 py-2 align-top">{area}</td>
              <td className="border px-3 py-2 align-top">6.º grado</td>
              <td className="border px-3 py-2 align-top">{unidad.duracion}</td>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{unidad.situacion}</td>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{sesionesTexto}</td>
              <td className="border px-3 py-2 align-top whitespace-pre-line">{unidad.productoGeneral}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-6 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function StudentReportModal({
  open,
  student,
  report,
  area,
  loadingIA,
  onClose,
}: {
  open: boolean;
  student: Student | null;
  report: ReporteEstudiante | null;
  area: AreaKey;
  loadingIA: boolean;
  onClose: () => void;
}) {
  if (!open || !student || !report) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold">Informe automático del estudiante</h2>
        <p className="mt-1 text-slate-600">Estudiante: {student.nombre}</p>
        <p className="text-slate-600">Área: {area}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-slate-500">Logro Final I Unidad</div>
            <div className="mt-2 inline-block rounded-xl px-4 py-2 font-bold" style={getNivelStyle(report.logroFinal1)}>
              {report.logroFinal1 || "-"}
            </div>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="text-sm text-slate-500">Logro Final II Unidad</div>
            <div className="mt-2 inline-block rounded-xl px-4 py-2 font-bold" style={getNivelStyle(report.logroFinal2)}>
              {report.logroFinal2 || "-"}
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          {loadingIA ? (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-800">
              Generando reporte con inteligencia artificial...
            </div>
          ) : report.reporteIA ? (
            <div className="whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 p-4 leading-relaxed text-slate-800">
              {report.reporteIA}
            </div>
          ) : (
            <>
              <div>
                <div className="font-semibold">Logros</div>
                <ul className="list-disc pl-5">{report.logros.map((item, i) => <li key={"l" + i}>{item}</li>)}</ul>
              </div>
              <div>
                <div className="font-semibold">Dificultades</div>
                <ul className="list-disc pl-5">{report.dificultades.map((item, i) => <li key={"d" + i}>{item}</li>)}</ul>
              </div>
              <div>
                <div className="font-semibold">Recomendaciones</div>
                <ul className="list-disc pl-5">{report.recomendaciones.map((item, i) => <li key={"r" + i}>{item}</li>)}</ul>
              </div>
            </>
          )}
        </div>
        <div className="mt-6 text-right">
          <button type="button" onClick={onClose} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function TemaHeaderCell({
  session,
  infoKey,
  onOpen,
}: {
  session: string;
  infoKey: string;
  onOpen: (tema: string) => void;
}) {
  return (
    <th className="border border-slate-300 bg-white px-1 py-1 align-bottom">
      <div className="flex h-28 flex-col items-center justify-between">
        <button
          type="button"
          onClick={() => onOpen(infoKey)}
          className="mt-1 rounded-md border border-slate-300 bg-[#DBEAFE] px-1 text-[10px] font-bold text-slate-900"
        >
          i
        </button>
        <div className="mx-auto h-24 w-6 whitespace-normal break-words text-center font-medium [writing-mode:vertical-rl] rotate-180">
          {session}
        </div>
      </div>
    </th>
  );
}

function RegistroRow({
  student,
  registro,
  onChangeNivel,
  area,
  onViewReport,
}: {
  student: Student;
  registro: Record<UnidadKey, Nivel[]>;
  onChangeNivel: (studentId: number, unidad: UnidadKey, index: number, value: Nivel) => void;
  area: AreaKey;
  onViewReport: (student: Student) => void;
}) {
  const sessionCount = getSessionCount(area);
  const unidad1Visible = registro.unidad1.slice(0, sessionCount);
  const unidad2Visible = registro.unidad2.slice(0, sessionCount);
  const logroFinalU1 = calcLogroFinal(unidad1Visible);
  const logroFinalU2 = calcLogroFinal(unidad2Visible);

  return (
    <tr className="even:bg-white odd:bg-slate-50 hover:bg-slate-50">
      <td className="border border-slate-300 px-2 text-center font-semibold">{student.id}</td>
      <td className="border border-slate-300 bg-white px-2 py-1 font-medium">
        <div className="flex items-center justify-between gap-2">
          <span>{student.nombre}</span>
          <button
            type="button"
            onClick={() => onViewReport(student)}
            className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700"
          >
            Reporte
          </button>
        </div>
      </td>
      {unidad1Visible.map((nivel, index) => (
        <td key={"u1-" + student.id + "-" + index} className="border border-slate-300 p-0 text-center">
          <select
            value={nivel}
            onChange={(e) => onChangeNivel(student.id, "unidad1", index, e.target.value as Nivel)}
            className="h-9 w-full border-0 bg-transparent text-center text-xs font-bold outline-none"
            style={nivel ? getNivelStyle(nivel) : { backgroundColor: "#EFF6FF", color: "#475569" }}
          >
            {niveles.map((option) => (
              <option key={student.id + "-u1-opt-" + option + "-" + index} value={option}>
                {option || "-"}
              </option>
            ))}
          </select>
        </td>
      ))}
      <td className="border border-slate-300 text-center text-sm font-extrabold" style={getNivelStyle(logroFinalU1)}>
        {logroFinalU1 || "-"}
      </td>
      {unidad2Visible.map((nivel, index) => (
        <td key={"u2-" + student.id + "-" + index} className="border border-slate-300 p-0 text-center">
          <select
            value={nivel}
            onChange={(e) => onChangeNivel(student.id, "unidad2", index, e.target.value as Nivel)}
            className="h-9 w-full border-0 bg-transparent text-center text-xs outline-none"
            style={nivel ? getNivelStyle(nivel) : { backgroundColor: "#EFF6FF", color: "#475569" }}
          >
            {niveles.map((option) => (
              <option key={student.id + "-u2-opt-" + option + "-" + index} value={option}>
                {option || "-"}
              </option>
            ))}
          </select>
        </td>
      ))}
      <td className="border border-slate-300 text-center text-sm font-extrabold" style={getNivelStyle(logroFinalU2)}>
        {logroFinalU2 || "-"}
      </td>
    </tr>
  );
}

function extractMainCompetencia(text: string): string {
  const clean = (text || "").trim();
  if (!clean) return "Competencia";
  return clean.includes(".") ? clean.split(".")[0].trim() : clean;
}

function getAreaCompetencias(area: AreaKey): string[] {
  if (area === "Matemática" || area === "Razonamiento Matemático") {
    return [
      "Resuelve problemas de cantidad",
      "Resuelve problemas de regularidad, equivalencia y cambio",
      "Resuelve problemas de forma, movimiento y localización",
      "Resuelve problemas de gestión de datos e incertidumbre",
    ];
  }
  if (area === "Comunicación" || area === "Razonamiento Verbal") {
    return [
      "Se comunica oralmente en su lengua materna",
      "Lee diversos tipos de textos escritos",
      "Escribe diversos tipos de textos",
    ];
  }
  if (area === "Personal Social") {
    return [
      "Construye su identidad",
      "Convive y participa democráticamente en la búsqueda del bien común",
      "Construye interpretaciones históricas",
      "Gestiona responsablemente el espacio y el ambiente",
      "Gestiona responsablemente los recursos económicos",
    ];
  }
  if (area === "Ciencia y Tecnología") {
    return [
      "Indaga mediante métodos científicos",
      "Explica el mundo físico basándose en conocimientos",
      "Diseña y construye soluciones tecnológicas",
    ];
  }
  return [
    "Construye su identidad como persona humana amada por Dios",
    "Asume la experiencia del encuentro personal y comunitario con Dios",
  ];
}

function normalizeCompetenciaName(text: string): string {
  const clean = (text || "").trim();
  const all = [
    ...getAreaCompetencias("Matemática"),
    ...getAreaCompetencias("Comunicación"),
    ...getAreaCompetencias("Personal Social"),
    ...getAreaCompetencias("Ciencia y Tecnología"),
    ...getAreaCompetencias("Religión"),
  ];
  const lower = clean.toLowerCase();
  const exact = all.find((item) => lower.includes(item.toLowerCase()));
  if (exact) return exact;
  return clean.includes(".") ? clean.split(".")[0].trim() : clean;
}

function getCompetenciaGroups(area: AreaKey, units: AreaConfig): CompetenciaGroup[] {
  const count = getSessionCount(area);
  const competenciasBase = getAreaCompetencias(area);
  const grouped: Record<string, CompetenciaGroup> = {};

  competenciasBase.forEach((competencia) => {
    grouped[competencia] = { nombre: competencia, sesiones: [] };
  });

  (["unidad1", "unidad2"] as UnidadKey[]).forEach((unidad) => {
    units[unidad].sesiones.slice(0, count).forEach((session, index) => {
      const infoKey = units[unidad].infoKeys[index];
      const info = infoPorTema[infoKey];
      const competenciaDetectada = info ? normalizeCompetenciaName(info.competencia) : "";
      const competenciaValida = competenciasBase.find((item) => competenciaDetectada.toLowerCase().includes(item.toLowerCase())) || competenciasBase[0];
      grouped[competenciaValida].sesiones.push({ unidad, index, label: session });
    });
  });

  return competenciasBase.map((competencia) => grouped[competencia]);
}

function calcCompetenciaLogroPorEstudiante(registro: Record<UnidadKey, Nivel[]>, group: CompetenciaGroup): Nivel {
  const values = group.sesiones.map((s) => registro[s.unidad][s.index] ?? "");
  return calcLogroFinal(values);
}

function calcLogroAreaPorEstudiante(registro: Record<UnidadKey, Nivel[]>, groups: CompetenciaGroup[]): Nivel {
  const values = groups.map((group) => calcCompetenciaLogroPorEstudiante(registro, group));
  return calcLogroFinal(values);
}

function ResumenAcademicoModal({
  open,
  onClose,
  registros,
  area,
  units,
}: {
  open: boolean;
  onClose: () => void;
  registros: RegistroState;
  area: AreaKey;
  units: AreaConfig;
}) {
  if (!open) return null;

  const groups = getCompetenciaGroups(area, units);
  const [duplicarOrigen, setDuplicarOrigen] = useState<Record<string, string>>({});
  const [registrosResumen, setRegistrosResumen] = useState<RegistroState>(registros);

  const obtenerNotasGrupo = (
    registro: Record<UnidadKey, Nivel[]>,
    group: CompetenciaGroup,
  ): Nivel[] => group.sesiones.map((sesion) => registro[sesion.unidad][sesion.index] ?? "");

  const duplicarCompetenciaSinSesiones = (destino: CompetenciaGroup, origenNombre: string) => {
    const origen = groups.find((g) => g.nombre === origenNombre);
    if (!origen || !destino || destino.sesiones.length > 0) return;

    const next: RegistroState = { ...registrosResumen };
    students.forEach((student) => {
      next[student.id] = {
        ...next[student.id],
        unidad1: [...next[student.id].unidad1],
        unidad2: [...next[student.id].unidad2],
      };
    });
    setDuplicarOrigen((prev) => ({ ...prev, [destino.nombre]: origenNombre }));
    setRegistrosResumen(next);
  };

  const obtenerValorMostrado = (
    studentId: number,
    group: CompetenciaGroup,
    sesion?: { unidad: UnidadKey; index: number; label: string },
  ): Nivel => {
    if (group.sesiones.length > 0 && sesion) {
      return registrosResumen[studentId][sesion.unidad][sesion.index] ?? "";
    }
    const origenNombre = duplicarOrigen[group.nombre];
    if (!origenNombre) return "";
    const origen = groups.find((g) => g.nombre === origenNombre);
    if (!origen) return "";
    return calcLogroFinal(obtenerNotasGrupo(registrosResumen[studentId], origen));
  };

  const obtenerLogroCompetencia = (studentId: number, group: CompetenciaGroup): Nivel => {
    if (group.sesiones.length > 0) {
      return calcCompetenciaLogroPorEstudiante(registrosResumen[studentId], group);
    }
    const origenNombre = duplicarOrigen[group.nombre];
    if (!origenNombre) return "";
    const origen = groups.find((g) => g.nombre === origenNombre);
    if (!origen) return "";
    return calcLogroFinal(obtenerNotasGrupo(registrosResumen[studentId], origen));
  };

  const exportarResumenAcademicoExcel = () => {
    let html = "<table border='1'>";
    html += "<tr><th colspan='300'>RESUMEN ACADÉMICO - " + area + "</th></tr>";

    html += "<tr>";
    html += "<th rowspan='3'>APELLIDOS Y NOMBRES</th>";
    groups.forEach((group) => {
      html += "<th colspan='" + Math.max(group.sesiones.length, 1) + "'>" + group.nombre + "</th>";
      html += "<th rowspan='3'>Logro final de la competencia</th>";
    });
    html += "<th rowspan='3'>Logro final del área</th>";
    html += "</tr>";

    html += "<tr>";
    groups.forEach((group) => {
      if (group.sesiones.length > 0) {
        group.sesiones.forEach((sesion) => {
          html += "<th>Sesión " + (sesion.index + 1) + "</th>";
        });
      } else {
        html += "<th>Competencia sin sesiones</th>";
      }
    });
    html += "</tr>";

    html += "<tr>";
    groups.forEach((group) => {
      if (group.sesiones.length > 0) {
        group.sesiones.forEach((sesion) => {
          html += "<th>" + sesion.label + "</th>";
        });
      } else {
        html += "<th>" + (duplicarOrigen[group.nombre] ? "Duplicada de: " + duplicarOrigen[group.nombre] : "-") + "</th>";
      }
    });
    html += "</tr>";

    students.forEach((student) => {
      const logroArea = calcLogroAreaPorEstudiante(registrosResumen[student.id], groups.map((g) => ({ ...g })));
      html += "<tr>";
      html += "<td>" + student.nombre + "</td>";
      groups.forEach((group) => {
        if (group.sesiones.length > 0) {
          group.sesiones.forEach((sesion) => {
            const valor = obtenerValorMostrado(student.id, group, sesion);
            html += "<td>" + (valor || "-") + "</td>";
          });
        } else {
          const valor = obtenerValorMostrado(student.id, group);
          html += "<td>" + (valor || "-") + "</td>";
        }
        html += "<td>" + (obtenerLogroCompetencia(student.id, group) || "-") + "</td>";
      });
      html += "<td>" + (logroArea || "-") + "</td>";
      html += "</tr>";
    });

    html += "</table>";

    const uri = "data:application/vnd.ms-excel;charset=utf-8," + encodeURIComponent(html);
    const link = document.createElement("a");
    link.href = uri;
    link.download = "resumen_academico_" + area.replace(/ /g, "_") + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-[99%] max-w-[1800px] overflow-auto rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Resumen Académico</h2>
            <p className="text-sm text-slate-600">Área: {area}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportarResumenAcademicoExcel}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Exportar Excel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-2xl border border-slate-700">
          <table className="min-w-max border-collapse text-[11px] text-slate-800">
            <thead>
              <tr>
                <th
                  rowSpan={3}
                  className="min-w-[240px] border border-slate-700 bg-[#1E3A8A] px-3 py-2 text-center text-sm font-bold text-white"
                >
                  APELLIDOS Y NOMBRES
                </th>
                {groups.map((group) => (
                  <React.Fragment key={group.nombre}>
                    <th
                      colSpan={Math.max(group.sesiones.length, 1)}
                      className="border border-slate-700 bg-[#1E3A8A] px-3 py-2 text-center text-sm font-bold text-white"
                    >
                      {group.nombre}
                    </th>
                    <th
                      rowSpan={3}
                      className="min-w-[92px] border border-slate-700 bg-[#1E3A8A] px-2 py-2 text-center text-sm font-bold text-white"
                    >
                      <div className="[writing-mode:vertical-rl] rotate-180">
                        Logro final de la competencia
                      </div>
                    </th>
                  </React.Fragment>
                ))}
                <th
                  rowSpan={3}
                  className="min-w-[92px] border border-slate-700 bg-[#1E3A8A] px-2 py-2 text-center text-sm font-bold text-white"
                >
                  <div className="[writing-mode:vertical-rl] rotate-180">
                    Logro final del área
                  </div>
                </th>
              </tr>
              <tr>
                {groups.map((group) =>
                  group.sesiones.length > 0 ? (
                    group.sesiones.map((sesion) => (
                      <th
                        key={group.nombre + '-sesion-' + sesion.unidad + '-' + String(sesion.index)}
                        className="border border-slate-700 bg-slate-100 py-1 text-center font-semibold"
                      >
                        Sesión {sesion.index + 1}
                      </th>
                    ))
                  ) : (
                    <th
                      key={group.nombre + '-sin-sesion'}
                      className="border border-slate-700 bg-slate-100 py-1 text-center font-semibold"
                    >
                      <div className="flex flex-col items-center gap-1 p-1">
                        <select
                          value={duplicarOrigen[group.nombre] || ''}
                          onChange={(e) => setDuplicarOrigen((prev) => ({ ...prev, [group.nombre]: e.target.value }))}
                          className="w-full rounded border border-slate-300 bg-white text-[10px] text-slate-900"
                        >
                          <option value="">Elegir competencia</option>
                          {groups.filter((g) => g.nombre !== group.nombre && g.sesiones.length > 0).map((g) => (
                            <option key={group.nombre + g.nombre} value={g.nombre}>{g.nombre}</option>
                          ))}
                        </select>
                        
                      </div>
                    </th>
                  )
                )}
              </tr>
              <tr>
                {groups.map((group) =>
                  group.sesiones.length > 0 ? (
                    group.sesiones.map((sesion) => (
                      <th
                        key={group.nombre + sesion.unidad + String(sesion.index)}
                        className="border border-slate-300 bg-white px-1 py-1 align-bottom"
                      >
                        <div className="mx-auto flex h-28 w-8 items-end justify-center">
                          <div className="text-center text-[10px] font-medium [writing-mode:vertical-rl] rotate-180">
                            {sesion.label}
                          </div>
                        </div>
                      </th>
                    ))
                  ) : (
                    <th
                      key={group.nombre + '-sin-label'}
                      className="border border-slate-700 bg-white px-1 py-1 text-center"
                    >
                      {duplicarOrigen[group.nombre] ? 'Duplicada' : '-'}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const registro = registrosResumen[student.id];
                const logroArea = calcLogroAreaPorEstudiante(registro, groups.map((group) => {
                  if (group.sesiones.length > 0) return group;
                  const origen = groups.find((g) => g.nombre === duplicarOrigen[group.nombre]);
                  return origen ? { ...group, sesiones: [{ unidad: origen.sesiones[0]?.unidad || 'unidad1', index: origen.sesiones[0]?.index || 0, label: origen.nombre }] } : group;
                }));

                return (
                  <tr key={'resumen-' + student.id}>
                    <td className="border border-slate-700 px-3 py-2 text-left font-medium">
                      {student.nombre}
                    </td>
                    {groups.map((group) => {
                      const logroCompetencia = obtenerLogroCompetencia(student.id, group);

                      return (
                        <React.Fragment key={String(student.id) + group.nombre}>
                          {group.sesiones.length > 0 ? (
                            group.sesiones.map((sesion) => {
                              const valor = obtenerValorMostrado(student.id, group, sesion);
                              return (
                                <td
                                  key={String(student.id) + group.nombre + sesion.unidad + String(sesion.index)}
                                  className="border border-slate-300 p-0 text-center"
                                >
                                  <div
                                    className="flex h-11 w-full items-center justify-center text-[11px] font-bold"
                                    style={valor ? getNivelStyle(valor) : { backgroundColor: '#dbe7f7', color: '#1d4ed8', fontWeight: 700 }}
                                  >
                                    {valor || '-'}
                                  </div>
                                </td>
                              );
                            })
                          ) : (
                            <td
                              key={String(student.id) + group.nombre + '-empty'}
                              className="border border-slate-300 p-0 text-center"
                            >
                              <div className="flex h-11 w-full items-center justify-center bg-[#dbe7f7] text-[11px] font-bold text-slate-500">
                                {obtenerValorMostrado(student.id, group) || '-'}
                              </div>
                            </td>
                          )}
                          <td
                            className="border border-slate-300 text-center text-sm font-extrabold"
                            style={getNivelStyle(logroCompetencia)}
                          >
                            {logroCompetencia || '-'}
                          </td>
                        </React.Fragment>
                      );
                    })}
                    <td
                      className="border border-slate-300 text-center text-sm font-extrabold"
                      style={getNivelStyle(logroArea)}
                    >
                      {logroArea || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [loginOk, setLoginOk] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [mostrarUnidad, setMostrarUnidad] = useState(false);
  const [unidadActiva, setUnidadActiva] = useState<UnidadAprendizaje | null>(null);
  const [temaInfo, setTemaInfo] = useState("");
  const [registros, setRegistros] = useState<RegistroState>(() => {
    const saved = localStorage.getItem("registro_auxiliar_notas");
    return saved ? JSON.parse(saved) : createInitialState();
  });
  const [grado, setGrado] = useState("6.º grado");
  const [seccion] = useState("C");
  const [area, setArea] = useState<AreaKey>("Matemática");
  const [busqueda, setBusqueda] = useState("");

useEffect(() => {
  fetch("https://script.google.com/macros/s/AKfycbyQYrRcH-4cUaL6ZGHOuN6xMiK6eN_YHEY1wMODvIxYbkIND4O9_xYz8BYc7txIB9aEIw/exec")
    .then(res => res.json())
    .then(data => {
      if (data.registros) {
        setRegistros(data.registros);
      }
    })
    .catch(() => {});
}, []);

  const [filtroRiesgo, setFiltroRiesgo] = useState<FiltroRiesgo>("todos");
  const [studentReportOpen, setStudentReportOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [reporteIA, setReporteIA] = useState<string>("");
  const [loadingReporteIA, setLoadingReporteIA] = useState(false);
  const [notaMasiva, setNotaMasiva] = useState<Exclude<Nivel, "">>("A");
  const [mostrarResumenAcademico, setMostrarResumenAcademico] = useState(false);

  const units = unitsByArea[area];
  const sessionCount = getSessionCount(area);
  const sessionLabels = sessionCount === 10 ? sessionLabels10 : sessionLabels5;

useEffect(() => {
  localStorage.setItem("registro_auxiliar_notas", JSON.stringify(registros));

  fetch("https://script.google.com/macros/s/AKfycbyQYrRcH-4cUaL6ZGHOuN6xMiK6eN_YHEY1wMODvIxYbkIND4O9_xYz8BYc7txIB9aEIw/exec", {
    method: "POST",
    body: JSON.stringify({
      area,
      registros,
    }),
  }).catch(() => {});
}, [registros]);

  fetch("https://script.google.com/macros/s/AKfycbyQYrRcH-4cUaL6ZGHOuN6xMiK6eN_YHEY1wMODvIxYbkIND4O9_xYz8BYc7txIB9aEIw/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      area,
      registros,
    }),
  }).catch(() => {});
}, [registros]);

  const estudiantesFiltrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    return students.filter((student) => {
      const matchText = query === "" || student.nombre.toLowerCase().includes(query);
      const matchRisk = filtroRiesgo === "todos" || isStudentAtRisk(registros[student.id], area);
      return matchText && matchRisk;
    });
  }, [busqueda, filtroRiesgo, registros, area]);

  const openInfo = (tema: string) => {
    setTemaInfo(tema);
    setMostrarInfo(true);
  };

  const openUnidad = (codigo: "U1" | "U2") => {
    setUnidadActiva(unidadesAprendizaje[codigo]);
    setMostrarUnidad(true);
  };

  const openStudentReport = async (student: Student) => {
    setSelectedStudent(student);
    setReporteIA("");
    setStudentReportOpen(true);

    const reporteBase = buildStudentReportLocal(registros[student.id], area);
    const apiUrl = (globalThis as typeof globalThis & { __OPENAI_REPORT_API_URL__?: string }).__OPENAI_REPORT_API_URL__;

    if (!apiUrl) return;

    try {
      setLoadingReporteIA(true);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          estudiante: student.nombre,
          area,
          grado,
          seccion,
          logroFinal1: reporteBase.logroFinal1,
          logroFinal2: reporteBase.logroFinal2,
          logros: reporteBase.logros,
          dificultades: reporteBase.dificultades,
          recomendaciones: reporteBase.recomendaciones,
        }),
      });

      if (!response.ok) throw new Error("No se pudo generar el reporte con IA");
      const data = await response.json();
      setReporteIA(String(data.reporte || data.texto || ""));
    } catch {
      setReporteIA("No se pudo generar el reporte con inteligencia artificial. Se mantiene el reporte automático local.");
    } finally {
      setLoadingReporteIA(false);
    }
  };

  const updateNivel = (studentId: number, unidad: UnidadKey, index: number, value: Nivel) => {
    setRegistros((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [unidad]: prev[studentId][unidad].map((item, idx) => (idx === index ? value : item)),
      },
    }));
  };

  const aplicarNotaMasiva = (unidad: UnidadKey, index: number, value: Exclude<Nivel, "">) => {
    setRegistros((prev) => {
      const next: RegistroState = { ...prev };
      for (const student of students) {
        next[student.id] = {
          ...next[student.id],
          [unidad]: next[student.id][unidad].map((item, idx) => (idx === index ? value : item)),
        };
      }
      return next;
    });
  };

  const limpiarTodo = () => {
    setRegistros(createInitialState());
  };

  const currentReport = selectedStudent
    ? { ...buildStudentReportLocal(registros[selectedStudent.id], area), reporteIA }
    : null;

  const ingresar = () => {
    if (usuario === "ademer" && password === "1234") {
      setLoginOk(true);
      setErrorLogin("");
      return;
    }
    setErrorLogin("Usuario o contraseña incorrectos");
  };

  if (!loginOk) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-center text-2xl font-bold text-slate-800">
            Acceso al sistema
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Registro Auxiliar de Evaluación
          </p>

          <div className="mt-6 space-y-4">
            <input
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
            />

            {errorLogin && (
              <p className="text-sm font-medium text-red-600">{errorLogin}</p>
            )}

            <button
              type="button"
              onClick={ingresar}
              className="w-full rounded-xl bg-[#1E3A8A] px-4 py-3 text-sm font-bold text-white shadow"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.assert(valueToNivel(3.6) === "AD", "3.6 debe devolver AD");
  console.assert(valueToNivel(2.6) === "A", "2.6 debe devolver A");
  console.assert(valueToNivel(1.6) === "B", "1.6 debe devolver B");
  console.assert(valueToNivel(1.0) === "C", "1.0 debe devolver C");
  console.assert(calcLogroFinal(["AD", "A", "A"]) === "A", "Promedio AD-A-A debe devolver A");

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-[1900px] space-y-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div>
                <h1 className="text-center text-2xl font-bold tracking-tight md:text-4xl">
                  REGISTRO AUXILIAR DE EVALUACIÓN DE LOS APRENDIZAJES
                </h1>

                <p className="mt-1 text-center text-sm font-semibold text-slate-600">
                  Por ADEMER HUAHUACONDORI ARANDA - Diseñador de Aprendizajes
                </p>
                <p className="mt-2 text-sm text-slate-600 md:text-base">
                  Área: <span className="font-semibold">{area}</span>
                </p>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-3 lg:justify-start">
                <button
                  type="button"
                  onClick={() => openUnidad("U1")}
                  className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow"
                >
                  UNIDAD DE APRENDIZAJE I
                </button>
                <button
                  type="button"
                  onClick={() => openUnidad("U2")}
                  className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
                >
                  UNIDAD DE APRENDIZAJE II
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {([
                  "Matemática",
                  "Comunicación",
                  "Personal Social",
                  "Ciencia y Tecnología",
                  "Religión",
                  "Razonamiento Matemático",
                  "Razonamiento Verbal",
                ] as AreaKey[]).map((areaItem) => (
                  <button
                    key={areaItem}
                    type="button"
                    onClick={() => setArea(areaItem)}
                    className={
                      "rounded-2xl px-4 py-2 text-sm font-semibold shadow-sm " +
                      (area === areaItem ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700")
                    }
                  >
                    {areaItem}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <input
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm outline-none"
                  placeholder="Grado"
                />
                <input
                  value={seccion}
                  readOnly
                  className="rounded-2xl border border-slate-300 bg-slate-100 px-4 py-2 text-sm outline-none"
                  placeholder="Sección"
                />
                <input
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm outline-none"
                  placeholder="Buscar estudiante"
                />
                <select
                  value={filtroRiesgo}
                  onChange={(e) => setFiltroRiesgo(e.target.value as FiltroRiesgo)}
                  className="rounded-2xl border border-slate-300 px-4 py-2 text-sm outline-none"
                >
                  <option value="todos">Todos los estudiantes</option>
                  <option value="riesgo">Estudiantes en riesgo (B y C)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              Grado: <span className="font-bold">{grado}</span>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              Sección: <span className="font-bold">{seccion}</span>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
              Docente: <span className="font-bold">LIC. ADEMER HUAHUACONDORI ARANDA</span>
            </div>
            <button
              type="button"
              onClick={() => exportToExcelCompatible(registros, area)}
              className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Exportar Excel (.xls)
            </button>
            <button
              type="button"
              onClick={() => setMostrarResumenAcademico(true)}
              className="rounded-2xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Resumen Académico
            </button>
            <button
              type="button"
              onClick={limpiarTodo}
              className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Limpiar registro
            </button>
          </div>
        </div>

        <div className="overflow-auto rounded-2xl border border-slate-300 bg-[#F8FAFC] shadow-sm">
          <table className="min-w-[1700px] border-collapse text-[11px] text-slate-800 bg-white">
            <thead>
              <tr>
                <th rowSpan={5} className="border border-slate-300 bg-white px-2 py-3 text-center text-xl font-bold">
                  N°
                </th>
                <th
                  rowSpan={5}
                  className="min-w-[300px] border border-slate-300 bg-white px-3 py-3 text-center text-base font-bold"
                >
                  APELLIDOS Y NOMBRES
                </th>
                <th
                  colSpan={sessionCount}
                  className="border border-slate-300 border-r-2 border-r-slate-500 bg-[#1E3A8A] py-1 text-center text-xl font-bold text-white"
                >
                  {units.unidad1.titulo}
                </th>
                <th rowSpan={5} className="w-10 border border-slate-300 bg-[#FEF3C7] text-center text-lg font-bold">
                  <div className="[writing-mode:vertical-rl] rotate-180">LOGRO FINAL</div>
                </th>
                <th
                  colSpan={sessionCount}
                  className="border border-slate-300 border-r-2 border-r-slate-500 bg-[#1E3A8A] py-1 text-center text-xl font-bold text-white"
                >
                  {units.unidad2.titulo}
                </th>
                <th rowSpan={5} className="w-10 border border-slate-300 bg-[#FEF3C7] text-center text-lg font-bold">
                  <div className="[writing-mode:vertical-rl] rotate-180">LOGRO FINAL</div>
                </th>
              </tr>
              <tr>
                {weekLabels.map((week) => (
                  <th
                    key={"u1-" + week}
                    colSpan={sessionCount / 5}
                    className="border border-slate-300 bg-[#DBEAFE] py-1 text-center text-base font-semibold text-slate-900"
                  >
                    {week}
                  </th>
                ))}
                {weekLabels.map((week) => (
                  <th
                    key={"u2-" + week}
                    colSpan={sessionCount / 5}
                    className="border border-slate-300 bg-[#DBEAFE] py-1 text-center text-base font-semibold text-slate-900"
                  >
                    {week}
                  </th>
                ))}
              </tr>
              <tr>
                {units.unidad1.sesiones.slice(0, sessionCount).map((_, index) => (
                  <th key={"mass-u1-" + index} className="border border-slate-300 bg-[#DBEAFE] py-1 text-center text-slate-900">
                    <div className="flex flex-col items-center gap-1 px-1">
                      <select
                        value={notaMasiva}
                        onChange={(e) => setNotaMasiva(e.target.value as Exclude<Nivel, "">)}
                        className="w-full rounded border border-slate-300 bg-white text-[10px] text-slate-900"
                      >
                        <option value="AD">AD</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => aplicarNotaMasiva("unidad1", index, notaMasiva)}
                        className="rounded bg-emerald-600 px-1 py-0.5 text-[10px] font-bold text-white shadow-sm"
                      >
                        Aplicar
                      </button>
                    </div>
                  </th>
                ))}
                {units.unidad2.sesiones.slice(0, sessionCount).map((_, index) => (
                  <th key={"mass-u2-" + index} className="border border-slate-300 bg-[#DBEAFE] py-1 text-center text-slate-900">
                    <div className="flex flex-col items-center gap-1 px-1">
                      <select
                        value={notaMasiva}
                        onChange={(e) => setNotaMasiva(e.target.value as Exclude<Nivel, "">)}
                        className="w-full rounded border border-slate-300 bg-white text-[10px] text-slate-900"
                      >
                        <option value="AD">AD</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => aplicarNotaMasiva("unidad2", index, notaMasiva)}
                        className="rounded bg-emerald-600 px-1 py-0.5 text-[10px] font-bold text-white shadow-sm"
                      >
                        Aplicar
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                {sessionLabels.map((label) => (
                  <th key={"l1-" + label} className="border border-slate-300 bg-[#DBEAFE] py-1 text-center font-semibold text-slate-900">
                    {label}
                  </th>
                ))}
                {sessionLabels.map((label) => (
                  <th key={"l2-" + label} className="border border-slate-300 bg-[#DBEAFE] py-1 text-center font-semibold text-slate-900">
                    {label}
                  </th>
                ))}
              </tr>
              <tr>
                {units.unidad1.sesiones.slice(0, sessionCount).map((session, index) => (
                  <TemaHeaderCell
                    key={"s1-" + index}
                    session={session}
                    infoKey={units.unidad1.infoKeys[index]}
                    onOpen={openInfo}
                  />
                ))}
                {units.unidad2.sesiones.slice(0, sessionCount).map((session, index) => (
                  <TemaHeaderCell
                    key={"s2-" + index}
                    session={session}
                    infoKey={units.unidad2.infoKeys[index]}
                    onOpen={openInfo}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {estudiantesFiltrados.map((student) => (
                <RegistroRow
                  key={student.id}
                  student={student}
                  registro={registros[student.id]}
                  onChangeNivel={updateNivel}
                  area={area}
                  onViewReport={openStudentReport}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InfoModal open={mostrarInfo} tema={temaInfo} onClose={() => setMostrarInfo(false)} />
      <UnidadModal
        open={mostrarUnidad}
        unidad={unidadActiva}
        area={area}
        sesiones={
          unidadActiva?.codigo === "U1"
            ? units.unidad1.sesiones.slice(0, sessionCount)
            : units.unidad2.sesiones.slice(0, sessionCount)
        }
        onClose={() => setMostrarUnidad(false)}
      />
      <StudentReportModal
        open={studentReportOpen}
        student={selectedStudent}
        report={currentReport}
        area={area}
        loadingIA={loadingReporteIA}
        onClose={() => setStudentReportOpen(false)}
      />
      <ResumenAcademicoModal
        open={mostrarResumenAcademico}
        onClose={() => setMostrarResumenAcademico(false)}
        registros={registros}
        area={area}
        units={units}
      />
    </div>
  );
}