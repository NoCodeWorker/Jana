"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Brain, CheckCircle, MessageSquare, Mic, PlusCircle, Search, Send, ShieldCheck, Users } from "lucide-react";
import { Student, Teacher, useMockData } from "@/components/mock-data-context";
import { SpeechRecognitionConstructor, SpeechRecognitionLike } from "@/components/backstage/speech-recognition-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";
type ChatMessageTag = "normal" | "importante" | "divulgacion" | "critica" | "obligatorio" | "urgente" | "seguimiento" | "confidencial";

type InternalChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: JanaRole | "sistema";
  text: string;
  timestamp: string;
  status?: "enviado" | "leído";
  tag?: ChatMessageTag;
};

type InternalConversation = {
  id: string;
  title: string;
  subtitle: string;
  kind: "directa" | "grupo" | "oficial";
  participants: string[];
  unread: number;
  messages: InternalChatMessage[];
};

type ChatContactKind = JanaRole | "grupo";

type ChatContact = {
  id: string;
  name: string;
  kind: ChatContactKind;
  roleLabel: string;
  subtitle: string;
  sede: string;
  members: string[];
  locked?: boolean;
};

type ChatContactFilter = "todos" | "profesor" | "alumno" | "direccion" | "admin" | "grupo";

const chatMessageTags: Record<ChatMessageTag, { label: string; hint: string; className: string }> = {
  normal: {
    label: "Normal",
    hint: "Mensaje informativo sin prioridad especial.",
    className: "border-border bg-black/15 text-foreground-muted",
  },
  importante: {
    label: "Importante",
    hint: "Requiere atención preferente.",
    className: "border-jana-primary/30 bg-jana-primary/10 text-jana-primary-accessible",
  },
  divulgacion: {
    label: "Divulgación",
    hint: "Información general para conocimiento del grupo.",
    className: "border-info/30 bg-info/10 text-info",
  },
  critica: {
    label: "Crítica constructiva",
    hint: "Feedback de mejora con tono pedagógico.",
    className: "border-brain/30 bg-brain/10 text-brain",
  },
  obligatorio: {
    label: "Obligado cumplimiento",
    hint: "Instrucción que debe cumplirse.",
    className: "border-warning/35 bg-warning/10 text-warning",
  },
  urgente: {
    label: "Urgente",
    hint: "Necesita respuesta o acción inmediata.",
    className: "border-error/35 bg-error/10 text-error",
  },
  seguimiento: {
    label: "Seguimiento",
    hint: "Mensaje para revisar evolución o tarea pendiente.",
    className: "border-success/30 bg-success/10 text-success",
  },
  confidencial: {
    label: "Confidencial",
    hint: "Contenido sensible dentro del canal oficial.",
    className: "border-production/35 bg-production/10 text-production",
  },
};

const getChatIdentity = (role: JanaRole) => {
  const identity: Record<JanaRole, { id: string; name: string; label: string }> = {
    direccion: { id: "direccion", name: "Dirección JANA", label: "Dirección" },
    admin: { id: "admin", name: "Administración Madrid Sede Central", label: "Administración" },
    profesor: { id: "prof-elena", name: "Elena Ruiz", label: "Profesorado" },
    alumno: { id: "alu-sofia", name: "Sofía García García", label: "Alumnado" },
  };
  return identity[role];
};

const chatFilterLabels: Record<ChatContactFilter, string> = {
  todos: "Todos",
  profesor: "Profesorado",
  alumno: "Alumnado",
  direccion: "Dirección",
  admin: "Administración",
  grupo: "Grupos",
};

