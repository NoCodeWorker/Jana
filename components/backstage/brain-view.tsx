"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Lock, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { JanaRole } from "@/lib/jana-auth";
export function BrainView({ activeRole, activeSede, onNavigate }: { activeRole: JanaRole; activeSede: string; onNavigate: (tab: string) => void }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // ─── Role-aware configuration ───────────────────────────────────────────────
  const roleConfig: Record<JanaRole, {
    placeholder: string;
    hint: string;
    suggestions: string[];
    label: string;
    color: string;
  }> = {
    direccion: {
      placeholder: "Busca por finanzas, alumnos, producciones, sede, profesorado...",
      hint: "Prueba: 'ingresos Q2 Madrid Sede Central' o 'rendimiento profesorado Alcalá'",
      suggestions: ["Ingresos Q2 Madrid Sede Central", "Tasa de morosidad Alcalá", "Contratos de alquiler Majadahonda", "Rendimiento profesorado", "Alumnos por disciplina"],
      label: "Dirección",
      color: "#7c5cff",
    },
    admin: {
      placeholder: "Busca por matrículas, pagos, contratos, espacios, asistencia...",
      hint: "Prueba: 'alumnos pendientes de pago' o 'contratos sala escénica'",
      suggestions: ["Alumnos morosos junio", "Contrato sala escénica", "Incidencias de matrícula", "Aulas disponibles", "Gestión de horarios"],
      label: "Administración",
      color: "#f5b74f",
    },
    profesor: {
      placeholder: "Prepara clases, revisa alumnos, genera feedback o consulta metodologías...",
      hint: "Prueba: 'prepárame la clase de canto de hoy' o 'feedback para Mateo Rodríguez'",
      suggestions: ["Preparar clase de canto 1ºA", "Feedback para Mateo Rodríguez", "Metodología expresión corporal", "Alumnos con seguimiento pendiente", "Próximo ensayo general"],
      label: "Profesorado",
      color: "#1fbf75",
    },
    alumno: {
      placeholder: "Busca por mis notas, próximas clases, metodologías, recursos...",
      hint: "Prueba: 'mis notas de danza' o 'próximas actuaciones'",
      suggestions: ["Mis notas este trimestre", "Próximas actuaciones", "Guía de técnica vocal", "Mis clases esta semana", "Recursos de expresión corporal"],
      label: "Alumno/a",
      color: "#ec690c",
    },
  };

  const cfg = roleConfig[activeRole];

  // ─── RAG role-aware responses ────────────────────────────────────────────────
  const getRagResponse = (): React.ReactNode => {
    const q = query.toLowerCase();
    const isFinancialQuery = q.includes("ingreso") || q.includes("finanzas") || q.includes("margen") || q.includes("q2") || q.includes("pago") || q.includes("moroso") || q.includes("factura") || q.includes("completado") || q.includes("ingresos");

    if ((activeRole === "profesor" || activeRole === "alumno") && isFinancialQuery) {
      return (
        <div className="flex items-start gap-3 text-error bg-error/10 border border-error/20 rounded-lg p-4">
          <Lock className="size-5 shrink-0 mt-0.5 text-error" />
          <div>
            <p className="font-bold text-xs uppercase tracking-wider text-error">Acceso restringido</p>
            <p className="text-xs mt-1 text-foreground-muted">Tu rol de {activeRole === "profesor" ? "Profesorado" : "Alumnado"} no tiene permisos para consultar información financiera, facturas o márgenes comerciales de la sede.</p>
          </div>
        </div>
      );
    }

    if (activeRole === "alumno") {
      if (q.includes("nota") || q.includes("danza") || q.includes("canto"))
        return <p>Según tu expediente de este trimestre: <strong>Danza 8.5/10 · Canto 7.8/10</strong>. Tu profesora ha anotado que tienes buena proyección vocal. Se recomienda practicar el control de aire en frases largas.</p>;
      if (q.includes("actuac") || q.includes("próxim") || q.includes("proxim"))
        return <p>Tienes registrada una <strong>actuación en el Auditorio Madrid Sede Central el 20 de junio</strong>. El ensayo general será el 17 de junio a las 17:00h. Contacta con tu profesor para confirmar el repertorio.</p>;
      // Generic fallback — show the actual resources found
      return (
        <div className="space-y-3">
          <p>He procesado tu consulta en <strong>{activeSede}</strong>. Aquí están los recursos disponibles para tu rol:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { title: "Guía de Técnica Vocal Nivel Inicial", type: "Recurso pedagógico", tag: "PUBLIC" },
              { title: "Metodología: Focos Escénicos", type: "Recurso pedagógico", tag: "PUBLIC" },
              { title: "Mis Notas - Trimestre 2", type: "Expediente personal", tag: "PERSONAL" },
            ].map((doc) => (
              <div key={doc.title} className="rounded-lg border border-border bg-surface/60 p-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">{doc.title}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{doc.type}</p>
                </div>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold ${
                  doc.tag === "PERSONAL" ? "bg-jana-primary/15 text-jana-primary-accessible" : "bg-success/15 text-success"
                }`}>{doc.tag}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeRole === "profesor") {
      if (q.includes("nota") || q.includes("canto") || q.includes("sofía") || q.includes("sofia"))
        return <p>Alumna <strong>Sofía García (Madrid Sede Central)</strong> ha consolidado un <strong>8.5/10</strong> en afinación y respiración lírica. Se aconseja agendar un ensayo focalizado para reforzar su timbre vocal en el registro agudo.</p>;
      if (q.includes("preparar") || q.includes("clase"))
        return <p>Clase sugerida para <strong>Canto 1ºA</strong>: 8 minutos de activación respiratoria, 12 minutos de sirenas en registro medio, trabajo por parejas sobre afinación y cierre con feedback individual a los alumnos con asistencia irregular.</p>;
      if (q.includes("feedback"))
        return <p>Feedback propuesto para <strong>Mateo Rodríguez</strong>: buena implicación y escucha escénica. Próximo objetivo: fijar la coreografía del Acto II con marcas claras de entrada, mirada y respiración antes de cada frase.</p>;
      if (q.includes("mateo") || q.includes("rodriguez"))
        return <p>Alumno <strong>Mateo Rodríguez</strong>: asistencia del 88%, buena actitud en ensayos. Última evaluación: <strong>Interpretación 7.2/10</strong>. Pendiente de revisión de la coreografía del Acto II.</p>;
      if (q.includes("metodolog") || q.includes("expresi"))
        return <p>La <strong>Metodología de Expresión Corporal JANA</strong> recomienda comenzar con ejercicios de raíz para 1ºA antes de la dirección escénica. El documento completo está disponible en el repositorio de recursos pedagógicos.</p>;
      if (q.includes("abandon") || q.includes("riesgo"))
        return <p>Se han detectado <strong>3 alumnos con riesgo de abandono</strong> en tu sede este trimestre: asistencia inferior al 70% y sin respuesta a las notificaciones. Se recomienda contactar con sus familias esta semana.</p>;
      return <p>He procesado tu consulta en <strong>{activeSede}</strong>. He recuperado notas, fichas de alumnos y metodologías autorizadas para tu rol de profesorado.</p>;
    }

    if (activeRole === "admin") {
      if (q.includes("moroso") || q.includes("pago") || q.includes("pendiente"))
        return <p>En la sede <strong>Alcalá de Henares</strong> hay <strong>4 alumnos con pagos pendientes</strong> en junio según datos importados del CRM existente. JANA OS no modifica el CRM: te indica la prioridad y deriva la excepción al responsable administrativo.</p>;
      if (q.includes("contrato") || q.includes("sala") || q.includes("espacio"))
        return <p>El <strong>contrato de alquiler de la Sala Roja (Majadahonda)</strong> vence el 30 de agosto. La fianza está depositada. Se recomienda iniciar la renovación antes del 1 de julio para asegurar fechas de producción de septiembre.</p>;
      return <p>He procesado tu consulta administrativa en <strong>{activeSede}</strong>. He recuperado 3 documentos de gestión autorizados para tu rol de administración.</p>;
    }

    // direccion
    if (q.includes("ingreso") || q.includes("finanzas") || q.includes("margen") || q.includes("q2")) {
      const financeBySede: Record<string, { revenue: string; margin: string; delinquency: string; trend: string }> = {
        "Madrid Sede Central": { revenue: "340€", margin: "24%", delinquency: "1.8%", trend: "+11% frente al Q1" },
        "Alcalá de Henares": { revenue: "195€", margin: "19%", delinquency: "3.4%", trend: "estable frente al Q1" },
        Majadahonda: { revenue: "95€", margin: "21%", delinquency: "2.9%", trend: "+8% frente al Q1" },
      };
      const finance = financeBySede[activeSede] ?? financeBySede["Madrid Sede Central"];
      return <p>Resumen Q2 sede <strong>{activeSede}</strong>: ingresos registrados <strong>{finance.revenue}</strong>, margen estimado del <strong>{finance.margin}</strong> y morosidad del <strong>{finance.delinquency}</strong>. Tendencia: <strong>{finance.trend}</strong>.</p>;
    }
    if (q.includes("profesorado") || q.includes("rendimiento"))
      return <p>El profesorado de <strong>Madrid Sede Central</strong> tiene una valoración media de <strong>4.7/5</strong> según encuestas de alumnos. 2 docentes tienen más de 25 horas acumuladas este mes y podrían acceder al complemento salarial según convenio.</p>;
    return <p>He procesado tu consulta directiva en <strong>{activeSede}</strong>. Tienes acceso completo a todos los documentos de la sede: financieros, pedagógicos, administrativos y de RRHH.</p>;
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1400);
  };

  const responsePlan = {
    scope: `${cfg.label} · ${activeSede}`,
    confidence: activeRole === "direccion" ? "Alta" : activeRole === "admin" ? "Media-alta" : "Contextual",
    sourceLabel: activeRole === "direccion" ? "Dirección, aula y operación" : activeRole === "admin" ? "Administración y sede" : activeRole === "profesor" ? "Aula y metodología" : "Mi expediente y recursos",
    nextActions: activeRole === "direccion"
      ? ["Revisar impacto por sede", "Abrir panel financiero", "Crear tarea de seguimiento"]
      : activeRole === "admin"
      ? ["Revisar cobros pendientes", "Actualizar contrato o incidencia", "Notificar a dirección"]
      : activeRole === "profesor"
      ? ["Registrar observación", "Actualizar Talent Graph", "Preparar feedback para familia"]
      : ["Marcar recurso como leído", "Guardar recomendación", "Consultar próxima clase"],
  };

  return (
    <div className="dashboard-canvas space-y-5">
      <Card className="overflow-hidden rounded-xl border-border bg-surface/92">
        <div className="border-b border-border bg-surface-elevated/40 px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: cfg.color + "18", color: cfg.color }} className="flex size-10 items-center justify-center rounded-lg">
                  <Brain className="size-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Backstage Brain</p>
                  <CardTitle className="text-xl font-black leading-tight">Consulta segura por rol y sede</CardTitle>
                </div>
              </div>
              <p className="max-w-2xl text-xs leading-relaxed text-foreground-muted">
                Pregunta en lenguaje natural y recibe una respuesta accionable adaptada a tu rol, sede y contexto operativo.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-black/20 px-4 py-3 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Modo de respuesta</p>
              <p style={{ color: cfg.color }} className="mt-1 text-sm font-black">{responsePlan.sourceLabel}</p>
              <p className="mt-1 text-[10px] text-foreground-muted">{responsePlan.scope}</p>
            </div>
          </div>
        </div>

        <CardContent className="space-y-5 p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={cfg.placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-13 rounded-lg border-border bg-black/20 pl-11 text-sm font-medium"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch} className="h-13 rounded-lg bg-jana-primary px-5 font-bold hover:bg-jana-primary-hover">
                  Consultar
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cfg.suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setQuery(s); }}
                    style={{ borderColor: cfg.color + "33", color: cfg.color }}
                    className="rounded-md border bg-surface-elevated/40 px-3 py-1.5 text-[11px] font-semibold transition hover:bg-surface-elevated"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-border bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <span style={{ color: cfg.color, borderColor: cfg.color + "44", backgroundColor: cfg.color + "14" }}
                  className="rounded-md border px-2 py-1 text-[10px] font-black">
                  {cfg.label}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">{activeSede}</span>
              </div>
              <div className="mt-3 space-y-2 text-[11px] text-foreground-muted">
                <p className="font-semibold text-foreground">Qué puedes pedir</p>
                <p>{cfg.hint}</p>
              </div>
            </aside>
          </div>

          {query && (
            <div className="rounded-xl border border-border bg-black/25 p-4">
              {isSearching ? (
                <div className="flex items-center gap-3 text-sm font-semibold text-brain">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-brain/10">
                    <Sparkles className="size-4 animate-spin" />
                  </div>
                  Preparando la mejor respuesta posible para {cfg.label}.
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contexto usado</p>
                      <p className="mt-1 text-[11px] text-foreground-muted">
                        La respuesta se adapta a {responsePlan.scope.toLowerCase()} y prioriza información operativa antes que documentación técnica.
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {[
                        ["Alcance", responsePlan.scope],
                        ["Confianza", responsePlan.confidence],
                        ["Base", responsePlan.sourceLabel],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-lg border border-border bg-surface/60 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                          <p className="mt-2 text-xs font-black text-foreground">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <aside className="rounded-lg border border-border bg-surface/45 p-3">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Acciones sugeridas</p>
                    <div className="mt-3 space-y-2">
                      {responsePlan.nextActions.map((action) => (
                        <button
                          key={action}
                          type="button"
                          className="w-full rounded-md border border-border bg-black/15 px-3 py-2 text-left text-[11px] font-semibold text-foreground-muted transition hover:border-jana-primary/35 hover:text-foreground"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  </aside>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="rounded-xl border border-border bg-surface/70 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-lg bg-brain/10">
                <Brain className="size-7 animate-pulse text-brain" />
              </div>
              <div>
                <p className="font-semibold text-brain">Filtrando contexto autorizado para {cfg.label}</p>
                <p className="text-xs text-muted-foreground">Aplicando permisos antes de generar la respuesta.</p>
              </div>
            </div>
          </motion.div>
        ) : query ? (
          <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-surface p-5">
            <div className="flex justify-between items-start border-b border-border pb-4 flex-wrap gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Brain className="size-5 text-brain" />
                  <h3 className="font-bold">Respuesta JANA Brain</h3>
                </div>
                <p className="text-xs text-muted-foreground">Consulta: <span className="text-foreground">{query}</span></p>
              </div>
              <span className="rounded-md bg-success/15 px-2 py-1 text-[10px] font-mono font-bold text-success">Respuesta adaptada · {activeRole}</span>
            </div>
            <div className="pt-4 text-sm leading-relaxed text-foreground-muted space-y-4">
              {getRagResponse()}

              {/* Sources used — shown for every role */}
              {(() => {
                const tagDestination: Record<string, { tab: string; label: string }> = {
                  PUBLIC:       { tab: "Content", label: "Ir a Content" },
                  PERSONAL:     { tab: "Aula",    label: "Ver en Aula" },
                  RESTRICTED:   { tab: "Aula",    label: "Ver en Aula" },
                  CONFIDENTIAL: { tab: "Panel",   label: "Ir a Panel" },
                  INTERNAL:     { tab: "Panel",   label: "Ir a Panel" },
                };
                const tagColor: Record<string, string> = {
                  PUBLIC: "bg-success/15 text-success",
                  PERSONAL: "bg-jana-primary/15 text-jana-primary-accessible",
                  RESTRICTED: "bg-warning/15 text-warning",
                  CONFIDENTIAL: "bg-error/15 text-error",
                  INTERNAL: "bg-info/15 text-info",
                };
                const docsByRole: Record<JanaRole, { title: string; sede: string; tag: string }[]> = {
                  alumno: [
                    { title: "Guía de Técnica Vocal Nivel Inicial", sede: activeSede, tag: "PUBLIC" },
                    { title: "Metodología: Focos Escénicos",        sede: activeSede, tag: "PUBLIC" },
                    { title: "Mis Notas - Trimestre 2",              sede: activeSede, tag: "PERSONAL" },
                  ],
                  profesor: [
                    { title: "Evaluaciones Trimestrales Canto - 1ºA", sede: activeSede, tag: "RESTRICTED" },
                    { title: "Ficha Alumno - Mateo Rodríguez",         sede: activeSede, tag: "RESTRICTED" },
                    { title: "Guía de Técnica Vocal Nivel Inicial",     sede: activeSede, tag: "PUBLIC" },
                    { title: "Metodología: Focos Escénicos",            sede: activeSede, tag: "PUBLIC" },
                  ],
                  admin: [
                    { title: "Lista Alumnos Morosos Junio",  sede: activeSede, tag: "CONFIDENTIAL" },
                    { title: "Contrato Alquiler Sala Escénica", sede: activeSede, tag: "INTERNAL" },
                    { title: "Guía de Técnica Vocal Nivel Inicial", sede: activeSede, tag: "PUBLIC" },
                  ],
                  direccion: [
                    { title: "Mapeo Financiero y Margen Q2",           sede: activeSede, tag: "CONFIDENTIAL" },
                    { title: "Lista Alumnos Morosos Junio",             sede: activeSede, tag: "CONFIDENTIAL" },
                    { title: "Contrato Alquiler Sala Escénica",          sede: activeSede, tag: "INTERNAL" },
                    { title: "Evaluaciones Trimestrales Canto - 1ºA",   sede: activeSede, tag: "RESTRICTED" },
                    { title: "Ficha Alumno - Mateo Rodríguez",           sede: activeSede, tag: "RESTRICTED" },
                    { title: "Guía de Técnica Vocal Nivel Inicial",       sede: activeSede, tag: "PUBLIC" },
                    { title: "Metodología: Focos Escénicos",              sede: activeSede, tag: "PUBLIC" },
                  ],
                };
                const docs = docsByRole[activeRole] ?? [];
                return (
                  <div className="border-t border-border/50 pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fuentes utilizadas · pulsa para navegar</p>
                      <span className="rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">{docs.length} fuentes</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {docs.map((doc) => {
                        const dest = tagDestination[doc.tag];
                        return (
                          <button
                            key={doc.title}
                            type="button"
                            onClick={() => dest && onNavigate(dest.tab)}
                            className="group rounded-lg border border-border bg-surface/50 p-3 text-left flex items-start justify-between gap-2 transition hover:border-jana-primary/40 hover:bg-accent/30"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold text-foreground">{doc.title}</p>
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${tagColor[doc.tag] ?? "bg-surface text-muted-foreground"}`}>{doc.tag}</span>
                                {dest && (
                                  <span className="text-[10px] text-muted-foreground group-hover:text-jana-primary transition">
                                    {dest.label} →
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface/30 p-10 text-center">
            <div style={{ backgroundColor: cfg.color + "15" }} className="mx-auto flex size-12 items-center justify-center rounded-lg">
              <Brain style={{ color: cfg.color }} className="size-6" />
            </div>
            <p className="mt-3 text-sm font-semibold">Realiza una consulta segura</p>
            <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{cfg.hint}</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

