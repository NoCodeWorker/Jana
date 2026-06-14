"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { JanaRole } from "@/lib/jana-auth";

export type Teacher = {
  id: string;
  name: string;
  subjects: string[];
  sede: string;
  hours: number;
  influence: number; // 0 to 100
};

export type SkillHistory = {
  timestamp: string;
  level: number;
};

export type StudentSkill = {
  name: string;
  category: "Interpretación" | "Canto" | "Danza" | "Música" | "Dinámica";
  level: number;
  history: SkillHistory[];
};

export type Student = {
  id: string;
  name: string;
  email: string;
  sede: string;
  attendance: number; // percentage
  punctuality: boolean;
  grades: { course: string; grade: number; comments: string }[];
  skills: StudentSkill[];
};

export type ChatMessage = {
  id: string;
  sender: string;
  role: JanaRole;
  text: string;
  timestamp: string;
};

export type CRMInvoice = {
  id: string;
  concept: string;
  amount: number;
  studentName: string;
  sede: string;
  status: "completado" | "pendiente" | "fallido";
  verifactuStatus: "registrado" | "enviado" | "error";
  syncTime: string;
};

export type ContentArticleStatus = "borrador_ia" | "revision_profesor" | "publicado";

export interface Infographic {
  id: string;
  title: string;
  prompt: string;
  aspectRatio: "16:9" | "9:16";
  imageUrl: string;
  createdAt: string;
  author: string;
  authorRole: string;
  sede: string;
  audience: string[];
  shareChannels: Array<"infographics" | "chat">;
  viewedBy: string[];
}

export type ContentArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  authorRole: string;
  sede: string;
  topic: string;
  status: ContentArticleStatus;
  publishedAt?: string;
  updatedAt: string;
  seoKeywords: string[];
  geoTargets: string[];
  aioSummary: string;
  readingMinutes: number;
  showOnLanding?: boolean;
};

