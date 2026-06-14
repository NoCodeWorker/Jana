"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, Target, Users } from "lucide-react";
import { Student } from "@/components/mock-data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";
import {
  DISCIPLINES,
  DISC_COLORS,
  TalentDisciplineSummary,
  TalentStudentRow,
  getPrimaryDiscipline,
  getTalentAlertReason,
} from "@/components/backstage/talent-graph-utils";
export function TalentGraphView({
  students,
  activeRole,
  activeSede,
  email,
}: {
  students: Student[];
  activeRole: JanaRole;
  activeSede: string;
  email: string;
}) {
  const [viewType, setViewType] = useState<"graph" | "table">("graph");
  const [selectedId, setSelectedId] = useState<string>("center");

  const visibleStudents = useMemo(() => {
    if (activeRole === "alumno") {
      const activeStudent = students.find(s => s.email.toLowerCase() === email.toLowerCase())
        ?? students.find(s => s.id === "s1")
        ?? students[0];
      return activeStudent ? [activeStudent] : students.slice(0, 1);
    }
    return students.filter((student) => student.sede === activeSede);
  }, [students, activeRole, activeSede, email]);

  const talentRows = useMemo<TalentStudentRow[]>(() => {
    return visibleStudents
      .map((student) => {
        const discipline = getPrimaryDiscipline(student);
        const avgSkill = student.skills.length
          ? student.skills.reduce((total, skill) => total + skill.level, 0) / student.skills.length
          : 0;
        return { student, discipline, avgSkill, rank: 0 };
      })
      .sort((a, b) => (
        DISCIPLINES.indexOf(a.discipline) - DISCIPLINES.indexOf(b.discipline)
        || b.avgSkill - a.avgSkill
        || a.student.name.localeCompare(b.student.name, "es")
      ))
      .map((row, index) => ({ ...row, rank: index + 1 }));
  }, [visibleStudents]);

  const disciplineSummaries = useMemo<TalentDisciplineSummary[]>(() => {
    return DISCIPLINES.map((discipline) => {
      const rows = talentRows.filter((row) => row.discipline === discipline);
      const count = rows.length;
      const avgSkill = count ? rows.reduce((total, row) => total + row.avgSkill, 0) / count : 0;
      const avgAttendance = count ? rows.reduce((total, row) => total + row.student.attendance, 0) / count : 0;

      return {
        discipline,
        color: DISC_COLORS[discipline],
        count,
        share: visibleStudents.length ? (count / visibleStudents.length) * 100 : 0,
        avgSkill,
        avgAttendance,
        topRows: rows.slice(0, 3),
        riskRows: rows.filter((row) => row.student.attendance < 86 || row.avgSkill < 6.4).slice(0, 3),
      };
    });
  }, [visibleStudents.length, talentRows]);

  const nodeDetails = useMemo(() => {
    const selectedDiscipline = DISCIPLINES.find((discipline) => discipline === selectedId);
    if (selectedDiscipline) {
      const summary = disciplineSummaries.find((item) => item.discipline === selectedDiscipline);
      if (!summary) return null;
      return {
        title: summary.discipline,
        type: "Disciplina Artística",
        detail1: `${summary.count} alumnos · ${summary.share.toFixed(0)}% de la sede`,
        detail2: `Nivel medio ${summary.avgSkill.toFixed(1)}/10 · Asistencia ${summary.avgAttendance.toFixed(0)}%`,
        disc: summary.discipline,
        skills: [],
        rows: summary.topRows,
        riskRows: summary.riskRows,
        color: summary.color,
      };
    }

    const selectedRow = talentRows.find((row) => row.student.id === selectedId);
    if (selectedRow) {
      return {
        title: selectedRow.student.name,
        type: "Ficha del Alumno",
        detail1: `Asistencia: ${selectedRow.student.attendance}%`,
        detail2: activeRole === "alumno"
          ? `Nivel medio: ${selectedRow.avgSkill.toFixed(1)}/10`
          : `Ranking interno: #${selectedRow.rank} · Nivel medio: ${selectedRow.avgSkill.toFixed(1)}/10`,
        disc: selectedRow.discipline,
        skills: selectedRow.student.skills.slice(0, 4),
        rows: [],
        riskRows: selectedRow.student.attendance < 86 || selectedRow.avgSkill < 6.4 ? [selectedRow] : [],
        color: DISC_COLORS[selectedRow.discipline],
      };
    }

    const totalAvg = talentRows.length
      ? talentRows.reduce((total, row) => total + row.avgSkill, 0) / talentRows.length
      : 0;
    const totalAttendance = visibleStudents.length
      ? visibleStudents.reduce((total, student) => total + student.attendance, 0) / visibleStudents.length
      : 0;

    return {
      title: activeRole === "alumno" ? "Mi Perfil Artístico" : "Talento JANA",
      type: activeRole === "alumno" ? "Vista Alumno" : "Mapa Agregado",
      detail1: activeRole === "alumno" ? "1 alumno · Mis habilidades" : `${visibleStudents.length} alumnos · ${DISCIPLINES.length} disciplinas`,
      detail2: activeRole === "alumno"
        ? `Mi nivel medio ${totalAvg.toFixed(1)}/10 · Asistencia ${totalAttendance.toFixed(0)}%`
        : `Nivel medio ${totalAvg.toFixed(1)}/10 · Asistencia ${totalAttendance.toFixed(0)}%`,
      disc: "—",
      skills: [],
      rows: talentRows.slice(0, 5),
      riskRows: talentRows.filter((row) => row.student.attendance < 86 || row.avgSkill < 6.4).slice(0, 5),
      color: "#7c5cff",
    };
  }, [selectedId, disciplineSummaries, visibleStudents, talentRows, activeRole]);

  const selectedTalentProfile = useMemo(() => {
    const row = activeRole === "alumno"
      ? talentRows[0]
      : talentRows.find((item) => item.student.id === selectedId);
    if (!row) return null;

    const rankedSkills = [...row.student.skills].sort((a, b) => b.level - a.level || a.name.localeCompare(b.name, "es"));
    const strongestSkills = rankedSkills.slice(0, 3);
    const improvementSkills = [...rankedSkills].reverse().slice(0, 3);
    const skillProgress = row.student.skills.map((skill) => {
      const lastHistorical = skill.history[skill.history.length - 1];
      const baseline = lastHistorical?.level ?? skill.level;
      return {
        ...skill,
        delta: skill.level - baseline,
        baseline,
      };
    }).sort((a, b) => b.delta - a.delta || b.level - a.level);
    const positiveProgress = skillProgress.filter((skill) => skill.delta > 0).length;
    const avgGrade = row.student.grades.length
      ? row.student.grades.reduce((total, grade) => total + grade.grade, 0) / row.student.grades.length
      : 0;
    const progressScore = Math.round(
      Math.min(
        100,
        row.avgSkill * 7
        + row.student.attendance * 0.18
        + positiveProgress * 3
        + (row.student.punctuality ? 5 : 0)
      )
    );
    const status = progressScore >= 82
      ? "Progreso sólido"
      : progressScore >= 70
      ? "Progreso en construcción"
      : "Seguimiento prioritario";
    const weakest = improvementSkills[0];
    let action = "";
    if (row.student.attendance < 80) {
      action = "Prioridad crítica: Estabilizar la asistencia a clase. En artes escénicas la continuidad física y el trabajo grupal son esenciales para afianzar el repertorio antes de exigir mayor precisión técnica.";
    } else if (weakest) {
      const isTechnical = weakest.category === "Canto" || weakest.category === "Música" || weakest.name === "Ritmo";
      if (isTechnical) {
        action = `Plan técnico: Se recomienda reforzar la precisión de ${weakest.name.toLowerCase()} (${weakest.category}). Sugerimos realizar ejercicios de calentamiento enfocado de 10 minutos diarios de cara a las próximas clases.`;
      } else {
        action = `Plan artístico: Se aconseja profundizar en ${weakest.name.toLowerCase()} (${weakest.category}). Enfoca tu práctica escénica en la relajación del tono muscular y la intención comunicativa de cara a la muestra del trimestre.`;
      }
    } else {
      action = "Consolidación artística: Mantener el alto nivel interpretativo y explorar nuevos matices de expresión en los próximos ensayos colectivos.";
    }

    return {
      row,
      strongestSkills,
      improvementSkills,
      skillProgress,
      avgGrade,
      progressScore,
      status,
      action,
      latestGrades: row.student.grades.slice(-3).reverse(),
    };
  }, [activeRole, selectedId, talentRows]);

  useEffect(() => {
    if (activeRole !== "alumno") return;
    const activeStudent = visibleStudents[0];
    if (activeStudent && selectedId !== activeStudent.id) {
      setSelectedId(activeStudent.id);
    }
  }, [activeRole, selectedId, visibleStudents]);

  if (activeRole === "alumno" && selectedTalentProfile) {
    const profile = selectedTalentProfile;
    const student = profile.row.student;
    const disciplineColor = DISC_COLORS[profile.row.discipline];
    const progressTone = profile.progressScore >= 82
      ? "text-success border-success/30 bg-success/10"
      : profile.progressScore >= 70
      ? "text-warning border-warning/30 bg-warning/10"
      : "text-error border-error/30 bg-error/10";

    return (
      <div className="dashboard-canvas space-y-6">
        <section className="overflow-hidden rounded-2xl border border-border bg-surface/95">
          <div className="relative grid gap-6 p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div
              className="absolute inset-0 opacity-30"
              style={{ background: `radial-gradient(circle at 20% 0%, ${disciplineColor}55, transparent 38%)` }}
            />
            <div className="relative space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-talent/30 bg-talent/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-talent">
                  Mi Talent Graph
                </span>
                <span style={{ borderColor: `${disciplineColor}55`, color: disciplineColor }} className="rounded-full border bg-black/20 px-3 py-1 text-[10px] font-black">
                  {profile.row.discipline}
                </span>
                <span className={cn("rounded-full border px-3 py-1 text-[10px] font-black", progressTone)}>
                  {profile.status}
                </span>
              </div>

              <div>
                <p className="text-sm font-bold text-foreground-muted">Perfil artístico de</p>
                <h3 className="mt-2 max-w-4xl text-3xl font-black leading-tight text-foreground lg:text-5xl">
                  {student.name}
                </h3>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground-muted">
                  Lectura personal de progreso: habilidades actuales, evolución reciente, foco docente y próximas acciones para crecer con criterio.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  ["Progreso global", `${profile.progressScore}%`, profile.status],
                  ["Nivel medio", profile.row.avgSkill.toFixed(1), "sobre 10"],
                  ["Asistencia", `${student.attendance}%`, student.punctuality ? "puntualidad estable" : "revisar puntualidad"],
                  ["Evaluaciones", `${student.grades.length}`, "registros docentes"],
                ].map(([label, value, detail]) => (
                  <div key={label} className="rounded-xl border border-border bg-black/25 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
                    <p style={{ color: disciplineColor }} className="mt-3 font-mono text-2xl font-black">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-foreground-muted">{detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl border border-border bg-black/25 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-jana-primary-accessible">Lectura JANA</p>
                  <h4 className="mt-2 text-xl font-black text-foreground">Plan de avance recomendado</h4>
                </div>
                <Target className="size-5 text-jana-primary-accessible" />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-foreground-muted">{profile.action}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-success/20 bg-success/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-success">Fortalezas visibles</p>
                  <div className="mt-3 space-y-2">
                    {profile.strongestSkills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-bold text-foreground">{skill.name}</span>
                        <span className="font-mono font-black text-success">{skill.level}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-warning/20 bg-warning/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-warning">Foco de mejora</p>
                  <div className="mt-3 space-y-2">
                    {profile.improvementSkills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-bold text-foreground">{skill.name}</span>
                        <span className="font-mono font-black text-warning">{skill.level}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-2xl border-border bg-surface/95">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Evolución por habilidad</CardTitle>
              <p className="text-sm text-foreground-muted">Comparativa entre nivel actual y último registro histórico disponible.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.skillProgress.map((skill) => (
                <div key={skill.name} className="rounded-xl border border-border bg-black/20 p-4">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-foreground">{skill.name}</p>
                      <p className="mt-1 text-xs font-semibold text-foreground-muted">{skill.category}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ color: DISC_COLORS[skill.category] }} className="font-mono text-lg font-black">{skill.level}/10</p>
                      <p className={cn("text-xs font-black", skill.delta >= 0 ? "text-success" : "text-error")}>
                        {skill.delta >= 0 ? "+" : ""}{skill.delta.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, skill.level * 10)}%`, backgroundColor: DISC_COLORS[skill.category] }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-surface/95">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Últimas señales docentes</CardTitle>
              <p className="text-sm text-foreground-muted">Evidencias recientes que explican el progreso, no solo la nota.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.latestGrades.length > 0 ? profile.latestGrades.map((grade) => (
                <div key={`${grade.course}-${grade.grade}-${grade.comments}`} className="rounded-xl border border-border bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-foreground">{grade.course}</p>
                      <p className="mt-1 text-xs font-semibold text-foreground-muted">Registro pedagógico</p>
                    </div>
                    <span className="rounded-lg bg-jana-primary/10 px-3 py-2 font-mono text-sm font-black text-jana-primary-accessible">{grade.grade}</span>
                  </div>
                  <div className="mt-3 text-xs leading-relaxed text-foreground-muted">
                    {grade.comments.includes("\n") ? (
                      <div className="grid gap-1.5">
                        {grade.comments.split("\n").map((line, lIdx) => {
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
                      <p className="italic font-medium">&quot;{grade.comments}&quot;</p>
                    )}
                  </div>
                </div>
              )) : (
                <div className="rounded-xl border border-warning/25 bg-warning/10 p-4 text-sm font-semibold text-warning">
                  Todavía no hay suficientes registros docentes para construir una lectura histórica completa.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3 bg-surface border border-border p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-talent" />
          <h3 className="font-semibold text-sm">
            {activeRole === "alumno" ? "Mi Perfil de Habilidades" : `Mapa de Talento · ${visibleStudents.length} alumnos`}
          </h3>
          <div className="hidden sm:flex gap-2 ml-2">
            {disciplineSummaries.map((summary) => (
              <span key={summary.discipline} style={{ borderColor: summary.color + "55", color: summary.color }} className="text-[10px] font-bold border rounded-full px-2 py-0.5 bg-surface-elevated/50">
                {summary.discipline} · {summary.count}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant={viewType === "graph" ? "default" : "outline"}
            className={viewType === "graph" ? "bg-jana-primary hover:bg-jana-primary-hover text-xs" : "text-xs"}
            onClick={() => setViewType("graph")}>
            Vista Mapa
          </Button>
          <Button size="sm" variant={viewType === "table" ? "default" : "outline"}
            className={viewType === "table" ? "bg-jana-primary hover:bg-jana-primary-hover text-xs" : "text-xs"}
            onClick={() => setViewType("table")}>
            Vista Tabla
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">

        {/* GRAPH OR TABLE */}
        <Card className="rounded-xl bg-surface/90 border-border lg:col-span-8 overflow-hidden">
          {viewType === "graph" ? (
            <div className="space-y-4 p-4">
              <button
                type="button"
                onClick={() => setSelectedId("center")}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition",
                  selectedId === "center" ? "border-jana-primary bg-jana-primary/10" : "border-border bg-black/20 hover:bg-surface-elevated/40"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-jana-primary-accessible">Talent Graph agregado</p>
                    <h4 className="mt-1 text-lg font-black text-foreground">Mapa operativo por disciplina</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-right text-xs">
                    <div>
                      <p className="font-mono text-xl font-black text-foreground">{students.length}</p>
                      <p className="text-muted-foreground">Alumnos</p>
                    </div>
                    <div>
                      <p className="font-mono text-xl font-black text-talent">
                        {talentRows.length ? (talentRows.reduce((total, row) => total + row.avgSkill, 0) / talentRows.length).toFixed(1) : "0.0"}
                      </p>
                      <p className="text-muted-foreground">Nivel medio</p>
                    </div>
                    <div>
                      <p className="font-mono text-xl font-black text-brain">
                        {students.length ? Math.round(students.reduce((total, student) => total + student.attendance, 0) / students.length) : 0}%
                      </p>
                      <p className="text-muted-foreground">Asistencia</p>
                    </div>
                  </div>
                </div>
              </button>

              <div className="grid gap-3 xl:grid-cols-5 md:grid-cols-2">
                {disciplineSummaries.map((summary) => {
                  const isSelected = selectedId === summary.discipline;
                  return (
                    <button
                      key={summary.discipline}
                      type="button"
                      onClick={() => setSelectedId(summary.discipline)}
                      className={cn(
                        "w-full h-full min-h-[300px] rounded-lg border p-4 text-left transition flex flex-col justify-between",
                        isSelected ? "bg-surface-elevated shadow-lg" : "bg-black/20 hover:bg-surface-elevated/40"
                      )}
                      style={{
                        borderColor: isSelected ? summary.color : `${summary.color}33`,
                        boxShadow: isSelected ? `0 18px 42px ${summary.color}20` : undefined,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3 w-full">
                        <div>
                          <p style={{ color: summary.color }} className="text-sm font-black">{summary.discipline}</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">{summary.count} alumnos · {summary.share.toFixed(0)}%</p>
                        </div>
                        <span style={{ color: summary.color, borderColor: `${summary.color}44` }} className="rounded-full border px-2 py-0.5 text-[10px] font-bold">
                          {summary.avgSkill.toFixed(1)}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3 flex-1 flex flex-col justify-between w-full">
                        <div>
                          <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                            <span>Distribución</span>
                            <span>{summary.share.toFixed(0)}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-surface">
                            <div className="h-full rounded-full" style={{ width: `${summary.share}%`, backgroundColor: summary.color }} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-md border border-border bg-black/20 p-2">
                            <p className="font-mono font-black text-foreground">{summary.avgAttendance.toFixed(0)}%</p>
                            <p className="text-[10px] text-muted-foreground">Asistencia</p>
                          </div>
                          <div className="rounded-md border border-border bg-black/20 p-2">
                            <p className="font-mono font-black text-warning">{summary.riskRows.length}</p>
                            <p className="text-[10px] text-muted-foreground">Alertas</p>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-border pt-3 mt-auto w-full">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Top alumnos</p>
                          {summary.topRows.length > 0 ? summary.topRows.map((row) => (
                            <div key={row.student.id} className="flex items-center justify-between gap-2 text-[11px]">
                              <span className="truncate font-medium text-foreground">{row.student.name}</span>
                              <span style={{ color: summary.color }} className="font-mono font-bold">{row.avgSkill.toFixed(1)}</span>
                            </div>
                          )) : (
                            <p className="text-[11px] text-muted-foreground">Sin alumnos asignados</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-[10px] text-muted-foreground">
                El mapa no dibuja alumnos como nodos: resume cohortes por disciplina para escalar a cientos de alumnos sin ruido visual.
              </p>
            </div>
          ) : (
            /* ACCESSIBLE TABLE */
            <div className="max-h-[560px] w-full overflow-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider bg-surface-elevated/40">
                    <th className="p-3">Alumno</th>
                    <th className="p-3">Disciplina</th>
                    <th className="p-3">Sede</th>
                    <th className="p-3">Asistencia</th>
                    <th className="p-3">Nivel medio</th>
                    <th className="p-3">Evaluaciones</th>
                  </tr>
                </thead>
                <tbody>
                  {talentRows.map(({ student, discipline, avgSkill, rank }) => {
                    const discColor = DISC_COLORS[discipline] ?? "#ec690c";
                    return (
                      <tr key={student.id}
                        className={cn("border-b border-border transition cursor-pointer",
                          selectedId === student.id ? "bg-jana-primary/8" : "hover:bg-surface-elevated/40")}
                        onClick={() => setSelectedId(student.id)}>
                        <td className="p-3 font-semibold text-foreground">
                          <span className="mr-2 font-mono text-[10px] text-muted-foreground">#{rank}</span>
                          {student.name}
                        </td>
                        <td className="p-3">
                          <span style={{ color: discColor, borderColor: discColor + "44" }}
                            className="text-[10px] font-bold border rounded-full px-2 py-0.5 bg-surface-elevated/30">
                            {discipline}
                          </span>
                        </td>
                        <td className="p-3 text-foreground-muted">{student.sede}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 rounded-full bg-surface-elevated overflow-hidden">
                              <div className="h-full rounded-full bg-talent" style={{ width: `${student.attendance}%` }} />
                            </div>
                            <span className="font-mono text-talent font-bold">{student.attendance}%</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-foreground font-bold">{avgSkill.toFixed(1)}<span className="text-foreground-muted font-normal">/10</span></td>
                        <td className="p-3 text-foreground-muted">{student.grades.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* DETAILS PANEL */}
        <Card className="rounded-xl bg-surface/90 border-border lg:col-span-4 p-5 space-y-4">
          {nodeDetails ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <span style={{ color: nodeDetails.color, borderColor: nodeDetails.color + "44", backgroundColor: nodeDetails.color + "18" }}
                  className="text-[10px] font-bold border rounded-full px-3 py-1 inline-block">
                  {nodeDetails.type}
                </span>
                <h4 className="text-lg font-bold leading-tight">{nodeDetails.title}</h4>
                {nodeDetails.disc !== "—" && (
                  <span className="text-[10px] text-foreground-muted">{nodeDetails.disc}</span>
                )}
              </div>

              <div className="space-y-2 text-xs text-foreground-muted bg-black/20 rounded-lg p-3">
                <p className="flex items-center gap-2">
                  <Activity className="size-3 text-talent flex-shrink-0" />
                  {nodeDetails.detail1}
                </p>
                <p className="flex items-center gap-2">
                  <Activity className="size-3 text-brain flex-shrink-0" />
                  {nodeDetails.detail2}
                </p>
              </div>

              {selectedTalentProfile && (
                <div className="space-y-4 pt-2 border-t border-border">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["Progreso", `${selectedTalentProfile.progressScore}%`, selectedTalentProfile.status],
                      ["Media", selectedTalentProfile.row.avgSkill.toFixed(1), `notas ${selectedTalentProfile.avgGrade.toFixed(1)}`],
                      ["Asistencia", `${selectedTalentProfile.row.student.attendance}%`, selectedTalentProfile.row.student.punctuality ? "puntual" : "revisar"],
                    ].map(([label, value, detail]) => (
                      <div key={label} className="rounded-lg border border-border bg-black/15 p-3">
                        <p className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{label}</p>
                        <p style={{ color: nodeDetails.color }} className="mt-2 font-mono text-lg font-black">{value}</p>
                        <p className="mt-0.5 truncate text-[10px] text-foreground-muted">{detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-border bg-black/15 p-4">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Lectura de progreso</p>
                        <p className="mt-1 text-sm font-black text-foreground">{selectedTalentProfile.status}</p>
                      </div>
                      <span className={cn(
                        "rounded-full border px-2 py-1 text-[10px] font-black",
                        selectedTalentProfile.progressScore >= 82
                          ? "border-success/30 bg-success/10 text-success"
                          : selectedTalentProfile.progressScore >= 70
                          ? "border-warning/30 bg-warning/10 text-warning"
                          : "border-error/30 bg-error/10 text-error"
                      )}>
                        {selectedTalentProfile.row.discipline}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-foreground-muted">{selectedTalentProfile.action}</p>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Evolución por habilidad</h5>
                    {selectedTalentProfile.skillProgress.map((skill) => (
                      <div key={skill.name} className="rounded-lg border border-border bg-black/15 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-foreground">{skill.name}</p>
                            <p className="text-[10px] text-muted-foreground">{skill.category}</p>
                          </div>
                          <div className="text-right">
                            <p style={{ color: DISC_COLORS[skill.category] }} className="font-mono text-sm font-black">{skill.level}/10</p>
                            <p className={cn("text-[10px] font-bold", skill.delta >= 0 ? "text-success" : "text-error")}>
                              {skill.delta >= 0 ? "+" : ""}{skill.delta.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-surface-elevated">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${skill.level * 10}%`, backgroundColor: DISC_COLORS[skill.category] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-success/20 bg-success/10 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-success">Fortalezas</p>
                      <div className="mt-2 space-y-1">
                        {selectedTalentProfile.strongestSkills.map((skill) => (
                          <p key={skill.name} className="text-[11px] font-semibold text-foreground">{skill.name} · {skill.level}/10</p>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-warning/20 bg-warning/10 p-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-warning">Foco de mejora</p>
                      <div className="mt-2 space-y-1">
                        {selectedTalentProfile.improvementSkills.map((skill) => (
                          <p key={skill.name} className="text-[11px] font-semibold text-foreground">{skill.name} · {skill.level}/10</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedTalentProfile.latestGrades.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Últimas evaluaciones</h5>
                      {selectedTalentProfile.latestGrades.map((grade) => (
                        <div key={`${grade.course}-${grade.grade}-${grade.comments}`} className="rounded-lg border border-border bg-black/15 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-xs font-bold text-foreground">{grade.course}</p>
                            <span className="rounded-md bg-jana-primary/10 px-2 py-1 font-mono text-xs font-black text-jana-primary-accessible">{grade.grade}</span>
                          </div>
                          <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-foreground-muted">{grade.comments}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!selectedTalentProfile && nodeDetails.skills.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Habilidades Artísticas</h5>
                  {nodeDetails.skills.map((s, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-foreground">{s.name}</span>
                        <span style={{ color: nodeDetails.color }} className="font-bold">{s.level}/10</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full overflow-hidden bg-surface-elevated">
                        <div className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${s.level * 10}%`, backgroundColor: nodeDetails.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {nodeDetails.disc !== "—" && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between gap-3">
                    <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alertas de seguimiento</h5>
                    <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-black text-warning">
                      {nodeDetails.riskRows.length}
                    </span>
                  </div>
                  {nodeDetails.riskRows.length > 0 ? (
                    <div className="space-y-2">
                      {nodeDetails.riskRows.map((row) => (
                        <button
                          key={row.student.id}
                          type="button"
                          onClick={() => setSelectedId(row.student.id)}
                          className="flex w-full items-start justify-between gap-3 rounded-md border border-warning/25 bg-warning/10 px-3 py-2 text-left transition hover:bg-warning/15"
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-semibold text-foreground">{row.student.name}</span>
                            <span className="mt-0.5 block text-[10px] text-warning">{getTalentAlertReason(row)}</span>
                          </span>
                          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-md border border-success/20 bg-success/10 p-3 text-[11px] leading-relaxed text-success">
                      Sin alertas activas en esta disciplina.
                    </div>
                  )}
                </div>
              )}

              {nodeDetails.rows.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-border">
                  <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Alumnos destacados</h5>
                  {nodeDetails.rows.map((row) => (
                    <button
                      key={row.student.id}
                      type="button"
                      onClick={() => setSelectedId(row.student.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-black/20 px-3 py-2 text-left transition hover:bg-surface-elevated/50"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-semibold text-foreground">{row.student.name}</span>
                        <span className="text-[10px] text-muted-foreground">#{row.rank} · {row.discipline}</span>
                      </span>
                      <span style={{ color: DISC_COLORS[row.discipline] }} className="font-mono text-xs font-black">
                        {row.avgSkill.toFixed(1)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[10px] text-foreground-muted/60 pt-2 border-t border-border/50">
                Selecciona una disciplina para ver cohortes o una fila de tabla para abrir la ficha individual.
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="size-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Selecciona una disciplina o alumno para ver información detallada.</p>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}