const createOfficialGroupContacts = (activeSede: string): ChatContact[] => [
  {
    id: "group-profesores-sede",
    name: "Grupo de profesores · Sede",
    kind: "grupo",
    roleLabel: "Grupo oficial",
    subtitle: `${activeSede} · coordinación docente`,
    sede: activeSede,
    members: ["Elena Ruiz", "Carlos Gómez", "David López", "Luis Miguel"],
  },
  {
    id: "group-profesores-global",
    name: "Grupo de profesores · Todas las sedes",
    kind: "grupo",
    roleLabel: "Grupo oficial",
    subtitle: "Todas las sedes · coordinación docente",
    sede: "Todas las sedes",
    members: ["Elena Ruiz", "Carlos Gómez", "María Ortega", "Javier Sanz", "Sofía Blanco", "David López", "Ana Belén", "Luis Miguel", "Laura Gil", "Fernando Rey"],
  },
  {
    id: "group-profesores-alumnos-sede",
    name: "Grupo de profesores y alumnos · Sede",
    kind: "grupo",
    roleLabel: "Comunicado mixto",
    subtitle: `${activeSede} · docencia y alumnado`,
    sede: activeSede,
    members: ["Elena Ruiz", "Carlos Gómez", "Sofía García García", "Mateo Rodríguez", "Valentina González"],
  },
  {
    id: "group-profesores-alumnos-global",
    name: "Grupo de profesores y alumnos · Todas las sedes",
    kind: "grupo",
    roleLabel: "Comunicado mixto",
    subtitle: "Todas las sedes · docencia y alumnado",
    sede: "Todas las sedes",
    members: ["Elena Ruiz", "Carlos Gómez", "María Ortega", "Javier Sanz", "Sofía García García", "Mateo Rodríguez", "Valentina González", "Lucía Pérez Alonso", "Martina Ruiz Gutiérrez"],
  },
  {
    id: "group-profesores-direccion-sede",
    name: "Grupo de profesores y dirección · Sede",
    kind: "grupo",
    roleLabel: "Coordinación interna",
    subtitle: `${activeSede} · decisiones pedagógicas`,
    sede: activeSede,
    members: ["Dirección JANA", "Elena Ruiz", "Carlos Gómez", "David López"],
  },
  {
    id: "group-profesores-direccion-global",
    name: "Grupo de profesores y dirección · Todas las sedes",
    kind: "grupo",
    roleLabel: "Coordinación interna",
    subtitle: "Todas las sedes · decisiones pedagógicas",
    sede: "Todas las sedes",
    members: ["Dirección JANA", "Elena Ruiz", "Carlos Gómez", "María Ortega", "Javier Sanz", "Sofía Blanco", "David López", "Ana Belén", "Luis Miguel", "Laura Gil", "Fernando Rey"],
  },
  {
    id: "group-admin-direccion-sede",
    name: "Grupo de administración y dirección · Sede",
    kind: "grupo",
    roleLabel: "Operaciones",
    subtitle: `${activeSede} · secretaría, pagos e incidencias`,
    sede: activeSede,
    members: ["Dirección JANA", "Administración JANA", "Administración Madrid Sede Central"],
  },
  {
    id: "group-admin-direccion-global",
    name: "Grupo de administración y dirección · Todas las sedes",
    kind: "grupo",
    roleLabel: "Operaciones",
    subtitle: "Todas las sedes · secretaría, pagos e incidencias",
    sede: "Todas las sedes",
    members: ["Dirección JANA", "Administración JANA", "Administración Madrid Sede Central"],
  },
];

const createChatAgenda = (
  activeRole: JanaRole,
  activeSede: string,
  students: Student[],
  teachers: Teacher[]
): ChatContact[] => {
  const current = getChatIdentity(activeRole);
  const sedeStudents = students.filter((student) => student.sede === activeSede);
  const sedeTeachers = teachers.filter((teacher) => teacher.sede === activeSede);
  const managementContacts: ChatContact[] = [
    {
      id: "contact-direccion",
      name: "Dirección JANA",
      kind: "direccion",
      roleLabel: "Dirección",
      subtitle: "Dirección académica y operativa",
      sede: "Todas las sedes",
      members: ["Dirección JANA"],
    },
    {
      id: "contact-admin",
      name: "Administración JANA",
      kind: "admin",
      roleLabel: "Administración",
      subtitle: `Secretaría · ${activeSede}`,
      sede: activeSede,
      members: ["Administración JANA"],
    },
  ];

  const teacherContacts: ChatContact[] = sedeTeachers.map((teacher) => ({
    id: `teacher-${teacher.id}`,
    name: teacher.name,
    kind: "profesor",
    roleLabel: "Profesorado",
    subtitle: teacher.subjects.slice(0, 2).join(" · "),
    sede: teacher.sede,
    members: [teacher.name],
  }));

  const studentContacts: ChatContact[] = sedeStudents.slice(0, activeRole === "direccion" || activeRole === "admin" ? 24 : 12).map((student) => ({
    id: `student-${student.id}`,
    name: student.name,
    kind: "alumno",
    roleLabel: "Alumnado",
    subtitle: `${student.attendance}% asistencia · ${student.grades[0]?.course ?? "Curso activo"}`,
    sede: student.sede,
    members: [student.name],
  }));

  const groupContacts = createOfficialGroupContacts(activeSede);
  const groupById = (id: string) => groupContacts.find((group) => group.id === id);
  const groups = (...ids: string[]) => ids.map(groupById).filter((group): group is ChatContact => Boolean(group));

  const contactsByRole: Record<JanaRole, ChatContact[]> = {
    direccion: [
      ...managementContacts,
      ...teacherContacts,
      ...studentContacts,
      ...groups(
        "group-profesores-direccion-sede",
        "group-profesores-direccion-global",
        "group-admin-direccion-sede",
        "group-admin-direccion-global"
      ),
    ],
    admin: [
      managementContacts[0],
      ...teacherContacts,
      ...studentContacts,
      ...groups("group-admin-direccion-sede", "group-admin-direccion-global"),
    ],
    profesor: [
      managementContacts[0],
      managementContacts[1],
      ...teacherContacts,
      ...studentContacts,
      ...groups(
        "group-profesores-sede",
        "group-profesores-global",
        "group-profesores-alumnos-sede",
        "group-profesores-alumnos-global",
        "group-profesores-direccion-sede",
        "group-profesores-direccion-global"
      ),
    ],
    alumno: [
      managementContacts[1],
      ...teacherContacts.slice(0, 4),
      ...studentContacts.slice(0, 8),
      ...groups("group-profesores-alumnos-sede", "group-profesores-alumnos-global"),
    ],
  };

  return contactsByRole[activeRole].filter((contact) => (
    contact.kind === "grupo" ? contact.members.includes(current.name) : !contact.members.includes(current.name)
  ));
};

