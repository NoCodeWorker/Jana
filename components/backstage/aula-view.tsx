"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, GraduationCap, Lock, Mic, PlusCircle, ShieldCheck } from "lucide-react";
import { Student, useMockData } from "@/components/mock-data-context";
import { getRelativeDateString } from "@/components/backstage/date-utils";
import { SpeechRecognitionConstructor, SpeechRecognitionLike } from "@/components/backstage/speech-recognition-types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";
export function AulaView({
  activeRole,
  activeSede,
  students,
  email,
}: {
  activeRole: JanaRole;
  activeSede: string;
  students: Student[];
  email: string;
}) {
  const { addGrade, updateStudentSkill } = useMockData();
  const gradeRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("Afinación");
  const [gradeInput, setGradeInput] = useState("8");
  const [commentInput, setCommentInput] = useState("");
  const [strengthInput, setStrengthInput] = useState("");
  const [improvementInput, setImprovementInput] = useState("");
  const [nextStepInput, setNextStepInput] = useState("");
  const [familyNoteInput, setFamilyNoteInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGradeListening, setIsGradeListening] = useState(false);
  const [gradeVoiceNotice, setGradeVoiceNotice] = useState("");
  const [gradeReviewOpen, setGradeReviewOpen] = useState(false);

  const activeStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  const structuredPedagogicalComment = useMemo(() => {
    const fallback = commentInput || "Evaluación periódica de clase.";
    return [
      `Disciplina/Habilidad: ${selectedSkill}`,
      `Observación de aula: ${fallback}`,
      `Fortalezas detectadas: ${strengthInput || "Pendiente de completar en próxima sesión."}`,
      `Notas de mejora: ${improvementInput || "Pendiente de seguimiento específico."}`,
      `Próxima acción docente: ${nextStepInput || "Revisar evolución en la siguiente clase."}`,
      `Comunicación familia/alumno: ${familyNoteInput || "No requiere comunicación adicional en esta revisión."}`,
    ].join("\n");
  }, [commentInput, familyNoteInput, improvementInput, nextStepInput, selectedSkill, strengthInput]);

  // Set default student if none selected
  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  useEffect(() => () => {
    gradeRecognitionRef.current?.stop();
  }, []);

  const applyGradeTranscript = (transcript: string) => {
    const normalized = transcript.trim();
    const gradeMatch = normalized.match(/(?:nota|calificaci[oó]n|puntuaci[oó]n)?\s*(10|[1-9](?:[,.]5)?)/i);
    if (gradeMatch) {
      setGradeInput(gradeMatch[1].replace(",", "."));
    }

    const transcriptWithoutGrade = normalized
      .replace(/(?:nota|calificaci[oó]n|puntuaci[oó]n)?\s*(10|[1-9](?:[,.]5)?)/i, "")
      .trim();
    const normalizeForMatch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const sectionLabels = {
      observation: ["observación", "observacion", "comentario", "feedback", "evaluación", "evaluacion"],
      strengths: ["fortalezas", "fortaleza", "puntos fuertes", "destaca en", "aspectos positivos"],
      improvements: ["notas de mejora", "mejoras", "áreas de mejora", "areas de mejora", "a mejorar", "debe mejorar"],
      next: ["próxima acción", "proxima accion", "acción docente", "accion docente", "siguiente paso", "próxima clase", "proxima clase"],
      family: ["familia", "comunicación familia", "comunicacion familia", "familia alumno", "familia/alumno", "mensaje familia"],
    };
    const allSectionLabels = Object.values(sectionLabels).flat();
    const normalizedTranscript = normalizeForMatch(transcriptWithoutGrade);
    const labelPositions = allSectionLabels
      .map((label) => {
        const index = normalizedTranscript.indexOf(normalizeForMatch(label));
        return index >= 0 ? { label, index, length: normalizeForMatch(label).length } : null;
      })
      .filter((item): item is { label: string; index: number; length: number } => Boolean(item))
      .sort((a, b) => a.index - b.index);
    const extractSection = (labels: string[]) => {
      const match = labelPositions.find((position) => labels.some((label) => normalizeForMatch(label) === normalizeForMatch(position.label)));
      if (!match) return "";
      const next = labelPositions.find((position) => position.index > match.index);
      return transcriptWithoutGrade
        .slice(match.index + match.length, next?.index)
        .replace(/^[:.,;\-\s]+/, "")
        .trim();
    };

    const parsedObservation = extractSection(sectionLabels.observation);
    const parsedStrengths = extractSection(sectionLabels.strengths);
    const parsedImprovements = extractSection(sectionLabels.improvements);
    const parsedNext = extractSection(sectionLabels.next);
    const parsedFamily = extractSection(sectionLabels.family);

    if (parsedObservation) setCommentInput(parsedObservation);
    if (parsedStrengths) setStrengthInput(parsedStrengths);
    if (parsedImprovements) setImprovementInput(parsedImprovements);
    if (parsedNext) setNextStepInput(parsedNext);
    if (parsedFamily) setFamilyNoteInput(parsedFamily);

    const hasStructuredSections = Boolean(parsedObservation || parsedStrengths || parsedImprovements || parsedNext || parsedFamily);
    const cleanComment = transcriptWithoutGrade
      .replace(/^(comentario|feedback|observaci[oó]n|evaluaci[oó]n)\s*[:,-]?\s*/i, "")
      .trim();

    if (!hasStructuredSections && cleanComment) {
      setCommentInput((prev) => `${prev}${prev ? " " : ""}${cleanComment}`);
      if (!improvementInput && /debe|mejor|cuidar|reforzar|trabajar/i.test(cleanComment)) {
        setImprovementInput(cleanComment);
      } else if (!strengthInput) {
        setStrengthInput(cleanComment);
      }
    }
  };

  const handleDemoGradeDictation = () => {
    const demoTranscript = "Nota 8.5. Observación: mantiene buena afinación y respiración diafragmática. Fortalezas: escucha activa, presencia y respiración estable en registro medio. Mejoras: preparar mejor las entradas del segundo acto y sostener la intención escénica hasta el final de frase. Próxima acción: asignar práctica breve de entradas con metrónomo y revisar en los primeros 10 minutos de la próxima clase. Familia: evolución positiva; conviene reforzar constancia de práctica en casa sin aumentar presión.";
    applyGradeTranscript(demoTranscript);
    setGradeVoiceNotice("Modo demo aplicado: se ha simulado un dictado para evaluar el flujo completo sin depender del permiso del micrófono.");
  };

  const handleStartGradeVoice = () => {
    setGradeVoiceNotice("");
    if (isGradeListening && gradeRecognitionRef.current) {
      gradeRecognitionRef.current.stop();
      setGradeVoiceNotice("Dictado detenido. Revisa la nota y el comentario antes de enviar al RAG Aula.");
      return;
    }

    const speechWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const Recognition = speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;

    if (!Recognition) {
      setGradeVoiceNotice("Tu navegador no soporta dictado por voz. Usa el modo demo o registra la calificación manualmente.");
      return;
    }

    const recognition = new Recognition();
    gradeRecognitionRef.current = recognition;
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();
      if (transcript) {
        applyGradeTranscript(transcript);
      }
    };
    recognition.onerror = () => {
      gradeRecognitionRef.current = null;
      setIsGradeListening(false);
      setGradeVoiceNotice("No se ha podido capturar audio. Revisa permisos del navegador o usa el modo demo para evaluar el flujo.");
    };
    recognition.onend = () => {
      gradeRecognitionRef.current = null;
      setIsGradeListening(false);
    };
    setIsGradeListening(true);
    setGradeVoiceNotice("Micrófono activo. Puedes decir: nota 8, fortalezas..., mejoras..., próxima acción..., familia...");
    recognition.start();
  };

  const handleOptimizeFeedback = () => {
    if (!commentInput) {
      setGradeVoiceNotice("Por favor escribe una observación en el campo de 'Feedback pedagógico' primero.");
      return;
    }
    
    setIsGradeListening(true);
    setGradeVoiceNotice("Optimizando comentarios con Profesor Copilot (IA)...");
    
    setTimeout(() => {
      const text = commentInput.toLowerCase();
      
      let strength = "Voz y actitud proactiva en el aula.";
      if (text.includes("buena") || text.includes("destaca") || text.includes("escucha") || text.includes("afinacion") || text.includes("afinación")) {
        strength = "Muestra una afinación estable y " + (text.includes("escucha") ? "excelente escucha activa." : "buena disposición inicial.");
      }
      
      let improvement = "Regular la respiración en frases largas.";
      if (text.includes("cansa") || text.includes("respirar") || text.includes("mejorar") || text.includes("apoyo") || text.includes("soporte")) {
        improvement = "Sostener el apoyo de aire al final de las frases y mejorar la dosificación respiratoria.";
      }
      
      let nextStep = "Ejercicios de siseo y escalas.";
      if (text.includes("siseo") || text.includes("ejercicio") || text.includes("practica") || text.includes("práctica")) {
        nextStep = "Práctica autónoma de siseo controlado (10s de emisión sostenida, tempo=80).";
      }
      
      let family = "Progreso regular, requiere constancia.";
      if (text.includes("madre") || text.includes("padres") || text.includes("casa") || text.includes("familia")) {
        family = "Se sugiere dialogar con el alumno para incentivar la práctica corta y constante en el ámbito familiar.";
      }
      
      setStrengthInput(strength);
      setImprovementInput(improvement);
      setNextStepInput(nextStep);
      setFamilyNoteInput(family);
      
      setIsGradeListening(false);
      setGradeVoiceNotice("✓ Comentario estructurado con éxito por el Profesor Copilot.");
    }, 800);
  };

  const handleSubmitGrade = (e: FormEvent) => {
    e.preventDefault();
    const parsedGrade = parseFloat(gradeInput);
    if (isNaN(parsedGrade) || parsedGrade < 1 || parsedGrade > 10 || !selectedStudentId) return;
    setGradeReviewOpen(true);
  };

  const handleConfirmGrade = () => {
    const parsedGrade = parseFloat(gradeInput);
    if (isNaN(parsedGrade) || parsedGrade < 1 || parsedGrade > 10 || !selectedStudentId) return;

    // Save grade details
    addGrade(selectedStudentId, `Seguimiento pedagógico · ${selectedSkill}`, parsedGrade, structuredPedagogicalComment);
    // Update skill score
    updateStudentSkill(selectedStudentId, selectedSkill, Math.floor(parsedGrade));

    setShowSuccess(true);
    setGradeReviewOpen(false);
    setCommentInput("");
    setStrengthInput("");
    setImprovementInput("");
    setNextStepInput("");
    setFamilyNoteInput("");
    setGradeVoiceNotice("");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (activeRole === "alumno") {
    const student = students.find(s => s.email.toLowerCase() === email.toLowerCase())
      ?? students.find(s => s.id === "s1")
      ?? students[0];

    const myGrades = student ? student.grades.map(g => {
      const isCanto = g.course.toLowerCase().includes("vocal") || g.course.toLowerCase().includes("canto");
      const isDanza = g.course.toLowerCase().includes("danza") || g.course.toLowerCase().includes("ritmo");
      
      const subject = isCanto ? "Canto" : isDanza ? "Danza" : "Interpretación";
      const skill = isCanto ? "Afinación y técnica vocal" : isDanza ? "Expresión corporal y ritmo" : "Presencia escénica";

      // Deterministic trend based on student ID to make it look realistic
      const lastChar = student.id.slice(-1);
      const isEven = !isNaN(parseInt(lastChar)) && parseInt(lastChar) % 2 === 0;
      const trend = isEven ? "+0.3" : "=";

      return {
        subject,
        skill,
        grade: g.grade,
        trend,
        comment: g.comments,
      };
    }) : [];

    const mySchedule = [
      { date: getRelativeDateString(1), time: "17:00h", subject: "Canto 1ºA", room: "Aula 3", teacher: "María López" },
      { date: getRelativeDateString(3), time: "18:30h", subject: "Danza Contemporánea", room: "Sala Grande", teacher: "Carlos Vega" },
      { date: getRelativeDateString(4), time: "17:00h", subject: "Interpretación", room: "Aula 1", teacher: "Ana Ruiz" },
      { date: getRelativeDateString(6), time: "12:00h", subject: "Ensayo General — Auditorio", room: "Auditorio JANA", teacher: "Todos los docentes" },
    ];

    return (
      <div className="dashboard-canvas space-y-5">
        {/* Header */}
        <div className="rounded-xl border border-border bg-surface/90 px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mi Expediente · Trimestre 2</p>
            <h2 className="text-xl font-black">Mi Aula Personal</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Vista de sólo lectura de tus calificaciones, observaciones y próximas clases</p>
          </div>
          <span className="rounded-lg border border-border bg-black/20 px-3 py-2 text-xs font-bold text-muted-foreground shrink-0">
            {student?.name} · {activeSede}
          </span>
        </div>

        {/* Grades */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Mis Notas - Trimestre 2</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {myGrades.map((g, idx) => (
              <Card key={idx} className="rounded-xl border-border bg-surface/90 flex flex-col justify-between">
                <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-sm">{g.subject}</p>
                        <p className="text-[10px] text-muted-foreground">{g.skill}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-black text-foreground">{g.grade}</p>
                        <p className={`text-[10px] font-bold ${g.trend.startsWith("+") ? "text-success" : "text-muted-foreground"}`}>{g.trend} vs T1</p>
                      </div>
                    </div>

                    {/* Grade bar with Dynamic Colors based on Thresholds & ARIA accessibility */}
                    <div 
                      className="h-1.5 rounded-full bg-border overflow-hidden"
                      role="progressbar"
                      aria-valuenow={g.grade}
                      aria-valuemin={0}
                      aria-valuemax={10}
                      aria-label={`Calificación en ${g.subject}: ${g.grade} sobre 10`}
                    >
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          g.grade >= 8 ? "bg-success" : g.grade >= 6 ? "bg-warning" : "bg-error"
                        )} 
                        style={{ width: `${g.grade * 10}%` }} 
                      />
                    </div>
                  </div>

                  {/* Feedback comments: structured or legacy plain-text */}
                  <div className="mt-3 text-xs leading-relaxed text-foreground-muted">
                    {g.comment.includes("\n") ? (
                      <div className="grid gap-1">
                        {g.comment.split("\n").map((line, lIdx) => {
                          const [label, ...rest] = line.split(":");
                          if (!label || rest.length === 0) return null;
                          return (
                            <div key={lIdx} className="rounded border border-border/40 bg-black/10 px-2.5 py-1.5">
                              <span className="block text-[8px] font-black uppercase tracking-wider text-muted-foreground">{label}</span>
                              <span className="block text-[10px] text-foreground-muted">{rest.join(":").trim()}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="italic font-medium">&quot;{g.comment}&quot;</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Mis Próximas Clases</p>
          <div className="rounded-xl border border-border bg-surface/90 divide-y divide-border overflow-hidden">
            {mySchedule.map((s, idx) => (
              <div key={idx} className="flex items-center gap-4 px-5 py-3 hover:bg-accent/20 transition">
                <div className="w-32 shrink-0">
                  <p className="text-xs font-bold text-foreground">{s.date}</p>
                  <p className="text-[10px] text-muted-foreground">{s.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{s.subject}</p>
                  <p className="text-[10px] text-muted-foreground">{s.teacher}</p>
                </div>
                <span className="shrink-0 rounded-md bg-surface-elevated px-2 py-1 text-[10px] font-semibold text-muted-foreground border border-border">
                  {s.room}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isTeacherOrDir = activeRole === "profesor" || activeRole === "direccion";

  return (
    <div className="dashboard-canvas grid items-start gap-6 lg:grid-cols-12">
      
      {/* LEFT SIDE: STUDENT LIST */}
      <Card className="flex min-h-[420px] flex-col rounded-xl border-border bg-surface/90 lg:sticky lg:top-5 lg:col-span-4 lg:h-[calc(100dvh-7.5rem)] lg:min-h-0">
        <CardHeader className="border-b border-border px-5 py-4">
          <CardTitle className="text-sm font-semibold flex items-center justify-between gap-4">
            <span>Alumnos ({students.length})</span>
            <span className="text-xs text-muted-foreground font-normal">{activeSede}</span>
          </CardTitle>
        </CardHeader>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl border text-xs flex justify-between items-center gap-4 transition",
                selectedStudentId === student.id
                  ? "bg-jana-primary/10 border-jana-primary"
                  : "bg-surface-elevated/50 border-border hover:border-muted-foreground/30"
              )}
            >
              <div className="min-w-0">
                <span className="font-bold block">{student.name}</span>
                <span className="text-muted-foreground block text-[10px] mt-1 truncate">{student.email}</span>
              </div>
              <span className="shrink-0 text-[10px] bg-accent px-2.5 py-1 rounded-full font-mono">
                {student.attendance}% Asis.
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* RIGHT SIDE: SELECTED STUDENT ACTIONS */}
      <div className="lg:col-span-8 space-y-6">
        {activeStudent ? (
          <div className="space-y-6">
            
            {/* STUDENT BRIEF & GRADES CARD */}
            <Card className="rounded-xl bg-surface/90 border-border">
              <CardHeader className="border-b border-border px-5 py-5 flex flex-row items-center gap-4">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-jana-primary/10 text-jana-primary-accessible font-bold">
                    {activeStudent.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <CardTitle className="text-xl font-bold">{activeStudent.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{activeStudent.email} · Sede principal: {activeStudent.sede}</p>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-xl border border-border text-center">
                    <p className="text-xs text-muted-foreground">Asistencia General</p>
                    <p className="mt-2 text-2xl font-bold text-talent">{activeStudent.attendance}%</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-xl border border-border text-center">
                    <p className="text-xs text-muted-foreground">Puntualidad habitual</p>
                    <p className="mt-2 text-2xl font-bold text-production">{activeStudent.punctuality ? "Sí" : "En revisión"}</p>
                  </div>
                </div>

                {/* GRADES HISTORY */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground">HISTORIAL DE EVALUACIONES</h4>
                  <div className="space-y-3">
                    {activeStudent.grades.map((g, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border bg-surface-elevated/40 text-xs flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <span className="font-bold text-foreground block">{g.course}</span>
                          {g.comments.includes("\n") ? (
                            <div className="mt-2 grid gap-1.5">
                              {g.comments.split("\n").map((line) => {
                                const [label, ...rest] = line.split(":");
                                return (
                                  <div key={line} className="rounded-md border border-border bg-black/15 px-2.5 py-2">
                                    <span className="block text-[9px] font-black uppercase tracking-wider text-muted-foreground">{label}</span>
                                    <span className="mt-0.5 block text-[11px] leading-relaxed text-foreground-muted">{rest.join(":").trim()}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <span className="text-muted-foreground block text-[11px] mt-1.5 leading-relaxed">{g.comments}</span>
                          )}
                        </div>
                        <span className="shrink-0 text-base font-bold bg-jana-primary/10 text-jana-primary-accessible px-3 py-1.5 rounded-lg">
                          {g.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GRADING FORM (Visible only to teachers/dir) */}
            {isTeacherOrDir ? (
              <>
              <Card className="overflow-hidden rounded-2xl border-border bg-surface/90">
                <CardHeader className="border-b border-border px-6 py-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-xl border border-jana-primary/25 bg-jana-primary/10">
                      <PlusCircle className="size-4 text-jana-primary" />
                      </span>
                      <div>
                        <CardTitle className="text-lg font-black">Nueva Calificación Artística</CardTitle>
                        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-muted-foreground">
                          Registra una evaluación clara, revisa el envío al RAG Aula y actualiza el perfil artístico del alumno sin saturar la ficha.
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn("h-11 rounded-xl border-border px-4 text-xs", isGradeListening && "border-jana-primary bg-jana-primary/10 text-jana-primary-accessible")}
                      onClick={handleStartGradeVoice}
                    >
                      {isGradeListening ? (
                        <div className="mr-2 flex items-end gap-0.5 h-3.5" aria-hidden="true">
                          <span className="audio-bar" />
                          <span className="audio-bar" />
                          <span className="audio-bar" />
                          <span className="audio-bar" />
                          <span className="audio-bar" />
                        </div>
                      ) : (
                        <Mic className="mr-2 size-4" aria-hidden="true" />
                      )}
                      {isGradeListening ? "Detener dictado" : "Dictar evaluación"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmitGrade} className="space-y-7">
                    <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div className="space-y-3">
                            <label className="text-xs font-semibold text-foreground-muted" htmlFor="select-skill">
                              Habilidad evaluada
                            </label>
                            <select
                              id="select-skill"
                              value={selectedSkill}
                              onChange={(e) => setSelectedSkill(e.target.value)}
                              className="h-13 w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground focus:border-jana-primary focus:outline-none"
                            >
                              {activeStudent.skills.map(s => (
                                <option key={s.name} value={s.name} className="bg-surface-elevated text-foreground">
                                  {s.name} ({s.category})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="space-y-3">
                            <label className="text-xs font-semibold text-foreground-muted" htmlFor="grade">
                              Nota numérica
                            </label>
                            <Input
                              id="grade"
                              type="number"
                              min="1"
                              max="10"
                              step="0.5"
                              value={gradeInput}
                              onChange={(e) => setGradeInput(e.target.value)}
                              className="h-13 rounded-xl text-sm"
                            />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <label className="text-xs font-semibold text-foreground-muted" htmlFor="comment">
                              Feedback pedagógico para RAG Aula
                            </label>
                            <span className="text-[10px] font-semibold text-muted-foreground">
                              {isGradeListening ? "Escuchando evaluación..." : "Dictado, demo o edición manual"}
                            </span>
                          </div>
                          <textarea
                            id="comment"
                            placeholder="Ej: Destaca en el soporte diafragmático. Debe cuidar la expresión corporal y preparar mejor las entradas del segundo acto..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="min-h-32 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-jana-primary"
                          />
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground-muted" htmlFor="strengths">
                              Fortalezas detectadas
                            </label>
                            <textarea
                              id="strengths"
                              value={strengthInput}
                              onChange={(e) => setStrengthInput(e.target.value)}
                              placeholder="Ej: afinación estable, escucha activa, buena presencia..."
                              className="min-h-24 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-jana-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground-muted" htmlFor="improvements">
                              Notas de mejora
                            </label>
                            <textarea
                              id="improvements"
                              value={improvementInput}
                              onChange={(e) => setImprovementInput(e.target.value)}
                              placeholder="Ej: reforzar entradas, cuidar foco, sostener energía..."
                              className="min-h-24 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-jana-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground-muted" htmlFor="next-step">
                              Próxima acción docente
                            </label>
                            <textarea
                              id="next-step"
                              value={nextStepInput}
                              onChange={(e) => setNextStepInput(e.target.value)}
                              placeholder="Ej: revisar ejercicio en próxima clase, enviar práctica..."
                              className="min-h-24 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-jana-primary"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-foreground-muted" htmlFor="family-note">
                              Comunicación familia/alumno
                            </label>
                            <textarea
                              id="family-note"
                              value={familyNoteInput}
                              onChange={(e) => setFamilyNoteInput(e.target.value)}
                              placeholder="Ej: compartir avance, pedir práctica suave en casa..."
                              className="min-h-24 w-full resize-y rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition placeholder:text-muted-foreground focus:border-jana-primary"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl text-xs"
                            onClick={handleDemoGradeDictation}
                          >
                            Usar dictado demo
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl text-xs bg-jana-primary/10 border-jana-primary/30 text-jana-primary-accessible hover:bg-jana-primary/20"
                            onClick={handleOptimizeFeedback}
                          >
                            <Brain className="mr-1.5 size-3.5" />
                            Optimizar con Profesor Copilot
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 rounded-xl text-xs"
                            onClick={() => {
                              setCommentInput("");
                              setStrengthInput("");
                              setImprovementInput("");
                              setNextStepInput("");
                              setFamilyNoteInput("");
                              setGradeVoiceNotice("");
                            }}
                          >
                            Limpiar todo
                          </Button>
                        </div>

                        {gradeVoiceNotice && (
                          <p className="rounded-xl border border-warning/25 bg-warning/10 p-3 text-xs leading-relaxed text-warning">
                            {gradeVoiceNotice}
                          </p>
                        )}
                      </div>

                      <aside className="rounded-xl border border-brain/25 bg-brain/10 p-4">
                        <div className="mb-4 flex items-center gap-2">
                          <Brain className="size-4 text-brain" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-brain">Lectura RAG Aula</p>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="rounded-lg border border-border/70 bg-black/15 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Destino</p>
                            <p className="mt-1 font-semibold text-foreground">{activeStudent.name}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-lg border border-border/70 bg-black/15 p-3">
                              <p className="text-[10px] text-muted-foreground">Habilidad</p>
                              <p className="mt-1 font-black text-foreground">{selectedSkill}</p>
                            </div>
                            <div className="rounded-lg border border-border/70 bg-black/15 p-3">
                              <p className="text-[10px] text-muted-foreground">Nota</p>
                              <p className="mt-1 font-mono text-lg font-black text-jana-primary-accessible">{gradeInput || "—"}</p>
                            </div>
                          </div>
                          <div className="rounded-lg border border-border/70 bg-black/15 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Interpretación</p>
                            <p className="mt-2 leading-relaxed text-foreground-muted">
                              {commentInput || strengthInput || improvementInput || nextStepInput
                                ? "El RAG guardará observación, fortalezas, notas de mejora y próxima acción en el historial pedagógico del alumno."
                                : "Aún no hay seguimiento pedagógico suficiente. Dicta, usa el modo demo o completa los campos antes de revisar."}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              ["Fortalezas", strengthInput],
                              ["Mejoras", improvementInput],
                              ["Acción", nextStepInput],
                              ["Familia", familyNoteInput],
                            ].map(([label, value]) => (
                              <div key={label} className="rounded-lg border border-border/70 bg-black/15 p-2">
                                <p className="text-[10px] text-muted-foreground">{label}</p>
                                <p className={cn("mt-1 text-[10px] font-bold", value ? "text-success" : "text-warning")}>
                                  {value ? "listo" : "pendiente"}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </aside>
                    </div>

                    <Button type="submit" className="h-13 w-full rounded-xl bg-jana-primary font-semibold hover:bg-jana-primary-hover">
                      Revisar envío al RAG Aula
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground italic mt-2">
                      *Nota: Propuesta estructurada por IA, sujeta a validación y criterio exclusivo del docente.*
                    </p>

                    <AnimatePresence>
                      {showSuccess && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-success bg-success/15 border border-success/30 rounded-xl p-3 text-center"
                        >
                          ✓ Nota guardada y perfiles de Talent Graph recalculados.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </form>
                </CardContent>
              </Card>
              <Dialog open={gradeReviewOpen} onOpenChange={setGradeReviewOpen}>
                <DialogContent className="max-w-2xl rounded-2xl border-border bg-surface">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-black">
                      <ShieldCheck className="size-5 text-success" />
                      Verificar envío al RAG Aula
                    </DialogTitle>
                    <DialogDescription className="text-xs leading-relaxed text-foreground-muted">
                      Confirma que la evaluación es correcta antes de actualizar Aula y Talent Graph. Esta revisión evita registrar notas o feedback docente con errores de dictado.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-black/15 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Alumno</p>
                        <p className="mt-2 text-sm font-black text-foreground">{activeStudent.name}</p>
                        <p className="mt-1 text-xs text-foreground-muted">{activeStudent.sede}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-black/15 p-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Calificación</p>
                        <p className="mt-2 text-sm font-black text-foreground">{selectedSkill} · {gradeInput}/10</p>
                        <p className="mt-1 text-xs text-foreground-muted">Mapeo Técnico en vivo</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-black/15 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Feedback que recibirá el RAG</p>
                      <div className="mt-3 grid gap-2">
                        {structuredPedagogicalComment.split("\n").map((line) => {
                          const [label, ...rest] = line.split(":");
                          return (
                            <div key={line} className="rounded-lg border border-border bg-black/15 p-3">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
                              <p className="mt-1 text-sm leading-relaxed text-foreground">{rest.join(":").trim()}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-warning/25 bg-warning/10 p-3 text-xs leading-relaxed text-warning">
                      Revisa especialmente nombres, nota numérica y tono pedagógico antes de confirmar.
                    </div>
                  </div>

                  <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 rounded-xl"
                      onClick={() => setGradeReviewOpen(false)}
                    >
                      Corregir
                    </Button>
                    <Button
                      type="button"
                      className="h-11 rounded-xl bg-jana-primary px-5 font-semibold hover:bg-jana-primary-hover"
                      onClick={handleConfirmGrade}
                    >
                      Confirmar y guardar
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              </>
            ) : (
              <div className="p-5 rounded-xl bg-surface/30 border border-dashed border-border text-center text-xs text-muted-foreground">
                <Lock className="size-4 mx-auto mb-2" />
                Como Alumno no puedes calificar. Accede con rol Profesorado o Dirección para habilitar el formulario.
              </div>
            )}

          </div>
        ) : (
          <div className="text-center p-12 border border-dashed border-border rounded-lg bg-surface/30">
            <GraduationCap className="size-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-semibold">Selecciona un alumno para ver su rendimiento y calificar</p>
          </div>
        )}
      </div>

    </div>
  );
}

/* 3. BACKSTAGE TALENT GRAPH (Scalable Talent Map & Accessible Table) */
/* 4. BACKSTAGE PANEL (CRM Finance Visualizer & Production Details) */