export type ContentNotification = {
  id: string;
  articleId: string;
  recipientRole: "alumno";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

type MockDataContextType = {
  activeRole: JanaRole;
  setActiveRole: (role: JanaRole) => void;
  activeSede: string;
  setActiveSede: (sede: string) => void;
  teachers: Teacher[];
  students: Student[];
  chatMessages: ChatMessage[];
  invoices: CRMInvoice[];
  contentArticles: ContentArticle[];
  contentNotifications: ContentNotification[];
  infographics: Infographic[];
  addInfographic: (infographic: Infographic) => void;
  shareInfographic: (infographicId: string, options: { audience: string[]; channels: Array<"infographics" | "chat">; message: string }) => void;
  markInfographicViewed: (infographicId: string, viewerId: string) => void;
  addGrade: (studentId: string, course: string, grade: number, comment: string) => void;
  sendChatMessage: (senderName: string, text: string) => void;
  updateStudentSkill: (studentId: string, skillName: string, newLevel: number) => void;
  generateContentArticle: (topic: string, author: string, sede: string) => void;
  updateContentArticle: (articleId: string, updates: Partial<Pick<ContentArticle, "title" | "excerpt" | "body" | "seoKeywords" | "geoTargets" | "aioSummary" | "showOnLanding">>) => void;
  publishContentArticle: (articleId: string) => void;
  deleteContentArticle: (articleId: string) => void;
  markContentNotificationRead: (notificationId: string) => void;
  addInvoice: (concept: string, amount: number, studentName: string, status: CRMInvoice["status"]) => void;
  updateInvoice: (invoiceId: string, updates: Partial<CRMInvoice>) => void;
  eventLogs: Array<{ id: string; timestamp: string; type: string; payload: string; status: "completed" | "processing" }>;
  publishEvent: (type: string, payload: unknown) => void;
};

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// Generate 10 mock teachers
const initialTeachers: Teacher[] = [
  { id: "t1", name: "Elena Ruiz", subjects: ["Canto Lírico", "Técnica Vocal"], sede: "Madrid Sede Central", hours: 120, influence: 88 },
  { id: "t2", name: "Carlos Gómez", subjects: ["Expresión Corporal", "Improvisación"], sede: "Madrid Sede Central", hours: 95, influence: 79 },
  { id: "t3", name: "María Ortega", subjects: ["Danza Clásica", "Coordinación"], sede: "Alcalá de Henares", hours: 110, influence: 85 },
  { id: "t4", name: "Javier Sanz", subjects: ["Interpretación", "Construcción de personaje"], sede: "Majadahonda", hours: 80, influence: 74 },
  { id: "t5", name: "Sofía Blanco", subjects: ["Canto Moderno", "Coros"], sede: "Majadahonda", hours: 105, influence: 92 },
  { id: "t6", name: "David López", subjects: ["Ritmo y Percusión", "Armonía"], sede: "Madrid Sede Central", hours: 60, influence: 68 },
  { id: "t7", name: "Ana Belén", subjects: ["Presencia Escénica", "Oratoria"], sede: "Alcalá de Henares", hours: 90, influence: 81 },
  { id: "t8", name: "Luis Miguel", subjects: ["Danza Jazz", "Ritmo"], sede: "Madrid Sede Central", hours: 100, influence: 84 },
  { id: "t9", name: "Laura Gil", subjects: ["Escucha Activa", "Teatro Musical"], sede: "Majadahonda", hours: 115, influence: 87 },
  { id: "t10", name: "Fernando Rey", subjects: ["Expresión Emocional", "Montaje Escénico"], sede: "Alcalá de Henares", hours: 75, influence: 76 },
];

// Generate 40 mock students
const spanishFirstNames = [
  "Sofía", "Mateo", "Valentina", "Santiago", "Isabella", "Sebastián", "Lucía", "Matías", "Camila", "Alejandro",
  "Martina", "Daniel", "Emilia", "David", "Valeria", "Nicolás", "Gabriela", "Diego", "Sara", "Lucas",
  "Victoria", "Benjamín", "Daniela", "Samuel", "Emma", "Tomás", "María", "Enzo", "Claudia", "Adrián",
  "Julia", "Hugo", "Paula", "Álvaro", "Alba", "Marcos", "Irene", "Leo", "Marta", "Mario"
];

const spanishLastNames = [
  "García", "Rodríguez", "González", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez", "Martin",
  "Jiménez", "Ruiz", "Hernández", "Diaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Alonso", "Gutiérrez",
  "Navarro", "Torres", "Domínguez", "Vázquez", "Ramos", "Gil", "Ramírez", "Serrano", "Blanco", "Molina"
];

const mockSedes = ["Madrid Sede Central", "Alcalá de Henares", "Majadahonda", "México (CDMX)"];

const seededRatio = (seed: number) => {
  const value = Math.sin(seed * 9301 + 49297) * 233280;
  return value - Math.floor(value);
};

const generateInitialStudents = (): Student[] => {
  const list: Student[] = [];
  for (let i = 1; i <= 40; i++) {
    const firstName = spanishFirstNames[(i - 1) % spanishFirstNames.length];
    const lastName1 = spanishLastNames[(i * 3) % spanishLastNames.length];
    const lastName2 = spanishLastNames[(i * 7) % spanishLastNames.length];
    const name = `${firstName} ${lastName1} ${lastName2}`;
    const email = `${firstName.toLowerCase()}.${lastName1.toLowerCase()}${i}@escuelajana.com`;
    const sede = mockSedes[i % mockSedes.length];
    const attendance = Math.floor(seededRatio(i * 11) * 21) + 80; // 80% to 100%
    const punctuality = seededRatio(i * 13) > 0.15;

    // Skills base
    const skills: StudentSkill[] = [
      { name: "Afinación", category: "Canto", level: Math.floor(seededRatio(i * 17 + 1) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 4 }] },
      { name: "Expresión emocional", category: "Interpretación", level: Math.floor(seededRatio(i * 17 + 2) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 5 }] },
      { name: "Improvisación", category: "Interpretación", level: Math.floor(seededRatio(i * 17 + 3) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 3 }] },
      { name: "Ritmo", category: "Danza", level: Math.floor(seededRatio(i * 17 + 4) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 5 }] },
      { name: "Expresión corporal", category: "Danza", level: Math.floor(seededRatio(i * 17 + 5) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 4 }] },
      { name: "Técnica vocal", category: "Canto", level: Math.floor(seededRatio(i * 17 + 6) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 4 }] },
      { name: "Presencia escénica", category: "Interpretación", level: Math.floor(seededRatio(i * 17 + 7) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 5 }] },
      { name: "Liderazgo escénico", category: "Dinámica", level: Math.floor(seededRatio(i * 17 + 8) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 3 }] },
      { name: "Capacidad coral", category: "Dinámica", level: Math.floor(seededRatio(i * 17 + 9) * 6) + 4, history: [{ timestamp: "2026-05-01", level: 4 }] },
    ];

    // Historical dynamic data
    skills.forEach(s => {
      s.history.push({ timestamp: "2026-06-01", level: Math.max(1, s.level - 1) });
    });

    list.push({
      id: `s${i}`,
      name,
      email,
      sede,
      attendance,
      punctuality,
      grades: [
        { course: "Técnica Vocal e Interpretación", grade: parseFloat((seededRatio(i * 19 + 1) * 4 + 6).toFixed(1)), comments: "Buen desempeño y afinación progresiva." },
        { course: "Danza y Ritmo Escénico", grade: parseFloat((seededRatio(i * 19 + 2) * 3 + 7).toFixed(1)), comments: "Excelente sentido del ritmo escénico." },
      ],
      skills,
    });
  }
  return list;
};

const initialStudents = generateInitialStudents();

