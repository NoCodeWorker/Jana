"use client";

import { useState } from "react";
import { BookOpen, Brain, CalendarDays, Clapperboard, ClipboardCheck, Target, UserCheck, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { ContentArticle, Student, Teacher } from "@/components/mock-data-context";
import { getPrimaryDiscipline, getStudentAvgSkill } from "@/components/backstage/talent-graph-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TeacherCockpitView({
  activeSede,
  students,
  teachers,
  articles,
  onNavigate,
}: {
  activeSede: string;
  students: Student[];
  teachers: Teacher[];
  articles: ContentArticle[];
  onNavigate: (tab: string) => void;
}) {
  interface ClassPreparation {
    title: string;
    time: string;
    room: string;
    riskStudents: { name: string; issue: string }[];
    stagnation: string;
    ragWarmup: string;
    ragExercise: string;
    ragEvaluation: string;
  }

  const [selectedClassIdx, setSelectedClassIdx] = useState(0);
  const [isRAGLoading, setIsRAGLoading] = useState(false);
  const [ragData, setRagData] = useState<Record<number, ClassPreparation>>({});

  const classDetails = [
    {
      title: "Canto 1ºA · Técnica vocal",
      time: "16:00",
      room: "Aula Coral",
      riskStudents: [
        { name: "Sofía García", issue: "Asistencia 85% (límite crítico)" },
        { name: "Mateo Fernández", issue: "Dificultad en Afinación (media 6.2)" }
      ],
      stagnation: "El 40% del grupo muestra fatiga al final del registro medio. Habilidad crítica: Afinación y Soporte.",
      ragWarmup: "El Siseo Escalonado - exhalar aire con sonido 'S' en pulsos de negra (tempo=80) durante 8 tiempos para activar diafragma.",
      ragExercise: "Espejos de Afinación (Ref: M-Vocal 3.1) - cantar por parejas sosteniendo nota afinada sintiendo la resonancia craneal y apoyo abdominal.",
      ragEvaluation: "Observar si la laringe sube excesivamente al ascender de tono."
    },
    {
      title: "Teatro musical · Ensayo de escena",
      time: "18:00",
      room: "Sala Negra",
      riskStudents: [
        { name: "Laura Gómez", issue: "Asistencia 82% (por debajo de la política de permanencia)" },
        { name: "Diego Martínez", issue: "Presencia escénica tímida, evita proyectar" }
      ],
      stagnation: "Alumnos aceleran el tempo del texto hablado justo antes de la entrada musical, perdiendo foco escénico.",
      ragWarmup: "La Congelación Expresiva - recitar improvisando y congelarse al aplauso del profesor manteniendo mirada firme.",
      ragExercise: "El Silencio de la Entrada (Ref: M-Teatro 5.4) - pausar la pista musical en el compás previo; el alumno hace un paso dramático adelante antes de cantar.",
      ragEvaluation: "Verificar la transición ocular y el anclaje físico durante el paso a la música."
    },
    {
      title: "Tutoría de seguimiento",
      time: "19:30",
      room: "Cabina docente",
      riskStudents: [
        { name: "Alumnos prioritarios", issue: "3 alumnos con faltas repetitivas o bajo progreso en Talent Graph" }
      ],
      stagnation: "Desconexión con la práctica autónoma diaria recomendada fuera de la sede.",
      ragWarmup: "Chequeo de Bienestar - 5 minutos de conversación informal sobre el equilibrio de estudios y carga escolar externa.",
      ragExercise: "La Rueda Artística JANA (Ref: M-Tutoría 1.2) - auto-evaluación rápida en 5 ejes para definir 1 micro-objetivo semanal.",
      ragEvaluation: "Identificar factores de sobrecarga de deberes externos o falta de espacio acústico en su hogar."
    }
  ];

  const handleQueryRAG = (idx: number) => {
    setIsRAGLoading(true);
    setTimeout(() => {
      setRagData((prev) => ({
        ...prev,
        [idx]: classDetails[idx],
      }));
      setIsRAGLoading(false);
    }, 750);
  };

  const sedeTeachers = teachers.filter((teacher) => teacher.sede === activeSede);
  const leadTeacher = sedeTeachers.find((teacher) => teacher.name === "Elena Ruiz") ?? sedeTeachers[0] ?? teachers[0];

  const assignedStudents = students
    .map((student) => ({ student, avgSkill: getStudentAvgSkill(student), discipline: getPrimaryDiscipline(student) }))
    .sort((a, b) => a.student.name.localeCompare(b.student.name, "es"));
  const riskStudents = assignedStudents
    .filter(({ student, avgSkill }) => student.attendance < 88 || avgSkill < 6.7)
    .sort((a, b) => a.student.attendance - b.student.attendance || a.avgSkill - b.avgSkill);
  const highProgressStudents = assignedStudents
    .filter(({ avgSkill, student }) => avgSkill >= 8 || student.attendance >= 96)
    .sort((a, b) => b.avgSkill - a.avgSkill)
    .slice(0, 4);
  const pendingEvaluations = assignedStudents.filter(({ student }) => student.grades.length < 3 || student.attendance < 90);
  const avgAttendance = assignedStudents.length
    ? assignedStudents.reduce((total, item) => total + item.student.attendance, 0) / assignedStudents.length
    : 0;
  const avgSkill = assignedStudents.length
    ? assignedStudents.reduce((total, item) => total + item.avgSkill, 0) / assignedStudents.length
    : 0;
  const reviewedArticles = articles.filter((article) => article.author === leadTeacher?.name || article.sede === activeSede);
  const articlesToReview = reviewedArticles.filter((article) => article.status !== "publicado");
  const publishedByTeacher = reviewedArticles.filter((article) => article.status === "publicado");
  const classReadiness = Math.max(
    62,
    Math.min(98, Math.round(avgAttendance * 0.35 + avgSkill * 6 - riskStudents.length * 2 + publishedByTeacher.length * 2))
  );

  const todayClasses = [
    {
      time: "16:00",
      title: "Canto 1ºA · Técnica vocal",
      room: "Aula Coral",
      objective: "Respiración costo-diafragmática y afinación en registro medio.",
      students: Math.min(12, assignedStudents.length),
      status: "Preparar feedback",
    },
    {
      time: "18:00",
      title: "Teatro musical · Ensayo de escena",
      room: "Sala Negra",
      objective: "Transición entre texto hablado, entrada musical y presencia escénica.",
      students: Math.min(14, assignedStudents.length + 2),
      status: "Pasar asistencia",
    },
    {
      time: "19:30",
      title: "Tutoría de seguimiento",
      room: "Cabina docente",
      objective: "Revisión individual de alumnos con asistencia irregular.",
      students: riskStudents.length,
      status: "Prioritario",
    },
  ];

  const rubricAreas = [
    { label: "Técnica vocal", value: 82, color: "bg-jana-primary" },
    { label: "Presencia escénica", value: 74, color: "bg-talent" },
    { label: "Trabajo en grupo", value: 68, color: "bg-brain" },
    { label: "Autonomía de práctica", value: 61, color: "bg-production" },
  ];

  const quickActions = [
    { label: "Pasar asistencia", detail: "Abrir sesión de hoy", icon: UserCheck, target: "Aula" },
    { label: "Evaluar alumno", detail: "Rúbrica y feedback", icon: ClipboardCheck, target: "Aula" },
    { label: "Preparar clase con Brain", detail: "Objetivos y ejercicios", icon: Brain, target: "Brain" },
    { label: "Crear recurso", detail: "Artículo o guía IA", icon: BookOpen, target: "Content" },
    { label: "Revisar talento", detail: "Mapa por disciplina", icon: Target, target: "Talent Graph" },
    { label: "Clip de ensayo", detail: "Material para familias", icon: Clapperboard, target: "Studio" },
  ];

  return (
    <div className="dashboard-canvas space-y-5">
      <section className="overflow-hidden rounded-2xl border border-border bg-surface/92">
        <div className="grid gap-6 p-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-talent">Cockpit de Profesorado</p>
                <h2 className="font-heading text-3xl font-black leading-tight md:text-4xl">
                  Jornada docente de {leadTeacher?.name ?? "Profesorado JANA"}
                </h2>
                <p className="max-w-2xl text-sm leading-relaxed text-foreground-muted">
                  Una vista de trabajo para preparar clases, detectar alumnos que necesitan seguimiento, evaluar con criterio y publicar recursos educativos.
                </p>
              </div>
              <div className="rounded-xl border border-talent/25 bg-talent/10 p-4 text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preparación de aula</p>
                <p className="font-mono text-5xl font-black text-talent">{classReadiness}</p>
                <p className="text-[10px] text-foreground-muted">sobre 100 · {activeSede}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {[
                { label: "Mis alumnos", value: assignedStudents.length.toString(), detail: `${riskStudents.length} requieren seguimiento`, tone: "text-foreground" },
                { label: "Asistencia media", value: `${avgAttendance.toFixed(0)}%`, detail: "últimas sesiones", tone: "text-brain" },
                { label: "Nivel artístico", value: avgSkill.toFixed(1), detail: "media por habilidades", tone: "text-talent" },
                { label: "Evaluaciones", value: pendingEvaluations.length.toString(), detail: "pendientes o incompletas", tone: "text-warning" },
              ].map((item) => (
                <Card key={item.label} className="rounded-xl border-border bg-black/18">
                  <CardContent className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                    <p className={cn("mt-3 font-heading text-3xl font-black", item.tone)}>{item.value}</p>
                    <p className="mt-1 text-[11px] text-foreground-muted">{item.detail}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Widget de Resumen Pre-Clase & Copiloto RAG */}
            <Card className="rounded-xl border border-border bg-black/30">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-3">
                  <div>
                    <h3 className="text-sm font-black flex items-center gap-2">
                      <Sparkles className="size-4 text-jana-primary animate-pulse" />
                      Preparación Pedagógica Pre-Clase (Profesor Copilot)
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Diagnóstico del grupo y propuestas metodológicas basadas en RAG
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {classDetails.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedClassIdx(i)}
                        className={cn(
                          "px-2.5 py-1 text-[10px] font-black rounded-lg border transition",
                          selectedClassIdx === i
                            ? "bg-jana-primary/10 border-jana-primary text-jana-primary-accessible"
                            : "bg-surface-elevated/40 border-border text-muted-foreground hover:bg-surface-elevated/60"
                        )}
                      >
                        {c.time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-talent">Clase activa</p>
                    <p className="font-bold text-foreground mt-1">{classDetails[selectedClassIdx].title} ({classDetails[selectedClassIdx].room})</p>
                  </div>

                  {/* Resumen de Grupo Académico */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border bg-surface/50 p-3 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-warning flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Alumnos con Alertas (RAG)
                      </p>
                      <div className="space-y-1">
                        {classDetails[selectedClassIdx].riskStudents.map((rs, i) => (
                          <div key={i} className="text-[11px] leading-relaxed">
                            <span className="font-bold text-foreground">{rs.name}</span>:{" "}
                            <span className="text-foreground-muted">{rs.issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-surface/50 p-3 space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-brain">
                        Estancamiento Transversal
                      </p>
                      <p className="text-[11px] leading-relaxed text-foreground-muted">
                        {classDetails[selectedClassIdx].stagnation}
                      </p>
                    </div>
                  </div>

                  {/* Botón de Preparación RAG */}
                  <div className="border-t border-border/40 pt-4 space-y-3">
                    {!ragData[selectedClassIdx] ? (
                      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-lg bg-surface/30">
                        <p className="text-[11px] text-muted-foreground text-center mb-3">
                          ¿Quieres generar la sugerencia metodológica y calentamientos recomendados por el manual JANA para esta sesión?
                        </p>
                        <Button
                          type="button"
                          disabled={isRAGLoading}
                          onClick={() => handleQueryRAG(selectedClassIdx)}
                          className="h-8 rounded-lg text-[11px] bg-jana-primary hover:bg-jana-primary-hover flex items-center gap-1.5"
                        >
                          {isRAGLoading ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              Buscando en Manual JANA RAG...
                            </>
                          ) : (
                            <>
                              <Brain className="size-3.5" />
                              Consultar Profesor Copilot (RAG)
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-brain/25 bg-brain/5 p-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-border/30 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-brain flex items-center gap-1">
                            <Sparkles className="size-3 text-jana-primary" />
                            Propuesta Metodológica (RAG)
                          </span>
                          <span className="text-[9px] font-mono text-muted-foreground">Manual JANA V4.2</span>
                        </div>
                        <div className="space-y-2.5">
                          <div>
                            <span className="font-bold text-foreground text-[11px] block">Calentamiento Recomendado (5-10m):</span>
                            <span className="text-foreground-muted leading-relaxed text-[11px]">{ragData[selectedClassIdx].ragWarmup}</span>
                          </div>
                          <div>
                            <span className="font-bold text-foreground text-[11px] block">Ejercicio de Aula Recomendado:</span>
                            <span className="text-foreground-muted leading-relaxed text-[11px]">{ragData[selectedClassIdx].ragExercise}</span>
                          </div>
                          <div>
                            <span className="font-bold text-foreground text-[11px] block">Criterio Crítico de Evaluación:</span>
                            <span className="text-foreground-muted leading-relaxed text-[11px]">{ragData[selectedClassIdx].ragEvaluation}</span>
                          </div>
                        </div>
                        <div className="border-t border-border/20 pt-2 flex items-center justify-between">
                          <p className="text-[9px] text-muted-foreground italic">
                            *Propuesta de preparación generada por IA mediante RAG sobre el Manual Metodológico JANA. Sujeta a validación docente.*
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleQueryRAG(selectedClassIdx)}
                            className="h-6 px-2 text-[9px] text-jana-primary hover:text-jana-primary hover:bg-jana-primary/10"
                          >
                            Recargar RAG
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border-border bg-black/20">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-black">
                <CalendarDays className="size-5 text-jana-primary" />
                Clases de hoy
              </CardTitle>
              <p className="text-xs text-foreground-muted">Objetivo pedagógico, aula y siguiente acción de cada sesión.</p>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {todayClasses.map((item) => (
                <div key={`${item.time}-${item.title}`} className="rounded-xl border border-border bg-surface/55 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm font-black text-jana-primary-accessible">{item.time}</p>
                      <h3 className="mt-1 text-sm font-black text-foreground">{item.title}</h3>
                      <p className="mt-1 text-[11px] text-muted-foreground">{item.room} · {item.students} alumnos</p>
                    </div>
                    <span className={cn(
                      "rounded-md border px-2 py-1 text-[10px] font-black",
                      item.status === "Prioritario" ? "border-warning/25 bg-warning/10 text-warning" : "border-talent/25 bg-talent/10 text-talent"
                    )}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-foreground-muted">{item.objective}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Alumnos que necesitan intervención</CardTitle>
            <p className="text-xs text-foreground-muted">Priorizados por asistencia, nivel medio y necesidad de feedback individual.</p>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {riskStudents.slice(0, 6).map(({ student, avgSkill, discipline }) => (
              <div key={student.id} className="rounded-xl border border-border bg-black/15 p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_120px_120px] md:items-center">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-foreground">{student.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{discipline} · {student.email}</p>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-black text-brain">{student.attendance}%</p>
                    <p className="text-[10px] text-muted-foreground">asistencia</p>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-black text-talent">{avgSkill.toFixed(1)}</p>
                    <p className="text-[10px] text-muted-foreground">nivel medio</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="h-8 rounded-lg text-[11px]" onClick={() => onNavigate("Aula")}>
                    Abrir ficha
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 rounded-lg text-[11px]" onClick={() => onNavigate("Brain")}>
                    Preparar intervención
                  </Button>
                </div>
              </div>
            ))}
            {riskStudents.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No hay alumnos en seguimiento prioritario para esta sede.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-base font-black">Acciones rápidas</CardTitle>
              <p className="text-xs text-foreground-muted">Atajos reales para el trabajo docente diario.</p>
            </CardHeader>
            <CardContent className="grid gap-2 p-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => onNavigate(action.target)}
                  className="flex items-center gap-3 rounded-xl border border-border bg-black/15 p-3 text-left transition hover:border-jana-primary/35 hover:bg-surface-elevated/45"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-jana-primary/10 text-jana-primary-accessible">
                    <action.icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-black text-foreground">{action.label}</span>
                    <span className="block text-[10px] text-muted-foreground">{action.detail}</span>
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="border-b border-border pb-3">
              <CardTitle className="text-base font-black">Cobertura pedagógica</CardTitle>
              <p className="text-xs text-foreground-muted">Áreas trabajadas durante el ciclo actual.</p>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {rubricAreas.map((area) => (
                <div key={area.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{area.label}</span>
                    <span className="font-mono font-black text-foreground-muted">{area.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-elevated">
                    <div className={cn("h-full rounded-full", area.color)} style={{ width: `${area.value}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Progreso destacable</CardTitle>
            <p className="text-xs text-foreground-muted">Alumnos que conviene reforzar con reconocimiento o reto adicional.</p>
          </CardHeader>
          <CardContent className="space-y-2 p-4">
            {highProgressStudents.map(({ student, avgSkill, discipline }) => (
              <div key={student.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-black/15 px-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold text-foreground">{student.name}</span>
                  <span className="text-[10px] text-muted-foreground">{discipline} · {student.attendance}% asistencia</span>
                </span>
                <span className="font-mono text-sm font-black text-talent">{avgSkill.toFixed(1)}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Contenido docente</CardTitle>
            <p className="text-xs text-foreground-muted">Recursos preparados con IA para alumnos y familias.</p>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-lg border border-border bg-black/15 p-3">
                <p className="font-mono text-2xl font-black text-warning">{articlesToReview.length}</p>
                <p className="text-[10px] text-muted-foreground">por revisar</p>
              </div>
              <div className="rounded-lg border border-border bg-black/15 p-3">
                <p className="font-mono text-2xl font-black text-success">{publishedByTeacher.length}</p>
                <p className="text-[10px] text-muted-foreground">publicados</p>
              </div>
            </div>
            <Button className="h-10 w-full rounded-xl bg-jana-primary font-semibold hover:bg-jana-primary-hover" onClick={() => onNavigate("Content")}>
              Abrir CMS docente
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Siguiente mejor acción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <div className="rounded-xl border border-talent/25 bg-talent/10 p-4">
              <p className="text-sm font-black text-foreground">Preparar feedback individual antes de la clase de 18:00</p>
              <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
                Hay {riskStudents.length} alumnos con señales de seguimiento. Brain puede generar una pauta breve por alumno y Aula puede registrar la observación.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-10 rounded-xl text-xs" onClick={() => onNavigate("Brain")}>Abrir Brain</Button>
              <Button variant="outline" className="h-10 rounded-xl text-xs" onClick={() => onNavigate("Aula")}>Abrir Aula</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

/* 1. BACKSTAGE BRAIN (RAG Search Simulator) */
/* 2. BACKSTAGE AULA (Class details & student grading) */

