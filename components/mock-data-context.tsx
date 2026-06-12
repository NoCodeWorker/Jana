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
  status: "completado" | "pendiente" | "fallido";
  verifactuStatus: "registrado" | "enviado" | "error";
  syncTime: string;
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
  addGrade: (studentId: string, course: string, grade: number, comment: string) => void;
  sendChatMessage: (senderName: string, text: string) => void;
  updateStudentSkill: (studentId: string, skillName: string, newLevel: number) => void;
};

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// Generate 10 mock teachers
const initialTeachers: Teacher[] = [
  { id: "t1", name: "Elena Ruiz", subjects: ["Canto Lírico", "Técnica Vocal"], sede: "Madrid Centro", hours: 120, influence: 88 },
  { id: "t2", name: "Carlos Gómez", subjects: ["Expresión Corporal", "Improvisación"], sede: "Madrid Centro", hours: 95, influence: 79 },
  { id: "t3", name: "María Ortega", subjects: ["Danza Clásica", "Coordinación"], sede: "Alcalá de Henares", hours: 110, influence: 85 },
  { id: "t4", name: "Javier Sanz", subjects: ["Interpretación", "Construcción de personaje"], sede: "Majadahonda", hours: 80, influence: 74 },
  { id: "t5", name: "Sofía Blanco", subjects: ["Canto Moderno", "Coros"], sede: "Majadahonda", hours: 105, influence: 92 },
  { id: "t6", name: "David López", subjects: ["Ritmo y Percusión", "Armonía"], sede: "Madrid Centro", hours: 60, influence: 68 },
  { id: "t7", name: "Ana Belén", subjects: ["Presencia Escénica", "Oratoria"], sede: "Alcalá de Henares", hours: 90, influence: 81 },
  { id: "t8", name: "Luis Miguel", subjects: ["Danza Jazz", "Ritmo"], sede: "Madrid Centro", hours: 100, influence: 84 },
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

const mockSedes = ["Madrid Centro", "Alcalá de Henares", "Majadahonda"];

const generateInitialStudents = (): Student[] => {
  const list: Student[] = [];
  for (let i = 1; i <= 40; i++) {
    const firstName = spanishFirstNames[(i - 1) % spanishFirstNames.length];
    const lastName1 = spanishLastNames[(i * 3) % spanishLastNames.length];
    const lastName2 = spanishLastNames[(i * 7) % spanishLastNames.length];
    const name = `${firstName} ${lastName1} ${lastName2}`;
    const email = `${firstName.toLowerCase()}.${lastName1.toLowerCase()}${i}@escuelajana.com`;
    const sede = mockSedes[i % mockSedes.length];
    const attendance = Math.floor(Math.random() * 21) + 80; // 80% to 100%
    const punctuality = Math.random() > 0.15;

    // Skills base
    const skills: StudentSkill[] = [
      { name: "Afinación", category: "Canto", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 4 }] },
      { name: "Expresión emocional", category: "Interpretación", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 5 }] },
      { name: "Improvisación", category: "Interpretación", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 3 }] },
      { name: "Ritmo", category: "Danza", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 5 }] },
      { name: "Expresión corporal", category: "Danza", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 4 }] },
      { name: "Técnica vocal", category: "Canto", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 4 }] },
      { name: "Presencia escénica", category: "Interpretación", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 5 }] },
      { name: "Liderazgo escénico", category: "Dinámica", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 3 }] },
      { name: "Capacidad coral", category: "Dinámica", level: Math.floor(Math.random() * 6) + 4, history: [{ timestamp: "2026-05-01", level: 4 }] },
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
        { course: "Técnica Vocal e Interpretación", grade: parseFloat((Math.random() * 4 + 6).toFixed(1)), comments: "Buen desempeño y afinación progresiva." },
        { course: "Danza y Ritmo Escénico", grade: parseFloat((Math.random() * 3 + 7).toFixed(1)), comments: "Excelente sentido del ritmo escénico." },
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
  { id: "fac-101", concept: "Mensualidad Junio - Teatro Musical", amount: 120.00, studentName: "Sofía García García", status: "completado", verifactuStatus: "enviado", syncTime: "2026-06-11 10:14" },
  { id: "fac-102", concept: "Matrícula Taller Intensivo Verano", amount: 150.00, studentName: "Mateo Rodríguez González", status: "completado", verifactuStatus: "registrado", syncTime: "2026-06-11 11:22" },
  { id: "fac-103", concept: "Mensualidad Junio - Canto Lírico", amount: 90.00, studentName: "Valentina González Fernández", status: "pendiente", verifactuStatus: "registrado", syncTime: "2026-06-12 09:05" },
  { id: "fac-104", concept: "Mensualidad Junio - Danza Clásica", amount: 110.00, studentName: "Santiago Fernández López", status: "completado", verifactuStatus: "enviado", syncTime: "2026-06-12 09:30" },
  { id: "fac-105", concept: "Matrícula Taller Improvisación", amount: 75.00, studentName: "Isabella López Martínez", status: "fallido", verifactuStatus: "error", syncTime: "2026-06-12 11:45" },
];

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [activeRole, setActiveRole] = useState<JanaRole>("direccion");
  const [activeSede, setActiveSede] = useState<string>("Madrid Centro");
  const [teachers] = useState<Teacher[]>(initialTeachers);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChats);
  const [invoices] = useState<CRMInvoice[]>(initialInvoices);

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

    // Background IA Agent Trigger (simulated)
    if (activeRole === "profesor" && text.toLowerCase().includes("vocal") && text.toLowerCase().includes("excelente")) {
      // Propose update dynamically
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: `c-ai-${Date.now()}`,
          sender: "JANA Brain [Asistente]",
          role: "direccion",
          text: "🧠 [Sugerencia del Agente IA]: He detectado un progreso técnico vocal excelente. Sugiero actualizar la Skill de 'Técnica Vocal' en el Backstage Talent Graph.",
          timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        };
        setChatMessages(prev => [...prev, aiMessage]);
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
        addGrade,
        sendChatMessage,
        updateStudentSkill,
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