// Generate initial chats
const initialChats: ChatMessage[] = [
  { id: "c1", sender: "Elena Ruiz", role: "profesor", text: "Hola equipo, recuerden practicar la modulación vocal de la escena 3 antes del ensayo del jueves.", timestamp: "15:20" },
  { id: "c2", sender: "Sofía García García", role: "alumno", text: "¡Hola profesora! Yo he estado practicando el vibrato en los tonos altos. ¿Hacemos repaso técnico antes de cantar con el coro?", timestamp: "15:24" },
  { id: "c3", sender: "Elena Ruiz", role: "profesor", text: "Sí Sofía, dedicaremos los primeros 15 minutos de la clase a repasar la capacidad coral y el soporte diafragmático.", timestamp: "15:26" },
  { id: "c4", sender: "Carlos Gómez", role: "profesor", text: "Por parte de expresión corporal, el grupo de danza clásica ha mejorado mucho el ritmo y colocación de hombros.", timestamp: "16:01" },
];

// Generate initial CRM Invoices
const initialInvoices: CRMInvoice[] = [
  { id: "fac-101", concept: "Mensualidad Junio - Teatro Musical", amount: 120.00, studentName: "Sofía García García", sede: "Madrid Sede Central", status: "completado", verifactuStatus: "enviado", syncTime: "2026-06-11 10:14" },
  { id: "fac-102", concept: "Matrícula Taller Intensivo Verano", amount: 150.00, studentName: "Mateo Rodríguez González", sede: "Madrid Sede Central", status: "completado", verifactuStatus: "registrado", syncTime: "2026-06-11 11:22" },
  { id: "fac-103", concept: "Mensualidad Junio - Canto Lírico", amount: 90.00, studentName: "Valentina González Fernández", sede: "Madrid Sede Central", status: "pendiente", verifactuStatus: "registrado", syncTime: "2026-06-12 09:05" },
  { id: "fac-104", concept: "Mensualidad Junio - Danza Clásica", amount: 110.00, studentName: "Santiago Fernández López", sede: "Alcalá de Henares", status: "completado", verifactuStatus: "enviado", syncTime: "2026-06-12 09:30" },
  { id: "fac-105", concept: "Matrícula Taller Improvisación", amount: 75.00, studentName: "Isabella López Martínez", sede: "Alcalá de Henares", status: "fallido", verifactuStatus: "error", syncTime: "2026-06-12 11:45" },
  { id: "fac-106", concept: "Mensualidad Junio - Canto Moderno", amount: 95.00, studentName: "Camila Pérez Martin", sede: "Majadahonda", status: "completado", verifactuStatus: "enviado", syncTime: "2026-06-12 12:10" },
  { id: "fac-107", concept: "Mensualidad Junio - Teatro Infantil", amount: 105.00, studentName: "Martina Pérez Martin", sede: "Majadahonda", status: "pendiente", verifactuStatus: "registrado", syncTime: "2026-06-12 12:22" },
  { id: "fac-108", concept: "Reserva Clase de Prueba - Interpretación", amount: 40.00, studentName: "Daniel Pérez Martin", sede: "Madrid Sede Central", status: "completado", verifactuStatus: "enviado", syncTime: "2026-06-12 13:05" },
  { id: "fac-109", concept: "Mensualidad Junio - Música", amount: 85.00, studentName: "Lucas Gómez Jiménez", sede: "Alcalá de Henares", status: "completado", verifactuStatus: "registrado", syncTime: "2026-06-12 14:18" },
  { id: "fac-110", concept: "Taller Audiciones Julio", amount: 130.00, studentName: "Paula Martin Pérez", sede: "Madrid Sede Central", status: "completado", verifactuStatus: "enviado", syncTime: "2026-06-12 15:40" },
];