const createOfficialConversations = (activeRole: JanaRole, activeSede: string): InternalConversation[] => {
  const now = "Hoy";
  const current = getChatIdentity(activeRole);
  const commonMessages: InternalChatMessage[] = [
    {
      id: "msg-system-official",
      senderId: "sistema",
      senderName: "Sistema JANA",
      senderRole: "sistema",
      text: "Este es el canal oficial de comunicación de JANA. Las comunicaciones externas quedan fuera del registro y responsabilidad operativa de la escuela.",
      timestamp: "09:00",
      status: "leído",
    },
  ];

  const conversations: InternalConversation[] = [
    {
      id: "conv-profesor",
      title: activeRole === "profesor" ? "Sofía García García" : "Elena Ruiz",
      subtitle: activeRole === "profesor" ? "Alumna · Canto 1ºA" : "Profesora de Canto · Madrid Sede Central",
      kind: "directa",
      participants: [current.name, activeRole === "profesor" ? "Sofía García García" : "Elena Ruiz"],
      unread: activeRole === "profesor" ? 1 : 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-101",
          senderId: activeRole === "alumno" ? "prof-elena" : "alu-sofia",
          senderName: activeRole === "alumno" ? "Elena Ruiz" : "Sofía García García",
          senderRole: activeRole === "alumno" ? "profesor" : "alumno",
          text: activeRole === "alumno"
            ? "Sofía, recuerda traer la partitura marcada para revisar respiraciones antes del ensayo."
            : "Elena, ¿puedo enviarte por aquí una duda sobre el ejercicio de respiración antes de la clase?",
          timestamp: "10:12",
          status: "leído",
        },
        {
          id: "msg-102",
          senderId: current.id,
          senderName: current.name,
          senderRole: activeRole,
          text: activeRole === "alumno"
            ? "Sí, la llevo preparada. También he practicado el paso al registro agudo."
            : "Sí, envíamela por aquí. Este canal queda registrado y así puedo revisarlo antes de clase.",
          timestamp: "10:18",
          status: "leído",
        },
      ],
    },
    {
      id: "conv-grupo",
      title: "Canto 1ºA · Grupo oficial",
      subtitle: `${activeSede} · Profesorado y alumnado`,
      kind: "grupo",
      participants: ["Elena Ruiz", "Sofía García García", "Mateo Rodríguez", "Valentina González"],
      unread: 2,
      messages: [
        ...commonMessages,
        {
          id: "msg-201",
          senderId: "prof-elena",
          senderName: "Elena Ruiz",
          senderRole: "profesor",
          text: "Equipo, el ensayo del jueves empieza con calentamiento vocal y después revisamos la escena 3.",
          timestamp: "Ayer 18:30",
          status: "leído",
        },
        {
          id: "msg-202",
          senderId: "alu-mateo",
          senderName: "Mateo Rodríguez",
          senderRole: "alumno",
          text: "¿Tenemos que traer el texto impreso o sirve la versión del aula virtual?",
          timestamp: "Ayer 18:42",
          status: "leído",
        },
        {
          id: "msg-203",
          senderId: "prof-elena",
          senderName: "Elena Ruiz",
          senderRole: "profesor",
          text: "Traedlo impreso si podéis. Lo importante es que estén marcadas las entradas musicales.",
          timestamp: "Ayer 18:50",
          status: "leído",
        },
      ],
    },
    {
      id: "conv-grupo-profesores",
      title: "Profesores · Sede",
      subtitle: `${activeSede} · coordinación docente`,
      kind: "grupo",
      participants: ["Elena Ruiz", "Carlos Gómez", "David López", "Luis Miguel"],
      unread: activeRole === "profesor" ? 1 : 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-211",
          senderId: "prof-carlos",
          senderName: "Carlos Gómez",
          senderRole: "profesor",
          text: "Dejo aquí la pauta común para que los grupos trabajen la entrada escénica con el mismo criterio esta semana.",
          timestamp: "Ayer 16:05",
          status: "leído",
        },
      ],
    },
    {
      id: "conv-grupo-profesores-global",
      title: "Profesores · Todas las sedes",
      subtitle: "Todas las sedes · coordinación docente",
      kind: "grupo",
      participants: ["Elena Ruiz", "Carlos Gómez", "María Ortega", "Javier Sanz", "Sofía Blanco", "David López", "Ana Belén", "Luis Miguel", "Laura Gil", "Fernando Rey"],
      unread: activeRole === "profesor" ? 1 : 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-212",
          senderId: "prof-elena",
          senderName: "Elena Ruiz",
          senderRole: "profesor",
          text: "Comparto la pauta común para que todas las sedes trabajen la preparación de audiciones con el mismo criterio esta semana.",
          timestamp: "Ayer 17:20",
          status: "leído",
        },
      ],
    },
    {
      id: "conv-grupo-profesores-direccion",
      title: "Profesores y dirección · Sede",
      subtitle: `${activeSede} · coordinación pedagógica`,
      kind: "grupo",
      participants: ["Dirección JANA", "Elena Ruiz", "Carlos Gómez", "David López"],
      unread: activeRole === "direccion" ? 1 : 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-221",
          senderId: "direccion",
          senderName: "Dirección JANA",
          senderRole: "direccion",
          text: "Necesito cerrar hoy las necesidades de refuerzo por grupo antes de publicar la planificación de julio.",
          timestamp: now,
          status: "leído",
        },
      ],
    },
    {
      id: "conv-grupo-profesores-direccion-global",
      title: "Profesores y dirección · Todas las sedes",
      subtitle: "Todas las sedes · coordinación pedagógica",
      kind: "grupo",
      participants: ["Dirección JANA", "Elena Ruiz", "Carlos Gómez", "María Ortega", "Javier Sanz", "Sofía Blanco", "David López", "Ana Belén", "Luis Miguel", "Laura Gil", "Fernando Rey"],
      unread: activeRole === "direccion" ? 1 : 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-222",
          senderId: "direccion",
          senderName: "Dirección JANA",
          senderRole: "direccion",
          text: "Abrimos hilo global para alinear criterios de evaluación y necesidades de sustitución entre sedes.",
          timestamp: now,
          status: "leído",
        },
      ],
    },
    {
      id: "conv-grupo-admin-direccion",
      title: "Administración y dirección · Sede",
      subtitle: `${activeSede} · operaciones y secretaría`,
      kind: "grupo",
      participants: ["Dirección JANA", "Administración JANA", "Administración Madrid Sede Central"],
      unread: activeRole === "admin" ? 1 : 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-231",
          senderId: "admin",
          senderName: "Administración JANA",
          senderRole: "admin",
          text: "Quedan pendientes tres confirmaciones de matrícula y dos cambios de horario para validar con dirección.",
          timestamp: now,
          status: "leído",
        },
      ],
    },
    {
      id: "conv-grupo-admin-direccion-global",
      title: "Administración y dirección · Todas las sedes",
      subtitle: "Todas las sedes · operaciones y secretaría",
      kind: "grupo",
      participants: ["Dirección JANA", "Administración JANA", "Administración Madrid Sede Central"],
      unread: activeRole === "admin" ? 1 : 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-232",
          senderId: "admin",
          senderName: "Administración JANA",
          senderRole: "admin",
          text: "Resumen global: revisar cupos de matrícula, confirmaciones pendientes y cambios de horario antes del cierre semanal.",
          timestamp: now,
          status: "leído",
        },
      ],
    },
    {
      id: "conv-admin",
      title: "Administración JANA",
      subtitle: `Secretaría · ${activeSede}`,
      kind: "oficial",
      participants: [current.name, "Administración JANA"],
      unread: 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-301",
          senderId: "admin",
          senderName: "Administración JANA",
          senderRole: "admin",
          text: "El aula 2 queda reservada para las recuperaciones del viernes. Cualquier cambio debe solicitarse por este canal.",
          timestamp: now,
          status: "leído",
        },
      ],
    },
    {
      id: "conv-companero",
      title: activeRole === "alumno" ? "Mateo Rodríguez" : "Carlos Gómez",
      subtitle: activeRole === "alumno" ? "Compañero · Teatro musical" : "Profesor de Expresión Corporal",
      kind: "directa",
      participants: [current.name, activeRole === "alumno" ? "Mateo Rodríguez" : "Carlos Gómez"],
      unread: 0,
      messages: [
        ...commonMessages,
        {
          id: "msg-401",
          senderId: activeRole === "alumno" ? "alu-mateo" : "prof-carlos",
          senderName: activeRole === "alumno" ? "Mateo Rodríguez" : "Carlos Gómez",
          senderRole: activeRole === "alumno" ? "alumno" : "profesor",
          text: activeRole === "alumno"
            ? "¿Repasamos la entrada del dúo antes de la clase?"
            : "Elena, he dejado marcada la pauta corporal para el grupo de canto. Te la paso por aquí.",
          timestamp: "Lun 12:10",
          status: "leído",
        },
      ],
    },
  ];

  return conversations.filter((conversation) => (
    conversation.kind === "grupo" ? conversation.participants.includes(current.name) : true
  ));
};

