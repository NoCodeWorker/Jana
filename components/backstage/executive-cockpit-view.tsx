"use client";

import { FormEvent, useState } from "react";
import { Activity, Brain, Send, Sparkles } from "lucide-react";
import { Student, Teacher, useMockData } from "@/components/mock-data-context";
import { getPrimaryDiscipline, getStudentAvgSkill, DISCIPLINES, DISC_COLORS } from "@/components/backstage/talent-graph-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sedes = ["Madrid Sede Central", "Alcalá de Henares", "Majadahonda", "México (CDMX)"];
const GLOBAL_SCOPE = "Global";
const marketBySede: Record<string, { leads: number; conversionRate: number }> = {
  "Madrid Sede Central": { leads: 56, conversionRate: 42 },
  "Alcalá de Henares": { leads: 31, conversionRate: 34 },
  Majadahonda: { leads: 38, conversionRate: 38 },
  "México (CDMX)": { leads: 24, conversionRate: 30 },
};

export function ExecutiveCockpitView({
  activeSede,
  students,
  teachers,
}: {
  activeSede: string;
  students: Student[];
  teachers: Teacher[];
}) {
  const { invoices, contentArticles } = useMockData();
  const [activeConsultantQuestion, setActiveConsultantQuestion] = useState("prioridad");
  const [consultantInput, setConsultantInput] = useState("");
  const [consultantMessages, setConsultantMessages] = useState<Array<{
    id: string;
    role: "assistant" | "user";
    title?: string;
    text: string;
    chips?: string[];
    sources?: string[];
    confidence?: number;
  }>>([
    {
      id: "consultant-welcome",
      role: "assistant",
      title: "Lectura inicial",
      text: "Estoy conectado a datos importados del CRM existente, Aula, Talent Graph, contenidos y operación. Puedes preguntarme por riesgos, sedes, captación, alumnos, profesorado o próximos pasos.",
      chips: ["CRM externo", "Aula", "Talent Graph", "Operación"],
      sources: ["Integración de Sistemas"],
      confidence: 100,
    },
  ]);

  const formatCurrency = (value: number) => `${value.toLocaleString("es-ES", { maximumFractionDigits: 0 })}€`;
  const isGlobalScope = activeSede === GLOBAL_SCOPE;
  const scopeLabel = isGlobalScope ? "Global" : activeSede;
  const scopeSentence = isGlobalScope ? "la red JANA" : activeSede;
  const selectedStudents = isGlobalScope ? students : students.filter((student) => student.sede === activeSede);
  const selectedTeachers = isGlobalScope ? teachers : teachers.filter((teacher) => teacher.sede === activeSede);
  const selectedInvoices = isGlobalScope ? invoices : invoices.filter((invoice) => invoice.sede === activeSede);
  const selectedArticles = isGlobalScope
    ? contentArticles
    : contentArticles.filter((article) => article.sede === activeSede || article.geoTargets.includes(activeSede));

  const completedRevenue = selectedInvoices
    .filter((invoice) => invoice.status === "completado")
    .reduce((total, invoice) => total + invoice.amount, 0);
  const pendingRevenue = selectedInvoices
    .filter((invoice) => invoice.status !== "completado")
    .reduce((total, invoice) => total + invoice.amount, 0);
  const avgAttendance = selectedStudents.length
    ? selectedStudents.reduce((total, student) => total + student.attendance, 0) / selectedStudents.length
    : 0;
  const avgSkill = selectedStudents.length
    ? selectedStudents.reduce((total, student) => total + getStudentAvgSkill(student), 0) / selectedStudents.length
    : 0;
  const riskStudents = selectedStudents
    .map((student) => {
      const avgSkill = getStudentAvgSkill(student);
      const hasDebt = invoices.some((inv) => inv.studentName === student.name && inv.status !== "completado");
      
      // Churn Risk calculation: (Attendance_Delta * 0.4) + (Impago_CRM * 0.3) + (Skills_Level_Delta * 0.3)
      const attendanceDelta = Math.max(0, 95 - student.attendance); // Delta relative to target 95%
      const attendanceScore = Math.min(100, (attendanceDelta / 30) * 100); // normalized over 30% drop
      const debtScore = hasDebt ? 100 : 0;
      const skillDelta = Math.max(0, 8.0 - avgSkill); // Delta relative to target 8.0 level
      const skillScore = Math.min(100, (skillDelta / 4) * 100); // normalized over 4 points drop
      
      const churnScore = Math.min(100, Math.round(attendanceScore * 0.4 + debtScore * 0.3 + skillScore * 0.3));
      
      return {
        student,
        avgSkill,
        hasDebt,
        churnScore,
      };
    })
    .filter((item) => item.churnScore > 15) // Only display significant risk
    .sort((a, b) => b.churnScore - a.churnScore);
  const overloadedTeachers = selectedTeachers.filter((teacher) => teacher.hours >= 100);
  const verifactuErrors = selectedInvoices.filter((invoice) => invoice.verifactuStatus === "error");
  const draftArticles = selectedArticles.filter((article) => article.status !== "publicado");
  const publishedArticles = selectedArticles.filter((article) => article.status === "publicado");
  const selectedMarkets = isGlobalScope ? Object.values(marketBySede) : [marketBySede[activeSede] ?? { leads: 0, conversionRate: 0 }];
  const leads = selectedMarkets.reduce((total, market) => total + market.leads, 0);
  const trialClasses = selectedMarkets.reduce((total, market) => total + Math.round(market.leads * 0.55), 0);
  const projectedEnrollments = selectedMarkets.reduce((total, market) => total + Math.round(Math.round(market.leads * 0.55) * (market.conversionRate / 100)), 0);
  const conversionRate = trialClasses ? Math.round((projectedEnrollments / trialClasses) * 100) : 0;
  const operationalAlerts = riskStudents.length + overloadedTeachers.length + verifactuErrors.length + draftArticles.length;
  const healthScore = Math.max(
    62,
    Math.min(
      96,
      Math.round(
        avgAttendance * 0.35
        + avgSkill * 5
        + conversionRate * 0.35
        - verifactuErrors.length * 6
        - riskStudents.length * 1.5
      )
    )
  );

  const sedeSummaries = sedes.map((sede) => {
    const sedeStudents = students.filter((student) => student.sede === sede);
    const sedeInvoices = invoices.filter((invoice) => invoice.sede === sede);
    const revenue = sedeInvoices
      .filter((invoice) => invoice.status === "completado")
      .reduce((total, invoice) => total + invoice.amount, 0);
    const pending = sedeInvoices
      .filter((invoice) => invoice.status !== "completado")
      .reduce((total, invoice) => total + invoice.amount, 0);
    const attendance = sedeStudents.length
      ? sedeStudents.reduce((total, student) => total + student.attendance, 0) / sedeStudents.length
      : 0;
    const skill = sedeStudents.length
      ? sedeStudents.reduce((total, student) => total + getStudentAvgSkill(student), 0) / sedeStudents.length
      : 0;
    return { sede, revenue, pending, attendance, skill, students: sedeStudents.length };
  });

  const maxRevenue = Math.max(...sedeSummaries.map((summary) => summary.revenue), 1);
  const bestRevenueSede = sedeSummaries.reduce((best, summary) => (summary.revenue > best.revenue ? summary : best), sedeSummaries[0]);
  const weakestAcademicSede = sedeSummaries.reduce((weakest, summary) => (
    (summary.attendance + summary.skill * 10) < (weakest.attendance + weakest.skill * 10) ? summary : weakest
  ), sedeSummaries[0]);
  const disciplinePressure = DISCIPLINES.map((discipline) => {
    const matching = selectedStudents.filter((student) => getPrimaryDiscipline(student) === discipline);
    const teachersForDiscipline = selectedTeachers.filter((teacher) => teacher.subjects.some((subject) => subject.toLowerCase().includes(discipline.toLowerCase().slice(0, 5))));
    return {
      discipline,
      count: matching.length,
      ratio: teachersForDiscipline.length ? matching.length / teachersForDiscipline.length : matching.length,
      color: DISC_COLORS[discipline],
    };
  }).sort((a, b) => b.ratio - a.ratio);

  const recommendedActions = [
    {
      title: verifactuErrors.length ? "Revisar incidencia en CRM externo" : "Auditar lectura semanal del CRM",
      detail: verifactuErrors.length
        ? `${verifactuErrors.length} registro importado requiere revisión en el CRM de origen antes del cierre.`
        : "Sin errores críticos; revisar trazabilidad de importación antes del cierre semanal.",
      tone: verifactuErrors.length ? "error" : "success",
    },
    {
      title: "Activar seguimiento de alumnos en riesgo",
      detail: `${riskStudents.length} alumnos combinan asistencia baja o nivel estancado en ${scopeSentence}.`,
      tone: riskStudents.length > 3 ? "warning" : "info",
    },
    {
      title: "Revisar capacidad docente",
      detail: overloadedTeachers.length
        ? `${overloadedTeachers.length} docentes superan 100h acumuladas; revisar carga y sustituciones.`
        : "Carga docente controlada; mantener seguimiento por disciplina.",
      tone: overloadedTeachers.length ? "warning" : "success",
    },
    {
      title: "Aprobar calendario editorial",
      detail: `${draftArticles.length} piezas pendientes pueden alimentar captación orgánica y recursos de aula.`,
      tone: draftArticles.length ? "info" : "success",
    },
  ];

  const toneClass: Record<string, string> = {
    success: "border-success/25 bg-success/10 text-success",
    warning: "border-warning/25 bg-warning/10 text-warning",
    error: "border-error/25 bg-error/10 text-error",
    info: "border-brain/25 bg-brain/10 text-brain",
  };

  const cashExposure = completedRevenue + pendingRevenue
    ? Math.round((pendingRevenue / (completedRevenue + pendingRevenue)) * 100)
    : 0;
  const topPressureDiscipline = disciplinePressure[0];
  const consultantQuestions = [
    {
      id: "prioridad",
      label: "¿Qué necesita atención hoy?",
      verdict: operationalAlerts
        ? `${scopeSentence} tiene ${operationalAlerts} señales operativas. La prioridad es cerrar riesgos antes de empujar captación.`
        : `${scopeSentence} está estable. La oportunidad está en acelerar captación sin descuidar seguimiento académico.`,
      evidence: `${riskStudents.length} alumnos en seguimiento, ${overloadedTeachers.length} docentes con carga alta, ${verifactuErrors.length} incidencias CRM/fiscales importadas y ${draftArticles.length} contenidos pendientes.`,
      opportunity: topPressureDiscipline
        ? `${topPressureDiscipline.discipline} concentra la mayor presión relativa con ${topPressureDiscipline.count} alumnos.`
        : "No hay presión clara por disciplina.",
      next: riskStudents.length
        ? "Convocar revisión de alumnos en riesgo y asignar propietario docente antes del próximo bloque de clases."
        : "Convertir el buen estado operativo en campaña de clase de prueba para captar demanda de alta intención.",
    },
    {
      id: "crm",
      label: "¿Qué señales trae el CRM?",
      verdict: `${formatCurrency(completedRevenue)} cobrados y ${formatCurrency(pendingRevenue)} pendientes en ${scopeSentence}. Exposición pendiente: ${cashExposure}%.`,
      evidence: `${leads} leads, ${trialClasses} clases de prueba y ${projectedEnrollments} matrículas previstas con conversión del ${conversionRate}%.`,
      opportunity: cashExposure > 18
        ? "Hay margen inmediato en recuperación de cobros y confirmación de matrículas antes de invertir más tráfico."
        : "La base de cobro está razonablemente controlada; conviene presionar conversión de prueba a matrícula.",
      next: "Separar el pipeline en tres colas: pendiente de pago, pendiente de prueba y pendiente de matrícula. Revisar cada cola con responsable y fecha.",
    },
    {
      id: "sedes",
      label: "¿Qué sede debo comparar?",
      verdict: `${bestRevenueSede.sede} lidera ingresos con ${formatCurrency(bestRevenueSede.revenue)}. ${weakestAcademicSede.sede} necesita más atención académica relativa.`,
      evidence: `${weakestAcademicSede.sede}: asistencia ${weakestAcademicSede.attendance.toFixed(0)}% y nivel ${weakestAcademicSede.skill.toFixed(1)}/10.`,
      opportunity: "Cruzar rendimiento académico con captación permite detectar si una sede necesita más marketing, más seguimiento docente o ambas cosas.",
      next: `Usar ${bestRevenueSede.sede} como referencia comercial y abrir plan de mejora operativo para ${weakestAcademicSede.sede}.`,
    },
    {
      id: "crecimiento",
      label: "¿Dónde está la oportunidad?",
      verdict: `La oportunidad más cercana son ${projectedEnrollments} matrículas previstas si se protege la conversión actual del ${conversionRate}%.`,
      evidence: `${publishedArticles.length} artículos publicados y ${draftArticles.length} en revisión pueden alimentar captación orgánica por sede, disciplina y búsqueda local.`,
      opportunity: draftArticles.length
        ? "Publicar contenidos pendientes puede reforzar SEO/GEO/AIO y reducir dependencia de captación pagada."
        : "Con el contenido al día, el siguiente paso es medir qué páginas convierten mejor a clase de prueba.",
      next: "Crear una acción conjunta: contenidos por disciplina + CTA de clase de prueba + tarea de seguimiento en el CRM externo a 48 horas.",
    },
  ];
  const activeConsultantInsight = consultantQuestions.find((question) => question.id === activeConsultantQuestion) ?? consultantQuestions[0];
  const proactiveSignals = [
    {
      label: "Cobro pendiente",
      value: formatCurrency(pendingRevenue),
      detail: `${cashExposure}% de exposición sobre pipeline de caja`,
      tone: cashExposure > 18 ? "warning" : "success",
    },
    {
      label: "Alumnos sensibles",
      value: riskStudents.length.toString(),
      detail: riskStudents[0] ? `${riskStudents[0].student.name} requiere primera revisión` : "Sin riesgo académico crítico",
      tone: riskStudents.length ? "warning" : "success",
    },
    {
      label: "Presión docente",
      value: topPressureDiscipline?.discipline ?? "—",
      detail: topPressureDiscipline ? `${topPressureDiscipline.count} alumnos en la disciplina con más tensión` : "Sin presión por disciplina",
      tone: topPressureDiscipline && topPressureDiscipline.count > 3 ? "info" : "success",
    },
  ];

  const buildConsultantAnswer = (query: string) => {
    const normalized = query.toLowerCase();
    const matchedInsight = consultantQuestions.find((question) => (
      normalized.includes(question.id)
      || question.label.toLowerCase().replace(/[¿?]/g, "").split(" ").some((word) => word.length > 5 && normalized.includes(word))
    ));

    if (normalized.includes("alumno") || normalized.includes("riesgo") || normalized.includes("aula") || normalized.includes("talent")) {
      const highestRiskStudentName = riskStudents[0]?.student.name ?? "ninguno";
      const highestRiskStudentAttendance = riskStudents[0]?.student.attendance ?? 100;
      const highestRiskStudentSkill = riskStudents[0]?.avgSkill ?? 10;
      const highestRiskStudentChurn = riskStudents[0]?.churnScore ?? 0;
      return {
        title: "Riesgo académico y talento",
        text: riskStudents.length
          ? `Hay ${riskStudents.length} alumnos con riesgo de abandono en ${scopeSentence}. El caso más crítico es ${highestRiskStudentName}: Churn Score ${highestRiskStudentChurn}%, asistencia ${highestRiskStudentAttendance}% y nivel ${highestRiskStudentSkill.toFixed(1)}/10. Mi recomendación es asignar responsable docente, revisar última evaluación y generar feedback en Aula.`
          : `No detecto alumnos en riesgo operativo en ${scopeSentence}. Puedes usar este margen para revisar talento alto y preparar comunicación a familias con progreso destacado.`,
        chips: ["Aula", "Seguimiento", "Talent Graph"],
        sources: ["Aula (Asistencias)", "Talent Graph (Habilidades)", "CRM Externo (Pagos)"],
        confidence: 88,
      };
    }

    if (normalized.includes("profesor") || normalized.includes("docente") || normalized.includes("carga") || normalized.includes("horas")) {
      return {
        title: "Capacidad docente",
        text: overloadedTeachers.length
          ? `${overloadedTeachers.length} docentes superan 100h acumuladas. Antes de abrir más plazas, revisaría sustituciones, grupos con ratio alta y disciplinas con más presión. ${topPressureDiscipline ? `${topPressureDiscipline.discipline} es la primera disciplina a mirar.` : ""}`
          : `La carga docente está controlada en ${scopeSentence}. La oportunidad es usar profesorado disponible para reforzar pruebas de nivel o crear grupos de conversión rápida.`,
        chips: ["Profesorado", "Capacidad", "Operación"],
        sources: ["Operación (Carga Horaria)", "Aula (Grupos)"],
        confidence: 95,
      };
    }

    if (normalized.includes("cobro") || normalized.includes("factura") || normalized.includes("crm") || normalized.includes("matrícula") || normalized.includes("ingreso")) {
      return {
        title: "Lectura del CRM externo",
        text: `${scopeSentence} trae ${formatCurrency(completedRevenue)} cobrados y ${formatCurrency(pendingRevenue)} pendientes desde el CRM integrado. Con ${leads} leads y ${trialClasses} clases de prueba, la palanca inmediata es separar pendientes de pago, pendientes de prueba y pendientes de matrícula. JANA OS no gestiona el CRM: prioriza la acción directiva con esos datos.`,
        chips: ["CRM externo", "Caja", "Matrículas"],
        sources: ["CRM Externo (Cobros)", "CRM Externo (Leads)"],
        confidence: 98,
      };
    }

    if (normalized.includes("sede") || normalized.includes("comparar") || normalized.includes("madrid") || normalized.includes("alcalá") || normalized.includes("majadahonda") || normalized.includes("mexico") || normalized.includes("méxico")) {
      return {
        title: "Comparativa de sedes",
        text: `${bestRevenueSede.sede} lidera ingresos con ${formatCurrency(bestRevenueSede.revenue)}. ${weakestAcademicSede.sede} requiere atención académica relativa: asistencia ${weakestAcademicSede.attendance.toFixed(0)}% y nivel ${weakestAcademicSede.skill.toFixed(1)}/10. Usaría la sede líder como patrón comercial y abriría plan de mejora para la sede débil.`,
        chips: ["Sedes", "Benchmark", "Plan de mejora"],
        sources: ["CRM Externo (Facturación)", "Aula (Asistencias)", "Benchmark General"],
        confidence: 91,
      };
    }

    if (normalized.includes("captación") || normalized.includes("crecimiento") || normalized.includes("seo") || normalized.includes("contenido") || normalized.includes("web")) {
      return {
        title: "Crecimiento y captación",
        text: `La previsión es de ${projectedEnrollments} matrículas desde ${trialClasses} clases de prueba. Hay ${publishedArticles.length} artículos publicados y ${draftArticles.length} en revisión. La oportunidad es unir contenido por disciplina, CTA de clase de prueba y tarea de seguimiento en el CRM externo a 48 horas.`,
        chips: ["Captación", "Contenido", "Conversión"],
        sources: ["Content CMS (Artículos)", "AIO Engine (Búsqueda Local)"],
        confidence: 84,
      };
    }

    const insight = matchedInsight ?? activeConsultantInsight;
    return {
      title: insight.label,
      text: `${insight.verdict} ${insight.evidence} Oportunidad: ${insight.opportunity} Siguiente acción: ${insight.next}`,
      chips: ["Diagnóstico", "Evidencia", "Acción"],
      sources: ["Diagnóstico de Operación", "Modelos Predictivos JANA"],
      confidence: 85,
    };
  };

  const sendConsultantQuery = (query: string, id?: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    if (id) setActiveConsultantQuestion(id);

    const answer = buildConsultantAnswer(cleanQuery);
    setConsultantMessages((prev) => [
      ...prev,
      {
        id: `consultant-user-${Date.now()}`,
        role: "user",
        text: cleanQuery,
      },
      {
        id: `consultant-assistant-${Date.now()}`,
        role: "assistant",
        title: answer.title,
        text: answer.text,
        chips: answer.chips,
        sources: answer.sources,
        confidence: answer.confidence,
      },
    ]);
    setConsultantInput("");
  };

  const handleConsultantSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendConsultantQuery(consultantInput);
  };

  return (
    <div className="dashboard-canvas space-y-5">
      <section className="overflow-hidden rounded-2xl border border-border bg-surface/92">
        <div className="grid gap-5 p-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-jana-primary-accessible">Cockpit de Dirección</p>
                <h2 className="mt-2 font-heading text-3xl font-black leading-tight md:text-4xl">
                  Estado ejecutivo {scopeLabel === GLOBAL_SCOPE ? "Global" : `de ${scopeLabel}`}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground-muted">
                  Una lectura unificada de negocio, aula, talento, contenido y operación para decidir qué necesita atención hoy.
                </p>
              </div>
              <div className="rounded-xl border border-jana-primary/25 bg-jana-primary/10 p-4 text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Health score</p>
                <p className="font-mono text-5xl font-black text-jana-primary-accessible">{healthScore}</p>
                <p className="text-[10px] text-foreground-muted">sobre 100 · actualizado ahora</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {[
                { label: "Ingresos cobrados", value: formatCurrency(completedRevenue), detail: `${formatCurrency(pendingRevenue)} pendiente`, tone: "text-talent" },
                { label: "Alumnos activos", value: selectedStudents.length.toString(), detail: `${riskStudents.length} en seguimiento`, tone: "text-foreground" },
                { label: "Asistencia media", value: `${avgAttendance.toFixed(0)}%`, detail: `nivel ${avgSkill.toFixed(1)}/10`, tone: "text-brain" },
                { label: "Captación prevista", value: projectedEnrollments.toString(), detail: `${trialClasses} pruebas · ${conversionRate}% conv.`, tone: "text-jana-primary-accessible" },
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
          </div>

          <Card className="rounded-xl border-border bg-black/20">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-3 text-base font-black">
                Agenda directiva
                <span className={cn("rounded-md border px-2 py-1 text-[10px] font-black", operationalAlerts ? "border-warning/25 bg-warning/10 text-warning" : "border-success/25 bg-success/10 text-success")}>
                  {operationalAlerts} señales
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedActions.map((action) => (
                <div key={action.title} className={cn("rounded-lg border p-3", toneClass[action.tone])}>
                  <p className="text-xs font-black text-foreground">{action.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-foreground-muted">{action.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.22fr)_minmax(340px,0.52fr)_minmax(340px,0.52fr)] 2xl:items-start">
        <section className="min-w-0">
        <Card className="overflow-hidden rounded-2xl border-border bg-surface/92">
          <CardHeader className="border-b border-border p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-black">
                  <Brain className="size-5 text-brain" />
                  Consultor de Dirección
                </CardTitle>
                <p className="mt-2 max-w-3xl text-xs leading-relaxed text-foreground-muted">
                  Chat ejecutivo con datos importados del CRM existente, caja, sedes, Aula, Talent Graph, contenidos y operación. Pregunta libremente o usa una pregunta crítica.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-right">
                {[
                  ["Health", healthScore],
                  ["Alertas", operationalAlerts],
                  ["Pipeline", projectedEnrollments],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-border bg-black/15 px-3 py-2">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="font-mono text-lg font-black text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-0 p-0 xl:grid-cols-[1fr_320px] 2xl:grid-cols-1">
            <div className="flex min-h-[520px] flex-col 2xl:min-h-[560px]">
              <div className="border-b border-border p-4">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {consultantQuestions.map((question) => (
                    <button
                      key={question.id}
                      type="button"
                      onClick={() => sendConsultantQuery(question.label, question.id)}
                      className={cn(
                        "shrink-0 rounded-full border px-3 py-2 text-[11px] font-black transition",
                        activeConsultantQuestion === question.id
                          ? "border-brain bg-brain/12 text-foreground"
                          : "border-border bg-black/15 text-foreground-muted hover:bg-surface-elevated/50 hover:text-foreground"
                      )}
                    >
                      {question.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-black/10 p-5">
                {consultantMessages.map((message) => {
                  const isUser = message.role === "user";
                  return (
                    <div key={message.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[86%] rounded-2xl border px-4 py-3 text-sm leading-relaxed",
                        isUser
                          ? "border-jana-primary/20 bg-jana-primary text-primary-foreground"
                          : "border-border bg-surface-elevated text-foreground"
                      )}>
                        {message.title && (
                          <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-brain">{message.title}</p>
                        )}
                        <p>{message.text}</p>
                        {message.chips && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {message.chips.map((chip) => (
                              <span key={chip} className="rounded-full border border-border bg-black/20 px-2 py-0.5 text-[10px] font-bold text-foreground-muted">
                                {chip}
                              </span>
                            ))}
                          </div>
                        )}
                        {!isUser && (message.sources || message.confidence !== undefined) && (
                          <div className="mt-3 pt-2 border-t border-border/40 flex flex-col gap-2 text-[10px]">
                            {message.sources && (
                              <div className="flex flex-wrap gap-1 items-center">
                                <span className="text-muted-foreground font-semibold">Fuentes:</span>
                                {message.sources.map((src) => (
                                  <span key={src} className="text-[9px] bg-black/30 border border-border/40 text-foreground-muted px-1.5 py-0.5 rounded">
                                    {src}
                                  </span>
                                ))}
                              </div>
                            )}
                            {message.confidence !== undefined && (
                              <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground font-semibold text-[10px]">Confianza:</span>
                                <div className="flex items-center gap-1 flex-1">
                                  <div className="h-1.5 w-16 rounded-full bg-black/40 overflow-hidden border border-border/20">
                                    <div 
                                      className={cn(
                                        "h-full rounded-full transition-all",
                                        message.confidence >= 90 ? "bg-success" : message.confidence >= 75 ? "bg-warning" : "bg-error"
                                      )}
                                      style={{ width: `${message.confidence}%` }}
                                    />
                                  </div>
                                  <span className="font-mono font-bold text-[9px]">{message.confidence}%</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleConsultantSubmit} className="border-t border-border bg-surface p-4">
                <div className="flex gap-2">
                  <Input
                    value={consultantInput}
                    onChange={(event) => setConsultantInput(event.target.value)}
                    placeholder="Pregunta: ¿qué alumnos afectan a retención?, ¿qué sede tiene más oportunidad?, ¿qué cobros priorizo?"
                    className="h-12 flex-1 rounded-xl bg-black/20 text-sm"
                  />
                  <Button type="submit" className="h-12 rounded-xl bg-jana-primary px-5 hover:bg-jana-primary-hover">
                    <Send className="size-4" />
                  </Button>
                </div>
              </form>
            </div>

            <aside className="border-t border-border bg-black/15 p-5 xl:border-l xl:border-t-0 2xl:hidden">
              <div className="rounded-xl border border-brain/25 bg-brain/10 p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-brain" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-brain">Señales proactivas</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
                  El consultor prioriza señales cruzadas entre CRM externo, captación, aula y capacidad docente.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                {proactiveSignals.map((signal) => (
                  <div key={signal.label} className={cn("rounded-xl border p-3", toneClass[signal.tone])}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{signal.label}</p>
                        <p className="mt-2 text-sm font-black text-foreground">{signal.value}</p>
                      </div>
                      <Activity className="size-4 shrink-0 opacity-70" />
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-foreground-muted">{signal.detail}</p>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-4 h-11 w-full rounded-xl text-xs"
                onClick={() => sendConsultantQuery("Dame el resumen ejecutivo accionable de la sede")}
              >
                Generar resumen ejecutivo
              </Button>
            </aside>
          </CardContent>
        </Card>
      </section>

      <section className="grid min-w-0 gap-5">
        <Card className="hidden rounded-xl border-border bg-surface/90 2xl:block">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-black">
              <Sparkles className="size-4 text-brain" />
              Señales proactivas
            </CardTitle>
            <p className="text-xs text-foreground-muted">Cruce entre CRM externo, captación, aula y capacidad docente.</p>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {proactiveSignals.map((signal) => (
              <div key={signal.label} className={cn("rounded-xl border p-3", toneClass[signal.tone])}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{signal.label}</p>
                    <p className="mt-2 text-sm font-black text-foreground">{signal.value}</p>
                  </div>
                  <Activity className="size-4 shrink-0 opacity-70" />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-foreground-muted">{signal.detail}</p>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full rounded-xl text-xs"
              onClick={() => sendConsultantQuery("Dame el resumen ejecutivo accionable de la sede")}
            >
              Generar resumen ejecutivo
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Comparativa de sedes</CardTitle>
            <p className="text-xs text-foreground-muted">Ingresos, alumnado y salud académica para priorizar atención directiva.</p>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {sedeSummaries.map((summary) => (
              <button
                key={summary.sede}
                type="button"
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition",
                  !isGlobalScope && summary.sede === activeSede ? "border-jana-primary bg-jana-primary/8" : "border-border bg-black/15 hover:bg-surface-elevated/40"
                )}
              >
                <div className="grid gap-4 md:grid-cols-[190px_1fr_90px_90px] md:items-center">
                  <div>
                    <p className="font-bold text-foreground">{summary.sede}</p>
                    <p className="text-[10px] text-muted-foreground">{summary.students} alumnos · {formatCurrency(summary.pending)} pendiente</p>
                  </div>
                  <div>
                    <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>{formatCurrency(summary.revenue)}</span>
                      <span>{Math.round((summary.revenue / maxRevenue) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-elevated">
                      <div className="h-full rounded-full bg-jana-primary" style={{ width: `${Math.max(8, (summary.revenue / maxRevenue) * 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-black text-brain">{summary.attendance.toFixed(0)}%</p>
                    <p className="text-[10px] text-muted-foreground">asistencia</p>
                  </div>
                  <div>
                    <p className="font-mono text-lg font-black text-talent">{summary.skill.toFixed(1)}</p>
                    <p className="text-[10px] text-muted-foreground">nivel</p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Presión por disciplina</CardTitle>
            <p className="text-xs text-foreground-muted">Dónde puede faltar capacidad docente o grupo específico.</p>
          </CardHeader>
          <CardContent className="space-y-3 p-5">
            {disciplinePressure.map((item) => (
              <div key={item.discipline} className="rounded-lg border border-border bg-black/15 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground">{item.discipline}</p>
                  <span style={{ color: item.color }} className="font-mono text-xs font-black">{item.count} alumnos</span>
                </div>
                <div className="h-2 rounded-full bg-surface-elevated">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, item.ratio * 18)}%`, backgroundColor: item.color }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid min-w-0 gap-5">
        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Alumnos en seguimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5 p-4">
            {riskStudents.slice(0, 5).map(({ student, avgSkill: skill, churnScore, hasDebt }) => (
              <div key={student.id} className="rounded-lg border border-border bg-black/15 p-3 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground">{student.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Asistencia: {student.attendance}% · Nivel: {skill.toFixed(1)}/10
                    </p>
                    {hasDebt && (
                      <span className="inline-block mt-1 text-[9px] text-error font-bold uppercase tracking-wider">
                        ⚠️ Impago en CRM
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className={cn(
                      "rounded-md border px-2 py-0.5 text-[9px] font-mono font-bold block",
                      churnScore >= 60 ? "border-error/25 bg-error/10 text-error" : 
                      churnScore >= 35 ? "border-warning/25 bg-warning/10 text-warning" : 
                      "border-success/25 bg-success/10 text-success"
                    )}>
                      Riesgo: {churnScore}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {riskStudents.length === 0 && <p className="text-xs text-muted-foreground">Sin alumnos en riesgo de abandono.</p>}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Operación y cumplimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {[
              ["Incidencias CRM", verifactuErrors.length, verifactuErrors.length ? "text-error" : "text-success"],
              ["Docentes sobre 100h", overloadedTeachers.length, overloadedTeachers.length ? "text-warning" : "text-success"],
              ["Artículos en revisión", draftArticles.length, draftArticles.length ? "text-brain" : "text-success"],
              ["Publicados activos", publishedArticles.length, "text-jana-primary-accessible"],
            ].map(([label, value, color]) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-black/15 px-3 py-2">
                <span className="text-xs text-foreground-muted">{label}</span>
                <span className={cn("font-mono text-lg font-black", color as string)}>{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader className="border-b border-border pb-3">
            <CardTitle className="text-base font-black">Embudo de captación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {[
              ["Leads web", leads, 100],
              ["Clases de prueba", trialClasses, leads ? Math.round((trialClasses / leads) * 100) : 0],
              ["Matrículas previstas", projectedEnrollments, leads ? Math.round((projectedEnrollments / leads) * 100) : 0],
            ].map(([label, value, percent]) => (
              <div key={label as string}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{label}</span>
                  <span className="font-mono font-black text-jana-primary-accessible">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-surface-elevated">
                  <div className="h-full rounded-full bg-jana-primary" style={{ width: `${percent}%` }} />
                </div>
              </div>
            ))}
            <p className="rounded-lg border border-border bg-black/15 p-3 text-[11px] leading-relaxed text-foreground-muted">
              Recomendación: reforzar CTA de clase de prueba en las páginas de Canto e Interpretación de {isGlobalScope ? "las sedes con menor conversión" : activeSede}.
            </p>
          </CardContent>
        </Card>
      </section>
      </div>
    </div>
  );
}

/* 0.5 TEACHER COCKPIT (Daily Teaching Command Center) */