const initialArticles: ContentArticle[] = [
  {
    id: "art-101",
    title: "Cómo preparar la voz antes de una audición musical",
    slug: "preparar-voz-audicion-musical",
    excerpt: "Una guía práctica para que los alumnos lleguen a una audición con respiración, foco y calentamiento vocal bien estructurados.",
    body: "Antes de una audición musical, la preparación vocal debe empezar mucho antes de cantar la primera nota. El alumno necesita activar respiración, postura, resonadores y concentración escénica. En Escuela JANA trabajamos una secuencia breve: movilidad cervical, respiración costo-diafragmática, sirenas suaves y lectura expresiva del texto. La clave no es cantar más fuerte, sino llegar con una voz disponible y una intención artística clara.",
    author: "Elena Ruiz",
    authorRole: "Profesora de Canto",
    sede: "Madrid Sede Central",
    topic: "técnica vocal para audiciones",
    status: "publicado",
    publishedAt: "2026-06-10",
    updatedAt: "2026-06-10",
    seoKeywords: ["preparar voz audición musical", "clases de canto Madrid", "técnica vocal jóvenes"],
    geoTargets: ["Madrid Sede Central", "Alcalá de Henares", "Majadahonda"],
    aioSummary: "Para preparar la voz antes de una audición musical conviene combinar respiración, calentamiento progresivo, articulación y trabajo interpretativo.",
    readingMinutes: 4,
    showOnLanding: true,
  },
  {
    id: "art-102",
    title: "La expresión corporal como herramienta para perder el miedo escénico",
    slug: "expresion-corporal-miedo-escenico",
    excerpt: "Recursos de aula para transformar bloqueo físico en presencia, escucha y acción escénica.",
    body: "El miedo escénico suele aparecer en el cuerpo antes que en la voz. Mandíbula, hombros, respiración y mirada muestran tensión. Una práctica eficaz es desplazar el foco desde la evaluación externa hacia una acción física concreta: caminar con objetivo, mirar a un punto, respirar con ritmo y entrar en relación con el compañero. La expresión corporal no elimina los nervios; los organiza para que el alumno pueda actuar con intención.",
    author: "Carlos Gómez",
    authorRole: "Profesor de Interpretación",
    sede: "Madrid Sede Central",
    topic: "expresión corporal y miedo escénico",
    status: "revision_profesor",
    updatedAt: "2026-06-12",
    seoKeywords: ["miedo escénico adolescentes", "expresión corporal teatro", "clases interpretación Madrid"],
    geoTargets: ["Madrid Sede Central"],
    aioSummary: "La expresión corporal ayuda a gestionar el miedo escénico convirtiendo la tensión en acciones físicas concretas y respetibles.",
    readingMinutes: 5,
    showOnLanding: false,
  },
  {
    id: "art-103",
    title: "La ciencia detrás de meterse en el personaje: Stanislavski y la neuroimagen",
    slug: "stanislavski-neuroimagen-actores",
    excerpt: "Estudios recientes con resonancia magnética funcional demuestran los cambios reales en el cerebro de los actores al encarnar un personaje.",
    body: "Un estudio publicado en la revista científica Royal Society Open Science (2019) utilizó resonancia magnética funcional (fMRI) para examinar la actividad cerebral de actores profesionales entrenados en el sistema de Stanislavski. Los resultados revelaron una desactivación de la corteza prefrontal medial dorsal y ventral al entrar en personaje, sugiriendo una pérdida neurológica del 'yo' y un cambio adaptativo en el procesamiento de perspectiva en primera persona. Esto valida las teorías de Konstantin Stanislavski, quien propuso que para actuar de manera creíble, el actor debe entrenar la mente y el cuerpo para experimentar auténticamente la reality del personaje (el 'mágico si'). Cita de la fuente: Brown, S., et al. (2019). 'The theater of the mind: An fMRI study of acting'. Royal Society Open Science.",
    author: "Carlos Gómez",
    authorRole: "Profesor de Interpretación",
    sede: "Madrid Sede Central",
    topic: "neurobiología de la actuación",
    status: "publicado",
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    seoKeywords: ["neurociencia actuación", "método Stanislavski", "cerebro actores", "teatro musical Madrid"],
    geoTargets: ["Madrid Sede Central", "Alcalá de Henares", "Majadahonda"],
    aioSummary: "Investigaciones con fMRI demuestran que actuar según el método de Stanislavski produce una desactivación en áreas prefrontales del cerebro, confirmando un cambio real en la percepción del yo.",
    readingMinutes: 5,
    showOnLanding: true,
  },
  {
    id: "art-104",
    title: "Control del core y prevención de lesiones en danza contemporánea",
    slug: "control-core-prevencion-lesiones-danza",
    excerpt: "El fortalecimiento del lumbopelvic-hip complex reduce el riesgo de lesiones y mejora la propiocepción de los bailarines.",
    body: "La alta exigencia física de la danza expone a los bailarines a sobrecargas y lesiones de extremidades inferiores. Investigaciones publicadas en Frontiers in Psychology (2021) y el Journal of Dance Medicine & Science demuestran que la estabilidad del core (CS) es el factor de riesgo modificable más crítico. Un core stable acts como el centro de gravedad del bailarín, permitiendo una transferencia de fuerza eficiente hacia las extremidades superiores e inferiores. Los programas específicos de acondicionamiento neuromuscular de 9 a 10 semanas muestran mejoras significativas en el equilibrio unipodal y el control postural dinámico, reduciendo lesiones por compensaciones. Cita de la fuente: Kahles, S., et al. (2021). 'Core Stability and Postural Control in Dancers: A Systematic Review'. Frontiers in Psychology.",
    author: "Carlos Vega",
    authorRole: "Profesor de Danza",
    sede: "Madrid Sede Central",
    topic: "biomecánica de la danza",
    status: "publicado",
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    seoKeywords: ["prevención lesiones danza", "control core bailarines", "danza contemporánea Madrid"],
    geoTargets: ["Madrid Sede Central", "Alcalá de Henares"],
    aioSummary: "Programas de estabilidad del core mejoran el control lumbopélvico y disminuyen significativamente el riesgo de lesiones en bailarines.",
    readingMinutes: 4,
    showOnLanding: true,
  },
  {
    id: "art-105",
    title: "Canto coral y bioquímica: ¿Por qué cantar en grupo reduce el estrés?",
    slug: "canto-coral-bioquimica-estres",
    excerpt: "Estudios clínicos confirman que cantar en coro reduce significativamente los niveles de cortisol y estimula la oxitocina.",
    body: "Cantar en coro no solo es una experiencia estética, sino un potente regulador hormonal. Estudios científicos recopilados por la Royal Society for Public Health (2020) y publicados en el Journal of Music Therapy revelaron que la práctica de canto coral produce una reducción inmediata de cortisol (la hormona del estrés) en la saliva de los participantes. Simultáneamente, el canto en grupo estimula la liberación de oxitocina, hormona ligada a la confianza y la cohesión social, lo que reduce el aislamiento social percibido. Cita de la fuente: Fancourt, D., et al. (2016). 'Singing and Social Connectedness: Biological and Psychological Benefits'. Journal of Music Therapy / RSPH.",
    author: "Elena Ruiz",
    authorRole: "Profesora de Canto",
    sede: "Madrid Sede Central",
    topic: "beneficios del canto coral",
    status: "publicado",
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    seoKeywords: ["beneficios canto coral", "música y oxitocina", "reducir estrés cantando"],
    geoTargets: ["Madrid Sede Central", "Alcalá de Henares", "Majadahonda"],
    aioSummary: "Cantar en grupo reduce el cortisol y aumenta la oxitocina, lo que promueve la calma biológica y fortalece la sensación de pertenencia.",
    readingMinutes: 5,
    showOnLanding: true,
  },
  {
    id: "art-106",
    title: "Improvisación teatral como herramienta frente a la ansiedad social",
    slug: "improvisacion-teatral-ansiedad-social",
    excerpt: "La práctica de la improvisación mejora la tolerancia a la incertidumbre y ayuda a atenuar el miedo escénico.",
    body: "La intolerancia a la incertidumbre es una de las bases cognitivas del miedo escénico y la ansiedad social. Investigaciones lideradas por el Dr. Peter Felsman de la Universidad de Michigan (2019) demuestran que las técnicas de improvisación teatral actúan como una terapia de exposición no clínica eficaz. Al entrenar el principio de 'Aceptar y Construir' (el 'Sí, y...'), los alumnos ensayan la respuesta ante estímulos sociales impredecibles en un entorno lúdico y libre de juicio, reduciendo la hipervigilancia al error. Cita de la fuente: Felsman, P., et al. (2019). 'Improvisational theater training promotes tolerance of uncertainty and reduces anxiety'. Psychology of Aesthetics, Creativity, and the Arts.",
    author: "Carlos Gómez",
    authorRole: "Profesor de Interpretación",
    sede: "Alcalá de Henares",
    topic: "improvisación y ansiedad",
    status: "publicado",
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    seoKeywords: ["improvisación teatro", "miedo escénico", "ansiedad social", "escuela teatro Madrid"],
    geoTargets: ["Madrid Sede Central", "Alcalá de Henares", "Majadahonda"],
    aioSummary: "Estudios confirman que la improvisación teatral fomenta la tolerancia a la incertidumbre y reduce los síntomas de la ansiedad social mediante la exposición grupal positiva.",
    readingMinutes: 6,
    showOnLanding: true,
  },
  {
    id: "art-107",
    title: "Efectos del teatro musical sobre la mentalidad de crecimiento en adolescentes",
    slug: "teatro-musical-mentalidad-crecimiento",
    excerpt: "La naturaleza colaborativa del teatro musical impulsa la resiliencia y la autoconfianza durante la adolescencia.",
    body: "Durante los años de mayor neuroplasticidad en la adolescencia, el entrenamiento integral en teatro musical (que combina canto, danza e interpretación) ofrece un desarrollo socioemocional único. Investigaciones en psicología evolutiva publicadas en Sacred Heart University (2022) muestran que la preparación de un montaje musical estimula una 'mentalidad de crecimiento' (growth mindset). Los alumnos aprenden a conceptualizar el esfuerzo y el error como hitos del proceso de ensayo. El estudio destaca aumentos del 25% en autoevaluaciones de resiliencia y autoeficacia creativa entre los participantes. Cita de la fuente: Sacred Heart University. (2022). 'The impact of musical theater training on adolescent developmental psychology'.",
    author: "Elena Ruiz",
    authorRole: "Profesora de Canto",
    sede: "Majadahonda",
    topic: "desarrollo socioemocional",
    status: "publicado",
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    seoKeywords: ["teatro musical jóvenes", "mentalidad de crecimiento", "psicología adolescentes", "clases teatro musical"],
    geoTargets: ["Madrid Sede Central", "Majadahonda"],
    aioSummary: "El teatro musical promueve la resiliencia y la confianza creativa en adolescentes gracias a su enfoque colaborativo y procesal.",
    readingMinutes: 5,
    showOnLanding: true,
  },
  {
    id: "art-108",
    title: "La importancia del calentamiento fisiológico (SOVTE) en teatro musical",
    slug: "calentamiento-fisiologico-sovte-canto",
    excerpt: "El uso de tubos de resonancia y trinos labiales reduce la presión umbral de fonación y protege contra la fatiga vocal.",
    body: "En el teatro musical, el cantante debe combinar exigencias aeróbicas con un rendimiento vocal de alta intensidad. El Journal of Voice y las guías del National Center for Voice and Speech recomiendan el uso de ejercicios de tracto vocal semiocluido (SOVTE), como la fonación con pajitas o trinos de labios. La semioclusión genera una presión retroactiva (retropresión) que ayuda a equilibrar las presiones sobre los pliegues vocales, disminuyendo la presión umbral de fonación y permitiendo proyectar la voz con mayor resonancia y menor fatiga muscular. Cita de la fuente: Titze, I. R. (2006). 'Voice training and therapy with semi-occluded vocal tract exercises'. Journal of Speech, Language, and Hearing Research.",
    author: "Sofía Blanco",
    authorRole: "Profesora de Canto",
    sede: "Majadahonda",
    topic: "calentamiento vocal fisiológico",
    status: "publicado",
    publishedAt: "2026-06-14",
    updatedAt: "2026-06-14",
    seoKeywords: ["ejercicios SOVTE canto", "calentamiento vocal", "fatiga vocal teatro musical"],
    geoTargets: ["Madrid Sede Central", "Majadahonda", "Alcalá de Henares"],
    aioSummary: "Los ejercicios de tracto vocal semiocluido (SOVTE) equilibran la presión laríngea, disminuyen el esfuerzo fonatorio y previenen la fatiga en cantantes.",
    readingMinutes: 4,
    showOnLanding: true,
  },
];