/* 1.5 BACKSTAGE CHAT (Official Internal Messaging) */
export function ChatView({ activeRole, activeSede }: { activeRole: JanaRole; activeSede: string }) {
  const { students, teachers } = useMockData();
  const currentUser = getChatIdentity(activeRole);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [conversations, setConversations] = useState<InternalConversation[]>(() => createOfficialConversations(activeRole, activeSede));
  const [activeConversationId, setActiveConversationId] = useState("conv-profesor");
  const [newChatText, setNewChatText] = useState("");
  const [selectedMessageTag, setSelectedMessageTag] = useState<ChatMessageTag>("normal");
  const [searchTerm, setSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState("");
  const [conversationSummary, setConversationSummary] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [contactFilter, setContactFilter] = useState<ChatContactFilter>("todos");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const agendaContacts = useMemo(
    () => createChatAgenda(activeRole, activeSede, students, teachers),
    [activeRole, activeSede, students, teachers]
  );

  useEffect(() => {
    const nextConversations = createOfficialConversations(activeRole, activeSede);
    setConversations(nextConversations);
    setActiveConversationId(nextConversations[0]?.id ?? "");
    setNewChatText("");
    setSelectedMessageTag("normal");
    setSearchTerm("");
    setVoiceNotice("");
    setConversationSummary("");
    setComposeOpen(false);
    setContactSearchTerm("");
    setContactFilter("todos");
    setSelectedContactIds([]);
  }, [activeRole, activeSede]);

  useEffect(() => {
    setConversationSummary("");
  }, [activeConversationId]);

  useEffect(() => () => {
    recognitionRef.current?.stop();
  }, []);

  const activeConversation = conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0];
  const filteredConversations = conversations.filter((conversation) => {
    const haystack = `${conversation.title} ${conversation.subtitle} ${conversation.participants.join(" ")}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });
  const visibleAgendaContacts = agendaContacts.filter((contact) => {
    const matchesFilter = contactFilter === "todos" || contact.kind === contactFilter;
    const haystack = `${contact.name} ${contact.subtitle} ${contact.roleLabel} ${contact.sede}`.toLowerCase();
    return matchesFilter && haystack.includes(contactSearchTerm.toLowerCase());
  });
  const selectedContacts = agendaContacts.filter((contact) => selectedContactIds.includes(contact.id));
  const selectedRecipients = Array.from(new Set(selectedContacts.flatMap((contact) => contact.members)));
  const canBulkSelect = contactFilter !== "todos" && contactFilter !== "grupo";

  const toggleContactSelection = (contactId: string) => {
    setSelectedContactIds((prev) => (
      prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
    ));
  };

  const selectVisibleContacts = () => {
    const visibleIds = visibleAgendaContacts.map((contact) => contact.id);
    setSelectedContactIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
  };

  const clearSelectedContacts = () => setSelectedContactIds([]);

  const handleCreateConversation = () => {
    if (!selectedContacts.length) return;

    const isSingleDirect = selectedContacts.length === 1 && selectedContacts[0].members.length === 1 && selectedContacts[0].kind !== "grupo";
    const title = isSingleDirect
      ? selectedContacts[0].name
      : selectedContacts.length === 1
      ? selectedContacts[0].name
      : `Comunicado oficial · ${selectedRecipients.length} destinatarios`;
    const subtitle = isSingleDirect
      ? selectedContacts[0].subtitle
      : `${activeSede} · ${selectedContacts.map((contact) => contact.roleLabel).filter((label, index, labels) => labels.indexOf(label) === index).join(" + ")}`;
    const systemMessage: InternalChatMessage = {
      id: `msg-system-${Date.now()}`,
      senderId: "sistema",
      senderName: "Sistema JANA",
      senderRole: "sistema",
      text: "Conversación creada desde la agenda oficial. El historial queda registrado dentro de JANA Chat.",
      timestamp: "Ahora",
      status: "leído",
    };
    const conversation: InternalConversation = {
      id: `conv-custom-${Date.now()}`,
      title,
      subtitle,
      kind: isSingleDirect ? "directa" : "grupo",
      participants: [currentUser.name, ...selectedRecipients],
      unread: 0,
      messages: [systemMessage],
    };

    setConversations((prev) => [conversation, ...prev]);
    setActiveConversationId(conversation.id);
    setComposeOpen(false);
    setSelectedContactIds([]);
    setContactSearchTerm("");
    setContactFilter("todos");
  };

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim() || !activeConversation) return;

    const message: InternalChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: activeRole,
      text: newChatText.trim(),
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      status: "enviado",
      tag: selectedMessageTag,
    };

    setConversations((prev) => prev.map((conversation) => (
      conversation.id === activeConversation.id
        ? { ...conversation, messages: [...conversation.messages, message], unread: 0 }
        : conversation
    )));
    setNewChatText("");
    setSelectedMessageTag("normal");
    setConversationSummary("");
  };

  const handleSummarizeConversation = () => {
    if (!activeConversation) return;

    const humanMessages = activeConversation.messages.filter((message) => message.senderRole !== "sistema");
    if (!humanMessages.length) {
      setConversationSummary("No hay mensajes suficientes para generar un resumen operativo.");
      return;
    }

    const lastMessages = humanMessages.slice(-4);
    const participants = humanMessages
      .map((message) => message.senderName)
      .filter((name, index, names) => names.indexOf(name) === index);
    const questions = humanMessages.filter((message) => message.text.includes("?") || message.text.includes("¿"));
    const taggedPriorityMessages = humanMessages.filter((message) => (
      message.tag === "urgente" || message.tag === "obligatorio" || message.tag === "importante" || message.tag === "confidencial"
    ));
    const actionSignals = ["recuerda", "traed", "necesito", "queda", "revisar", "confirmaciones", "pendientes", "solicitar"];
    const actionMessages = humanMessages.filter((message) => (
      actionSignals.some((signal) => message.text.toLowerCase().includes(signal))
    ));
    const lastMessage = humanMessages[humanMessages.length - 1];
    const summaryLines = [
      `Participan ${participants.join(", ")} en ${activeConversation.title}.`,
      `Último movimiento: ${lastMessage.senderName} escribió "${lastMessage.text}".`,
      questions.length
        ? `Dudas detectadas: ${questions.map((message) => message.text).slice(-2).join(" · ")}`
        : "No hay dudas abiertas explícitas en los últimos mensajes.",
      taggedPriorityMessages.length
        ? `Mensajes priorizados: ${taggedPriorityMessages.slice(-3).map((message) => `${chatMessageTags[message.tag ?? "normal"].label} de ${message.senderName}`).join(" · ")}`
        : "No hay etiquetas críticas activas en esta conversación.",
      actionMessages.length
        ? `Acción sugerida: revisar ${actionMessages[actionMessages.length - 1].senderName.toLowerCase() === currentUser.name.toLowerCase() ? "tu último compromiso" : `el mensaje de ${actionMessages[actionMessages.length - 1].senderName}`} y convertirlo en tarea si afecta a horarios, aula o seguimiento.`
        : "Acción sugerida: no se detectan compromisos operativos claros.",
      `Contexto reciente: ${lastMessages.map((message) => `${message.senderName}: ${message.text}`).join(" / ")}`,
    ];

    setConversationSummary(summaryLines.join("\n"));
  };

  const handleStartVoice = () => {
    setVoiceNotice("");
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setVoiceNotice("Dictado detenido. Puedes revisar el texto antes de enviar.");
      return;
    }

    const speechWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceNotice("Tu navegador no soporta dictado por voz. Puedes escribir el mensaje manualmente.");
      return;
    }

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      if (transcript) {
        setNewChatText((prev) => `${prev}${prev ? " " : ""}${transcript}`);
      }
    };
    recognition.onerror = () => {
      setVoiceNotice("No se ha podido capturar audio. Revisa permisos de micrófono del navegador.");
      recognitionRef.current = null;
      setIsListening(false);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };
    setIsListening(true);
    setVoiceNotice("Micrófono activo. Habla y el texto aparecerá en el campo de mensaje.");
    recognition.start();
  };

  return (
    <div className="dashboard-canvas space-y-5">
      <section className="rounded-2xl border border-jana-primary/25 bg-jana-primary/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-jana-primary/15 text-jana-primary-accessible">
              <ShieldCheck className="size-5" />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-jana-primary-accessible">Canal oficial de comunicación JANA</p>
              <h2 className="mt-1 text-xl font-black text-foreground">Mensajería interna con historial por conversación</h2>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-foreground-muted">
                Toda comunicación operativa, docente y administrativa debe realizarse aquí para quedar registrada. Cada rol solo ve conversaciones personales y grupos oficiales a los que pertenece.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-black/20 px-4 py-3 text-xs">
            <p className="font-bold text-foreground">{currentUser.name}</p>
            <p className="mt-1 text-muted-foreground">{currentUser.label} · {activeSede}</p>
          </div>
        </div>
      </section>

      <section className="grid min-h-[650px] gap-5 xl:grid-cols-[360px_1fr_320px]">
        <Card className="rounded-xl border-border bg-surface/90 overflow-hidden">
          <CardHeader className="border-b border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <MessageSquare className="size-5 text-jana-primary" />
              Mis conversaciones
              </CardTitle>
              <Button
                type="button"
                size="sm"
                className="h-9 rounded-lg bg-jana-primary px-3 text-xs font-black hover:bg-jana-primary-hover"
                onClick={() => setComposeOpen(true)}
              >
                <PlusCircle className="mr-2 size-4" />
                Nuevo
              </Button>
            </div>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar persona, grupo o canal..."
                className="h-11 rounded-xl bg-black/20 pl-9 text-xs"
              />
            </div>
          </CardHeader>
          <CardContent className="max-h-[560px] space-y-2 overflow-y-auto p-3">
            {filteredConversations.map((conversation) => {
              const lastMessage = conversation.messages[conversation.messages.length - 1];
              const isActive = conversation.id === activeConversation?.id;
              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => {
                    setActiveConversationId(conversation.id);
                    setConversations((prev) => prev.map((item) => item.id === conversation.id ? { ...item, unread: 0 } : item));
                  }}
                  className={cn(
                    "w-full rounded-xl border p-3 text-left transition",
                    isActive ? "border-jana-primary bg-jana-primary/10" : "border-border bg-black/15 hover:bg-surface-elevated/45"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-foreground">{conversation.title}</p>
                      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{conversation.subtitle}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <span className="rounded-full bg-jana-primary px-2 py-0.5 text-[10px] font-black text-primary-foreground">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-foreground-muted">
                    {lastMessage?.senderName}: {lastMessage?.text}
                  </p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogContent className="max-w-5xl rounded-2xl border-border bg-surface p-0">
            <DialogHeader className="border-b border-border p-6 pb-4">
              <DialogTitle className="flex items-center gap-2 text-xl font-black">
                <Users className="size-5 text-jana-primary" />
                Agenda oficial de comunicación
              </DialogTitle>
              <DialogDescription className="max-w-3xl text-xs leading-relaxed text-foreground-muted">
                Selecciona una persona, varios destinatarios o un grupo operativo. Los comunicados creados aquí quedan dentro del canal oficial de JANA.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4 p-6">
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={contactSearchTerm}
                      onChange={(event) => setContactSearchTerm(event.target.value)}
                      placeholder="Buscar por nombre, rol, sede o grupo..."
                      className="h-11 rounded-xl bg-black/20 pl-9 text-xs"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(chatFilterLabels) as ChatContactFilter[]).map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setContactFilter(filter)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-[10px] font-black uppercase tracking-wide transition",
                          contactFilter === filter
                            ? "border-jana-primary bg-jana-primary text-primary-foreground"
                            : "border-border bg-black/20 text-foreground-muted hover:bg-surface-elevated"
                        )}
                      >
                        {chatFilterLabels[filter]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-black/15 p-3">
                  <p className="text-xs text-foreground-muted">
                    {visibleAgendaContacts.length} contactos visibles · {selectedRecipients.length} destinatarios seleccionados
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" className="h-9 rounded-lg text-xs" onClick={selectVisibleContacts}>
                      {canBulkSelect ? `Seleccionar ${chatFilterLabels[contactFilter]}` : "Seleccionar visibles"}
                    </Button>
                    <Button type="button" variant="outline" className="h-9 rounded-lg text-xs" onClick={clearSelectedContacts}>
                      Limpiar
                    </Button>
                  </div>
                </div>

                <div className="grid max-h-[430px] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                  {visibleAgendaContacts.map((contact) => {
                    const isSelected = selectedContactIds.includes(contact.id);
                    return (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => toggleContactSelection(contact.id)}
                        className={cn(
                          "rounded-xl border p-4 text-left transition",
                          isSelected
                            ? "border-jana-primary bg-jana-primary/10"
                            : "border-border bg-black/15 hover:bg-surface-elevated/55"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-foreground">{contact.name}</p>
                            <p className="mt-1 truncate text-[11px] text-foreground-muted">{contact.subtitle}</p>
                          </div>
                          <span className={cn(
                            "flex size-5 shrink-0 items-center justify-center rounded-full border",
                            isSelected ? "border-jana-primary bg-jana-primary text-primary-foreground" : "border-border"
                          )}>
                            {isSelected && <CheckCircle className="size-3" />}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-md border border-border bg-black/25 px-2 py-1 text-[10px] font-bold text-foreground-muted">
                            {contact.roleLabel}
                          </span>
                          <span className="rounded-md border border-border bg-black/25 px-2 py-1 text-[10px] font-bold text-foreground-muted">
                            {contact.sede}
                          </span>
                          {contact.members.length > 1 && (
                            <span className="rounded-md border border-jana-primary/20 bg-jana-primary/10 px-2 py-1 text-[10px] font-black text-jana-primary-accessible">
                              {contact.members.length} miembros
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="border-t border-border bg-black/15 p-6 lg:border-l lg:border-t-0">
                <div className="rounded-xl border border-jana-primary/25 bg-jana-primary/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-jana-primary-accessible">Comunicado oficial</p>
                  <h3 className="mt-2 text-base font-black text-foreground">Destinatarios</h3>
                  <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
                    Puedes crear conversaciones individuales, grupos por rol o comunicados mixtos sin salir del historial interno.
                  </p>
                </div>

                <div className="mt-4 max-h-[240px] space-y-2 overflow-y-auto">
                  {selectedRecipients.length ? selectedRecipients.map((recipient) => (
                    <div key={recipient} className="rounded-lg border border-border bg-surface/80 px-3 py-2 text-xs font-semibold text-foreground">
                      {recipient}
                    </div>
                  )) : (
                    <div className="rounded-lg border border-border bg-surface/70 p-4 text-xs text-foreground-muted">
                      Selecciona contactos de la agenda para preparar el comunicado.
                    </div>
                  )}
                </div>

                <Button
                  type="button"
                  disabled={!selectedContacts.length}
                  className="mt-5 h-11 w-full rounded-xl bg-jana-primary text-xs font-black hover:bg-jana-primary-hover disabled:opacity-45"
                  onClick={handleCreateConversation}
                >
                  Crear conversación
                </Button>
              </aside>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="flex min-h-[650px] flex-col overflow-hidden rounded-xl border-border bg-surface/90">
          {activeConversation && (
            <>
              <CardHeader className="border-b border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-black">{activeConversation.title}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">{activeConversation.subtitle}</p>
                  </div>
                  <span className="rounded-md border border-success/25 bg-success/10 px-2 py-1 text-[10px] font-black text-success">
                    Historial oficial
                  </span>
                </div>
              </CardHeader>

              <div className="flex-1 space-y-3 overflow-y-auto bg-black/10 p-5">
                {activeConversation.messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;
                  const isSystem = msg.senderRole === "sistema";
                  const tagConfig = msg.tag ? chatMessageTags[msg.tag] : null;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        isSystem ? "justify-center" : isMine ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[78%] rounded-2xl border px-4 py-3 text-sm leading-relaxed",
                          isSystem
                            ? "border-warning/25 bg-warning/10 text-warning"
                            : isMine
                            ? "border-jana-primary/20 bg-jana-primary text-primary-foreground"
                            : "border-border bg-surface-elevated text-foreground"
                        )}
                      >
                        {!isSystem && (
                          <div className="mb-1 flex items-center justify-between gap-4 text-[10px] font-bold opacity-80">
                            <span>{msg.senderName}</span>
                            <span>{msg.timestamp}</span>
                          </div>
                        )}
                        {tagConfig && msg.tag !== "normal" && (
                          <span className={cn("mb-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black", tagConfig.className)}>
                            {tagConfig.label}
                          </span>
                        )}
                        <p>{msg.text}</p>
                        {isMine && <p className="mt-1 text-right text-[10px] opacity-70">{msg.status}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendChat} className="border-t border-border bg-surface p-4">
                <div className="mb-3 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Etiqueta del mensaje</p>
                    <p className="text-[10px] text-foreground-muted">{chatMessageTags[selectedMessageTag].hint}</p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {(Object.keys(chatMessageTags) as ChatMessageTag[]).map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedMessageTag(tag)}
                        className={cn(
                          "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-black transition",
                          selectedMessageTag === tag
                            ? chatMessageTags[tag].className
                            : "border-border bg-black/15 text-foreground-muted hover:bg-surface-elevated/50 hover:text-foreground"
                        )}
                      >
                        {chatMessageTags[tag].label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn("size-12 rounded-xl border-border", isListening && "border-jana-primary bg-jana-primary/10 text-jana-primary-accessible")}
                    onClick={handleStartVoice}
                    aria-label={isListening ? "Detener dictado por voz" : "Dictar mensaje por voz"}
                  >
                    <Mic className={cn("size-4", isListening && "animate-pulse")} />
                  </Button>
                  <Input
                    placeholder="Escribe un mensaje oficial..."
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    className="h-12 flex-1 rounded-xl bg-black/20 text-sm"
                  />
                  <Button type="submit" className="h-12 rounded-xl bg-jana-primary px-5 hover:bg-jana-primary-hover">
                    <Send className="size-4" />
                  </Button>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
                  <span>{isListening ? "Escuchando... pulsa de nuevo para detener." : "Micrófono local: dicta el mensaje en navegadores compatibles."}</span>
                  {voiceNotice && <span className="text-warning">{voiceNotice}</span>}
                </div>
              </form>
            </>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <ShieldCheck className="size-5 text-success" />
                Normativa de comunicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 text-xs leading-relaxed text-foreground-muted">
              <p>JANA Chat es el registro oficial para mensajes entre alumnado, profesorado, administración y dirección.</p>
              <p>Los grupos se muestran por pertenencia: un alumno no accede a coordinación docente, dirección ni administración.</p>
              <p>Las conversaciones externas no se consideran trazables para incidencias, cambios de horario, autorizaciones ni seguimiento pedagógico.</p>
              <div className="rounded-lg border border-warning/25 bg-warning/10 p-3 text-warning">
                Usa este canal para proteger a alumnos, familias y equipo docente.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-base font-black">Participantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4">
              {activeConversation?.participants.map((participant) => (
                <div key={participant} className="flex items-center justify-between rounded-lg border border-border bg-black/15 px-3 py-2 text-xs">
                  <span className="font-semibold text-foreground">{participant}</span>
                  <span className="size-2 rounded-full bg-success" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <Brain className="size-5 text-brain" />
                Copiloto de comunicación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 text-xs text-foreground-muted">
              <p>Detecta acuerdos, dudas frecuentes y mensajes que conviene convertir en tarea docente o aviso administrativo.</p>
              {conversationSummary && (
                <div className="whitespace-pre-line rounded-xl border border-brain/25 bg-brain/10 p-3 text-[11px] leading-relaxed text-foreground">
                  {conversationSummary}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full rounded-xl text-xs"
                onClick={handleSummarizeConversation}
              >
                Resumir conversación
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

/* 1.8 BACKSTAGE CONTENT (Teacher AI CMS & Student Notifications) */

