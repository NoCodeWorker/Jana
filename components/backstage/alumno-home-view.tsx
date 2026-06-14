"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CalendarCheck,
  ArrowRight,
  Star,
  BookMarked,
  Newspaper,
  GraduationCap,
  Brain,
  TrendingUp,
} from "lucide-react";
import { ContentArticle, Student } from "@/components/mock-data-context";
import { Button } from "@/components/ui/button";

export function AlumnoHomeView({
  students,
  activeSede,
  onNavigate,
  contentArticles,
  contentNotifications,
  email,
}: {
  students: Student[];
  activeSede: string;
  onNavigate: (tab: string) => void;
  contentArticles: ContentArticle[];
  contentNotifications: { id: string; articleId: string; title: string; message: string; read: boolean }[];
  email: string;
}) {
  const [studentQuestion, setStudentQuestion] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [isStudentThinking, setIsStudentThinking] = useState(false);

  // Find the active alumno matching the login session email
  const student = students.find(s => s.email.toLowerCase() === email.toLowerCase())
    ?? students.find(s => s.id === "s1")
    ?? students[0];

  if (!student) {
    return (
      <div className="flex items-center justify-center p-16 text-muted-foreground text-sm">
        No hay datos de alumno disponibles para esta sede.
      </div>
    );
  }

  // Relative next-class calculation (mock: always show the next upcoming day)
  const schedule = [
    { day: 1, time: "17:00", subject: "Canto 1ºA", room: "Aula 3", teacher: "María López" },
    { day: 3, time: "18:30", subject: "Danza Contemporánea", room: "Sala Grande", teacher: "Carlos Vega" },
    { day: 4, time: "17:00", subject: "Interpretación", room: "Aula 1", teacher: "Ana Ruiz" },
    { day: 6, time: "12:00", subject: "Ensayo General", room: "Auditorio", teacher: "Todos los docentes" },
  ];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const now = new Date();
  const currentDay = now.getDay();
  const nextClass = schedule.find(s => s.day > currentDay) ?? schedule[0];
  const daysUntil = nextClass.day > currentDay ? nextClass.day - currentDay : 7 - currentDay + nextClass.day;
  const nextClassLabel = daysUntil === 0 ? "Hoy" : daysUntil === 1 ? "Mañana" : `En ${daysUntil} días`;

  // Skills sorted: top 3 strongest, bottom for improvement
  const sortedSkills = [...student.skills].sort((a, b) => b.level - a.level);
  const topSkills = sortedSkills.slice(0, 3);
  const weakSkill = sortedSkills[sortedSkills.length - 1];

  // Progress score
  const avgSkill = student.skills.length
    ? student.skills.reduce((sum, s) => sum + s.level, 0) / student.skills.length
    : 0;
  const progressScore = Math.round(Math.min(100, avgSkill * 7 + student.attendance * 0.18 + (student.punctuality ? 5 : 0)));
  const progressColor = progressScore >= 82 ? "text-success" : progressScore >= 70 ? "text-warning" : "text-error";

  // Latest feedback
  const latestGrade = student.grades[student.grades.length - 1];

  // Unread notifications
  const unreadCount = contentNotifications.filter(n => !n.read).length;
  const newArticles = contentArticles.filter(a => a.status === "publicado").slice(0, 2);

  const attendanceOk = student.attendance >= 85;

  const handleStudentQuery = () => {
    if (!studentQuestion.trim()) return;
    setIsStudentThinking(true);
    setTimeout(() => {
      setIsStudentThinking(false);
      const q = studentQuestion.toLowerCase();
      if (q.includes("debilidad") || q.includes("mejorar") || q.includes(weakSkill?.name.toLowerCase() ?? "")) {
        setStudentAnswer(`Teniendo en cuenta que tu principal foco de mejora es "${weakSkill?.name ?? 'Técnica vocal'}" (nivel ${weakSkill?.level ?? 4}/10), te sugiero realizar 3 repeticiones diarias de ejercicios de respiración costo-diafragmática y practicar la regularidad del apoyo. El RAG de JANA aconseja no forzar el volumen y concentrarse en la colocación de la voz.`);
      } else if (q.includes("canto") || q.includes("vocal") || q.includes("afinación")) {
        setStudentAnswer("Para tu nivel en Canto, se recomienda iniciar las sesiones con 5 minutos de trinos labiales y sirenas (SOVTE) utilizando pajitas para evitar fatiga. Además, revisa la Guía de Técnica Vocal publicada en tu panel de recursos para practicar las vocalizaciones del segundo acto.");
      } else if (q.includes("objetivos") || q.includes("meta")) {
        setStudentAnswer(`Tus objetivos actuales aprobados por el profesorado son: 1) Consolidar el vibrato en agudos para Canto, 2) Mejorar el control postural de hombros en Danza, y 3) Practicar la transición entre texto y canto en la escena 3.`);
      } else {
        setStudentAnswer(`Hola ${student.name.split(" ")[0]}. En base a tu expediente (asistencia del ${student.attendance}% y promedio general de ${avgSkill.toFixed(1)}/10), te sugiero revisar periódicamente las notas metodológicas en el Aula y practicar las dinámicas corporales asignadas para esta semana.`);
      }
    }, 1000);
  };

  const selectStudentSuggested = (q: string) => {
    setStudentQuestion(q);
    setIsStudentThinking(true);
    setTimeout(() => {
      setIsStudentThinking(false);
      if (q.includes("debilidad")) {
        setStudentAnswer(`Teniendo en cuenta que tu principal foco de mejora es "${weakSkill?.name ?? 'Técnica vocal'}" (nivel ${weakSkill?.level ?? 4}/10), te sugiero realizar 3 repeticiones diarias de ejercicios de respiración costo-diafragmática y practicar la regularidad del apoyo. El RAG de JANA aconseja no forzar el volumen y concentrarse en la colocación de la voz.`);
      } else if (q.includes("canto")) {
        setStudentAnswer("Para tu nivel en Canto, se recomienda iniciar las sesiones con 5 minutos de trinos labiales y sirenas (SOVTE) utilizando pajitas para evitar fatiga. Además, revisa la Guía de Técnica Vocal publicada en tu panel de recursos para practicar las vocalizaciones del segundo acto.");
      } else {
        setStudentAnswer(`Tus objetivos actuales aprobados por el profesorado son: 1) Consolidar el vibrato en agudos para Canto, 2) Mejorar el control postural de hombros en Danza, y 3) Practicar la transición entre texto y canto en la escena 3.`);
      }
    }, 1000);
  };

  return (
    <div className="dashboard-canvas space-y-6">

      {/* ── Hero greeting ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-jana-primary/20 bg-surface/90 px-6 py-6 lg:px-8 lg:py-7 card-premium">
        <div className="absolute inset-0 opacity-25"
          style={{ background: "radial-gradient(ellipse 60% 80% at 0% 0%, #ec690c55, transparent 60%), radial-gradient(ellipse 50% 60% at 100% 100%, #7c5cff33, transparent 60%)" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="label-metric text-jana-primary-accessible">
              JANA OS · Backstage del Alumnado
            </p>
            <h1 className="mt-2 text-2xl font-black lg:text-3xl">
              Hola, {student.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-1 text-sm text-foreground-muted">
              {activeSede} · Trimestre 2 · {new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="card-kpi-glow rounded-xl border border-border bg-black/20 px-4 py-3 text-center min-w-[90px]">
              <p className={`text-2xl font-black font-mono ${progressColor}`}>{progressScore}%</p>
              <p className="label-metric text-muted-foreground mt-1">Progreso</p>
            </div>
            <div className={`card-kpi-glow rounded-xl border px-4 py-3 text-center min-w-[90px] ${attendanceOk ? "border-success/30 bg-success/10" : "border-error/30 bg-error/10"}`}>
              <p className={`text-2xl font-black font-mono ${attendanceOk ? "text-success" : "text-error"}`}>{student.attendance}%</p>
              <p className="label-metric text-muted-foreground mt-1">Asistencia</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Alert: low attendance ────────────────────────────────────────── */}
      {!attendanceOk && (
        <div className="flex items-start gap-3 rounded-xl border border-error/30 bg-error/8 px-5 py-4">
          <AlertTriangle className="size-5 shrink-0 text-error mt-0.5" />
          <div>
            <p className="text-sm font-bold text-error">Atención: asistencia por debajo del 85%</p>
            <p className="mt-1 text-xs text-foreground-muted">
              Tu asistencia actual es del {student.attendance}%. Para mantener el ritmo pedagógico recomendado, es importante recuperar horas antes del próximo trimestre.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">

        {/* ── Next class card ──────────────────────────────────────────────── */}
        <div
          className="col-span-1 rounded-2xl border border-jana-primary/30 bg-jana-primary/8 p-5 cursor-pointer hover:bg-jana-primary/12 transition group"
          onClick={() => onNavigate("Aula")}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === "Enter" && onNavigate("Aula")}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarCheck className="size-5 text-jana-primary-accessible" />
              <p className="label-metric text-jana-primary-accessible">Próxima clase</p>
            </div>
            <ArrowRight className="size-4 text-jana-primary-accessible opacity-0 group-hover:opacity-100 transition" />
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-foreground">{nextClass.subject}</p>
            <p className="mt-1 text-sm font-semibold text-foreground-muted">{dayNames[nextClass.day]} · {nextClass.time}h</p>
            <p className="text-xs text-foreground-muted">{nextClass.room} · {nextClass.teacher}</p>
          </div>
          <span className="mt-4 inline-block rounded-full bg-jana-primary/15 px-3 py-1 text-[10px] font-black text-jana-primary-accessible">
            {nextClassLabel}
          </span>
        </div>

        {/* ── Top skills ──────────────────────────────────────────────── */}
        <div className="col-span-1 card-premium p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-talent" />
              <p className="label-metric text-muted-foreground">Mis fortalezas</p>
            </div>
            <button onClick={() => onNavigate("Talent Graph")} className="text-[10px] font-bold text-jana-primary-accessible hover:underline">Ver todo →</button>
          </div>
          {/* Área 6: Animated skill bars */}
          <div className="space-y-3">
            {topSkills.map((skill, idx) => (
              <div key={skill.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-foreground">{skill.name}</span>
                  <span className="text-xs font-black text-talent">{skill.level}/10</span>
                </div>
                <div className="h-1.5 rounded-full bg-border/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-talent to-talent/70 skill-bar-fill"
                    style={{
                      "--skill-target": `${skill.level * 10}%`,
                      "--skill-delay": `${idx * 120}ms`,
                    } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
          {weakSkill && (
            <div className="rounded-lg border border-warning/25 bg-warning/8 px-3 py-2">
              <p className="text-[10px] font-bold text-warning">Foco de mejora: {weakSkill.name}</p>
              <p className="text-[10px] text-foreground-muted mt-0.5">Nivel actual {weakSkill.level}/10 · Trabaja en cada sesión</p>
            </div>
          )}
        </div>

        {/* ── Latest teacher feedback ──────────────────────────────────────── */}
        <div className="col-span-1 rounded-2xl border border-border bg-surface/90 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <BookMarked className="size-4 text-brain" />
            <p className="label-metric text-muted-foreground">Último feedback docente</p>
          </div>
          {latestGrade ? (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-foreground">{latestGrade.course}</p>
                  <p className="text-[10px] text-muted-foreground">Registro pedagógico</p>
                </div>
                <span className={`shrink-0 rounded-lg px-3 py-1.5 font-mono text-base font-black ${
                  latestGrade.grade >= 8 ? "bg-success/15 text-success"
                  : latestGrade.grade >= 6 ? "bg-warning/15 text-warning"
                  : "bg-error/15 text-error"
                }`}>{latestGrade.grade}</span>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed line-clamp-3 italic">
                &quot;{latestGrade.comments}&quot;
              </p>
              <button onClick={() => onNavigate("Aula")} className="text-[10px] font-bold text-jana-primary-accessible hover:underline">
                Ver mi expediente completo →
              </button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Todavía no hay registros docentes disponibles.</p>
          )}
        </div>
      </div>

      {/* ── Alumno Copilot (Interactive RAG Panel) ───────────────────── */}
      <div className="card-premium border-brain/25 p-5">
        <div className="flex items-center gap-3 border-b border-border pb-4 text-left">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brain/12 text-brain border border-brain/20">
            <Brain className="size-5" />
          </div>
          <div className="text-left flex-1">
            <h3 className="text-sm font-black text-foreground">Alumno Copilot <span className="text-brain">(IA)</span></h3>
            <p className="text-[10px] text-muted-foreground">Consulta sugerencias y ejercicios personalizados en base a tus notas.</p>
          </div>
          {/* Área 6: Live indicator */}
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-brain animate-pulse" />
            <span className="label-metric text-brain">IA</span>
          </div>
        </div>
        <div className="grid gap-4 mt-4 lg:grid-cols-[1fr_240px]">
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={studentQuestion}
                onChange={(e) => setStudentQuestion(e.target.value)}
                placeholder="Pregunta a tu copilot: ¿cómo mejorar en afinación?, ¿qué ejercicios me recomiendas?"
                className="h-10 flex-1 rounded-xl border border-border bg-black/20 pl-4 text-xs text-foreground placeholder-foreground-muted outline-none focus:border-brain transition"
                onKeyDown={(e) => e.key === "Enter" && handleStudentQuery()}
                aria-label="Pregunta al Copilot"
              />
              <Button
                onClick={handleStudentQuery}
                disabled={isStudentThinking}
                className="h-10 rounded-xl bg-brain text-xs font-semibold hover:bg-brain/90 min-w-[96px]"
              >
                {/* Área 6+7: Thinking dots instead of emoji */}
                {isStudentThinking ? (
                  <span className="flex items-center gap-1 text-white">
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                  </span>
                ) : "Preguntar"}
              </Button>
            </div>
            
            {studentAnswer && (
              <div className="rounded-xl border border-border bg-black/15 p-4 text-left text-xs leading-relaxed text-foreground-muted">
                <p className="font-bold text-brain text-[10px] uppercase tracking-wider">Plan sugerido por IA</p>
                <p className="mt-1 text-foreground">{studentAnswer}</p>
                <span className="block mt-2 text-[9px] text-muted-foreground font-semibold">
                  *Propuesta generada por IA en base a tus calificaciones autorizadas.
                </span>
              </div>
            )}
          </div>
          
          <aside className="rounded-xl border border-border bg-black/10 p-3 text-left">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Preguntas sugeridas</p>
            <div className="mt-2 space-y-1.5">
              {[
                "¿Cómo mejorar en mi debilidad?",
                "¿Qué ejercicios de canto practicar?",
                "¿Cuáles son mis objetivos actuales?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => selectStudentSuggested(q)}
                  className="w-full text-left rounded border border-border bg-surface px-2 py-1.5 text-[10px] text-foreground-muted hover:border-brain/50 hover:text-foreground transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* ── New content from teachers ────────────────────────────────────── */}
      {newArticles.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Newspaper className="size-4 text-jana-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recursos publicados por tus profesores</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-jana-primary text-white text-[9px] font-black px-1.5 py-0.5">{unreadCount}</span>
              )}
            </div>
            <button onClick={() => onNavigate("Content")} className="text-[10px] font-bold text-jana-primary-accessible hover:underline">Ver todos →</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {newArticles.map(article => (
              <button
                key={article.id}
                onClick={() => onNavigate("Content")}
                className="group rounded-xl border border-border bg-black/15 p-4 text-left transition hover:border-jana-primary/40 hover:bg-accent/20"
              >
                <p className="text-xs font-bold text-foreground line-clamp-2">{article.title}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{article.author} · {article.readingMinutes} min lectura</p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-jana-primary-accessible group-hover:underline">
                  Leer artículo <ArrowRight className="size-3" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick actions ────────────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Mi Expediente", desc: "Notas y observaciones", icon: GraduationCap, tab: "Aula", color: "text-jana-primary-accessible border-jana-primary/25 bg-jana-primary/6" },
          { label: "Consultar al Brain", desc: "Pregunta sobre tu progreso", icon: Brain, tab: "Brain", color: "text-brain border-brain/25 bg-brain/6" },
          { label: "Mi Evolución", desc: "Habilidades artísticas", icon: TrendingUp, tab: "Talent Graph", color: "text-talent border-talent/25 bg-talent/6" },
        ].map(({ label, desc, icon: Icon, tab, color }) => (
          <button
            key={tab}
            onClick={() => onNavigate(tab)}
            className={`group rounded-xl border p-4 text-left transition glass-lift ${color}`}
          >
            <div className="flex items-center justify-between">
              <Icon className="size-5" />
              <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition" />
            </div>
            <p className="mt-3 text-sm font-black">{label}</p>
            <p className="mt-0.5 text-[11px] opacity-70">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