const initialNotifications: ContentNotification[] = [
  {
    id: "notif-101",
    articleId: "art-101",
    recipientRole: "alumno",
    title: "Nuevo artículo de Elena Ruiz",
    message: "Elena Ruiz ha publicado una guía sobre preparación vocal antes de audiciones.",
    read: false,
    createdAt: "2026-06-10 12:20",
  },
  {
    id: "notif-102",
    articleId: "art-103",
    recipientRole: "alumno",
    title: "Nuevo recurso de Interpretación",
    message: "Carlos Gómez ha publicado un artículo sobre los efectos de actuar en el cerebro según la neurociencia.",
    read: false,
    createdAt: "2026-06-14 10:00",
  },
  {
    id: "notif-103",
    articleId: "art-104",
    recipientRole: "alumno",
    title: "Nuevo recurso de Danza",
    message: "Carlos Vega ha publicado una guía práctica de control del core y alineación postural para evitar lesiones.",
    read: false,
    createdAt: "2026-06-14 11:30",
  },
];

const initialInfographics: Infographic[] = [
  {
    id: "infog-001",
    title: "Técnica de Respiración Costodiafragmática",
    prompt: "Infografía sobre técnica vocal y respiración costodiafragmática para cantantes líricos, con pasos numerados y diagrama anatómico estilizado",
    aspectRatio: "16:9",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1280&h=720&fit=crop&q=80",
    createdAt: "2026-06-14 09:30",
    author: "Elena Ruiz",
    authorRole: "Profesora de Canto Lírico",
    sede: "Madrid Sede Central",
    audience: ["Alumnado Madrid Sede Central", "Canto 1ºA"],
    shareChannels: ["infographics", "chat"],
    viewedBy: [],
  },
  {
    id: "infog-002",
    title: "Fundamentos del Control del Core en Danza",
    prompt: "Infografía vertical sobre control del core, alineación postural y centros de gravedad para bailarines, con ilustraciones del cuerpo en movimiento",
    aspectRatio: "9:16",
    imageUrl: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=720&h=1280&fit=crop&q=80",
    createdAt: "2026-06-14 11:15",
    author: "María Ortega",
    authorRole: "Profesora de Danza Clásica",
    sede: "Alcalá de Henares",
    audience: ["Alumnado Alcalá de Henares", "Danza"],
    shareChannels: ["infographics"],
    viewedBy: ["alumno@jana.os"],
  },
];

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<JanaRole>("direccion");
  const [activeSede, setActiveSede] = useState<string>("Madrid Sede Central");
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChats);
  const [invoices, setInvoices] = useState<CRMInvoice[]>(initialInvoices);
  const [contentArticles, setContentArticles] = useState<ContentArticle[]>(initialArticles);
  const [contentNotifications, setContentNotifications] = useState<ContentNotification[]>(initialNotifications);
  const [infographics, setInfographics] = useState<Infographic[]>(initialInfographics);

  // Event Bus State (Redis Streams simulation)
  const [eventLogs, setEventLogs] = useState<Array<{ id: string; timestamp: string; type: string; payload: string; status: "completed" | "processing" }>>([
    {
      id: "evt-0",
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type: "SYSTEM_BOOT",
      payload: "JANA OS V2.0 initialized.",
      status: "completed",
    }
  ]);

  const publishEvent = (type: string, payload: unknown) => {
    const newEvent = {
      id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      type,
      payload: typeof payload === "string" ? payload : JSON.stringify(payload),
      status: "processing" as const,
    };
    setEventLogs(prev => [newEvent, ...prev]);

    // Async worker processing simulation
    setTimeout(() => {
      setEventLogs(prev => prev.map(evt => evt.id === newEvent.id ? { ...evt, status: "completed" } : evt));
    }, 1200);
  };

  const addInfographic = (infographic: Infographic) => {
    setInfographics(prev => [{ ...infographic, viewedBy: infographic.viewedBy ?? [] }, ...prev]);
    if (infographic.shareChannels.includes("chat")) {
      const chatMessage: ChatMessage = {
        id: `c-infog-${Date.now()}`,
        sender: infographic.author,
        role: "profesor",
        text: `Nueva infografía compartida: "${infographic.title}". Destinatarios: ${infographic.audience.join(", ")}.`,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages(prev => [...prev, chatMessage]);
    }
    publishEvent("INFOGRAFIA_PUBLICADA", { id: infographic.id, title: infographic.title, aspectRatio: infographic.aspectRatio, sede: infographic.sede });
  };

  const shareInfographic = (
    infographicId: string,
    options: { audience: string[]; channels: Array<"infographics" | "chat">; message: string }
  ) => {
    const target = infographics.find(item => item.id === infographicId);
    setInfographics(prev => prev.map(item => (
      item.id === infographicId
        ? { ...item, audience: options.audience, shareChannels: options.channels, viewedBy: [] }
        : item
    )));

    if (target && options.channels.includes("chat")) {
      const chatMessage: ChatMessage = {
        id: `c-infog-${Date.now()}`,
        sender: target.author,
        role: "profesor",
        text: `${options.message} Infografía: "${target.title}". Destinatarios: ${options.audience.join(", ")}.`,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages(prev => [...prev, chatMessage]);
    }

    publishEvent("INFOGRAFIA_COMPARTIDA", { infographicId, audience: options.audience, channels: options.channels });
  };

  const markInfographicViewed = (infographicId: string, viewerId: string) => {
    setInfographics(prev => prev.map(item => (
      item.id === infographicId
        ? { ...item, viewedBy: Array.from(new Set([...(item.viewedBy ?? []), viewerId])) }
        : item
    )));
  };

  const addGrade = (studentId: string, course: string, grade: number, comment: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            grades: [...s.grades, { course, grade, comments: comment }],
          };
        }
        return s;
      })
    );
    publishEvent("ALUMNO_EVALUADO", { studentId, course, grade, comment });
  };

  const sendChatMessage = (senderName: string, text: string) => {
    const newMessage: ChatMessage = {
      id: `c-${Date.now()}`,
      sender: senderName,
      role: activeRole,
      text,
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages(prev => [...prev, newMessage]);
    publishEvent("NUEVO_MENSAJE_CHAT", { sender: senderName, role: activeRole, textLength: text.length });

    // Background IA Agent Trigger (simulated via Event Bus)
    if (activeRole === "profesor" && text.toLowerCase().includes("vocal") && text.toLowerCase().includes("excelente")) {
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: `c-ai-${Date.now()}`,
          sender: "JANA Brain [Asistente]",
          role: "direccion",
          text: "🧠 [Sugerencia del Agente IA]: He detectado un progreso técnico vocal excelente. Sugiero actualizar la Skill de 'Técnica Vocal' en el Backstage Talent Graph.",
          timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        };
        setChatMessages(prev => [...prev, aiMessage]);
        publishEvent("IA_SUGERENCIA_CHAT_GENERADA", { reason: "Excelente progreso técnico vocal" });
      }, 1500);
    }
  };

  const updateStudentSkill = (studentId: string, skillName: string, newLevel: number) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const updatedSkills = s.skills.map(skill => {
            if (skill.name === skillName) {
              return {
                ...skill,
                level: newLevel,
                history: [
                  ...skill.history,
                  { timestamp: new Date().toISOString().split("T")[0], level: newLevel },
                ],
              };
            }
            return skill;
          });
          return { ...s, skills: updatedSkills };
        }
        return s;
      })
    );
    publishEvent("SKILL_GRAPH_ACTUALIZADO", { studentId, skillName, newLevel });
  };

  const generateContentArticle = (topic: string, author: string, sede: string) => {
    const cleanTopic = topic.trim() || "educación artística";
    const now = new Date();
    const id = `art-${now.getTime()}`;
    const title = `Guía docente: ${cleanTopic.charAt(0).toUpperCase()}${cleanTopic.slice(1)}`;
    const slug = cleanTopic
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const article: ContentArticle = {
      id,
      title,
      slug: slug || `articulo-${id}`,
      excerpt: `Artículo educativo generado por JANA Brain para explicar ${cleanTopic} con enfoque práctico para alumnos y familias.`,
      body: `El entrenamiento y desarrollo en la disciplina de "${cleanTopic}" constituye uno de los pilares fundamentales para el crecimiento integral sobre el escenario. Investigaciones científicas y clínicas de primer nivel respaldan cómo la práctica guiada y la repetición deliberada de estas técnicas artísticas promueven el control neuromuscular, la reducción del estrés escénico y la autoeficacia cognitiva.

En Escuela JANA, nuestra metodología docente integra esta especialidad a través de un programa de 4 fases clave:
1. Concientización y postura: Alineación lumbopélvica y anclaje físico para la fonación o el movimiento.
2. Coordinación y técnica: Ejercicios costo-diafragmáticos o dinámicas corporales para ganar precisión.
3. Expresión y actuación: Traslado del control técnico a la intención interpretativa pura del personaje.
4. Cohesión y ensemble: Sincronización y escucha activa en el trabajo grupal.

Cita de referencia académica: Journal of Voice and Performance (2026). "Biomechanical adaptations and neurological perspectives in performing arts pedagogy".`,
      author,
      authorRole: "Profesorado JANA",
      sede,
      topic: cleanTopic,
      status: "borrador_ia",
      updatedAt: now.toISOString().split("T")[0],
      seoKeywords: [`${cleanTopic} escuela artística`, `${cleanTopic} para alumnos`, `formación artística ${sede}`],
      geoTargets: [sede, "Madrid", "Comunidad de Madrid"],
      aioSummary: `${cleanTopic} explicado para alumnos de artes escénicas con ejercicios, contexto pedagógico y recomendaciones de práctica.`,
      readingMinutes: 6,
      showOnLanding: false,
    };

    setContentArticles(prev => [article, ...prev]);
    publishEvent("SEO_GEO_AIO_CONTENIDO_GENERADO", { articleId: id, title, topic: cleanTopic, sede });
  };

  const updateContentArticle = (
    articleId: string,
    updates: Partial<Pick<ContentArticle, "title" | "excerpt" | "body" | "seoKeywords" | "geoTargets" | "aioSummary" | "showOnLanding">>
  ) => {
    setContentArticles(prev => prev.map(article => (
      article.id === articleId
        ? { ...article, ...updates, status: article.status === "publicado" ? article.status : "revision_profesor", updatedAt: new Date().toISOString().split("T")[0] }
        : article
    )));
  };

  const publishContentArticle = (articleId: string) => {
    const publishedAt = new Date().toISOString().split("T")[0];
    setContentArticles(prev => prev.map(article => (
      article.id === articleId
        ? { ...article, status: "publicado", publishedAt, updatedAt: publishedAt }
        : article
    )));

    const article = contentArticles.find(item => item.id === articleId);
    if (!article) return;

    const notification: ContentNotification = {
      id: `notif-${Date.now()}`,
      articleId,
      recipientRole: "alumno",
      title: `Nuevo artículo de ${article.author}`,
      message: `${article.author} ha publicado "${article.title}".`,
      read: false,
      createdAt: new Date().toLocaleString("es-ES", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
    };
    setContentNotifications(prev => [notification, ...prev]);
    publishEvent("CONTENIDO_PUBLICADO", { articleId, title: article.title, status: "publicado" });
  };

  const deleteContentArticle = (articleId: string) => {
    setContentArticles(prev => prev.filter(article => article.id !== articleId));
    setContentNotifications(prev => prev.filter(notification => notification.articleId !== articleId));
  };

  const markContentNotificationRead = (notificationId: string) => {
    setContentNotifications(prev => prev.map(notification => (
      notification.id === notificationId ? { ...notification, read: true } : notification
    )));
  };

  const addInvoice = (concept: string, amount: number, studentName: string, status: CRMInvoice["status"]) => {
    const now = new Date();
    const id = `fac-${100 + invoices.length + 1}`;
    const newInvoice: CRMInvoice = {
      id,
      concept,
      amount,
      studentName,
      sede: activeSede,
      status,
      verifactuStatus: "registrado",
      syncTime: now.toISOString().split("T")[0] + " " + now.toTimeString().split(" ")[0].slice(0, 5),
    };
    setInvoices(prev => [...prev, newInvoice]);
    publishEvent("CRM_FACTURA_COBRADA", { invoiceId: id, concept, amount, studentName, status });
  };

  const updateInvoice = (invoiceId: string, updates: Partial<CRMInvoice>) => {
    setInvoices(prev =>
      prev.map(inv => (inv.id === invoiceId ? { ...inv, ...updates } : inv))
    );
    publishEvent("CRM_FACTURA_ACTUALIZADA", { invoiceId, updates });
  };

  return (
    <MockDataContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeSede,
        setActiveSede,
        teachers,
        students,
        chatMessages,
        invoices,
        contentArticles,
        contentNotifications,
        infographics,
        addInfographic,
        shareInfographic,
        markInfographicViewed,
        addGrade,
        sendChatMessage,
        updateStudentSkill,
        generateContentArticle,
        updateContentArticle,
        publishContentArticle,
        deleteContentArticle,
        markContentNotificationRead,
        addInvoice,
        updateInvoice,
        eventLogs,
        publishEvent,
      }}
    >
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error("useMockData debe ser usado dentro de un MockDataProvider");
  }
  return context;
}
