"use client";

import { useEffect, useMemo, useState } from "react";
import { Newspaper, Sparkles, Trash2 } from "lucide-react";
import { ContentArticle, useMockData } from "@/components/mock-data-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";
export function ContentView({ activeRole, activeSede }: { activeRole: JanaRole; activeSede: string }) {
  const {
    contentArticles,
    contentNotifications,
    generateContentArticle,
    updateContentArticle,
    publishContentArticle,
    deleteContentArticle,
    markContentNotificationRead,
  } = useMockData();

  const [topic, setTopic] = useState("cómo mejorar la presencia escénica antes de una audición");
  const [selectedArticleId, setSelectedArticleId] = useState(contentArticles[0]?.id ?? "");
  const [seoTab, setSeoTab] = useState<"meta" | "jsonld">("meta");

  const classroomMilestones = [
    { id: "m1", title: "Estreno de escena teatral en Majadahonda", desc: "Clase de Teatro Musical ensayando transición hablada a canto.", sede: "Majadahonda", topic: "transición fluida entre diálogo y canto en teatro musical Majadahonda" },
    { id: "m2", title: "Prueba colectiva superada en Danza Alcalá", desc: "Clase de Danza Contemporánea dominando la coordinación de ritmos.", sede: "Alcalá de Henares", topic: "ejercicios prácticos de coordinación y ritmo para danza Alcalá de Henares" },
    { id: "m3", title: "Técnica vocal avanzada en Madrid Sede Central", desc: "Clase de Canto 1ºA logrando soporte costo-diafragmático.", sede: "Madrid Sede Central", topic: "técnica vocal y respiración costo-diafragmática en Madrid Sede Central" },
  ];

  const getJsonLd = () => {
    const articleSede = selectedArticle?.sede ?? activeSede;
    const address = 
      articleSede === "Madrid Sede Central" ? { street: "Calle de Alcalá 20", city: "Madrid", zip: "28014" } :
      articleSede === "Alcalá de Henares" ? { street: "Calle Mayor 12", city: "Alcalá de Henares", zip: "28801" } :
      { street: "Calle Gran Vía 5", city: "Majadahonda", zip: "28220" };

    return JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LocalBusiness",
          "@id": `https://jana.es/sedes/${articleSede.toLowerCase().replace(/\s+/g, "-")}#localbusiness`,
          "name": `JANA Escuela de Artes Escénicas - ${articleSede}`,
          "image": `https://jana.es/images/sedes/${articleSede.toLowerCase().replace(/\s+/g, "-")}.webp`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": address.street,
            "addressLocality": address.city,
            "postalCode": address.zip,
            "addressCountry": "ES"
          },
          "telephone": "+34910000000",
          "priceRange": "$$"
        },
        {
          "@type": "FAQPage",
          "@id": `https://jana.es/sedes/${articleSede.toLowerCase().replace(/\s+/g, "-")}#faq`,
          "mainEntity": [
            {
              "@type": "Question",
              "name": `¿Cómo mejorar en ${selectedArticle?.topic || "artes escénicas"} en ${articleSede}?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": selectedArticle?.aioSummary || `Siguiendo la metodología JANA en la sede de ${articleSede}.`
              }
            }
          ]
        }
      ]
    }, null, 2);
  };

  const [autoGenActive, setAutoGenActive] = useState(false);
  const [genLogs, setGenLogs] = useState<string[]>([
    "Generador en espera. Actívalo para simular indexación continua."
  ]);

  const autoTopics = useMemo(() => [
    { topic: "respiración costo-diafragmática en Majadahonda", author: "Sofía Blanco", sede: "Majadahonda" },
    { topic: "Stanislavski y memoria emotiva en Madrid Sede Central", author: "Carlos Gómez", sede: "Madrid Sede Central" },
    { topic: "coordinación motora en danza clásica en Alcalá", author: "María Ortega", sede: "Alcalá de Henares" },
    { topic: "ejercicios SOVTE para cantantes de musicales", author: "Elena Ruiz", sede: "Madrid Sede Central" },
    { topic: "improvisación y tolerancia a la frustración", author: "Carlos Gómez", sede: "Alcalá de Henares" },
    { topic: "beneficios metabólicos del claqué en Majadahonda", author: "Sofía Blanco", sede: "Majadahonda" }
  ], []);

  useEffect(() => {
    if (!autoGenActive) return;

    let index = 0;
    
    setGenLogs(prev => [
      `[${new Date().toLocaleTimeString("es-ES")}] 🔄 Iniciando motor de autogeneración JANA Brain...`,
      ...prev.slice(0, 15)
    ]);

    const interval = setInterval(() => {
      const item = autoTopics[index % autoTopics.length];
      const nowStr = new Date().toLocaleTimeString("es-ES");
      
      setGenLogs(prev => [
        `[${nowStr}] 🧠 Analizando tendencias de búsqueda local en ${item.sede} para tema: "${item.topic}"...`,
        ...prev.slice(0, 15)
      ]);

      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString("es-ES");
        generateContentArticle(item.topic, item.author, item.sede);
        setGenLogs(prev => [
          `[${timestamp}] ✍️ Borrador generado: "Guía docente: ${item.topic.charAt(0).toUpperCase() + item.topic.slice(1)}"`,
          ...prev.slice(0, 15)
        ]);
      }, 2000);

      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString("es-ES");
        setGenLogs(prev => [
          `[${timestamp}] 🚀 Indexando metadatos para optimizadores AIO (Google Gemini / Perplexity) y GEO-targets...`,
          ...prev.slice(0, 15)
        ]);
      }, 4500);

      index++;
    }, 9000);

    return () => clearInterval(interval);
  }, [autoGenActive, autoTopics, generateContentArticle]);

  const forcePublishCycle = () => {
    const item = autoTopics[Math.floor(Math.random() * autoTopics.length)];
    const nowStr = new Date().toLocaleTimeString("es-ES");
    
    setGenLogs(prev => [
      `[${nowStr}] 🚀 [LOTE FORZADO] Creando y publicando artículo de impacto inmediato...`,
      ...prev.slice(0, 15)
    ]);

    generateContentArticle(item.topic, item.author, item.sede);

    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString("es-ES");
      setGenLogs(prev => [
        `[${timestamp}] 📈 Indexando palabras clave en mapas de Google (GEO)...`,
        `[${timestamp}] 🔗 Enlazando con Comunidad > Noticias de la Landing Page pública...`,
        ...prev.slice(0, 15)
      ]);
    }, 1500);
  };

  useEffect(() => {
    if (!selectedArticleId && contentArticles.length > 0) {
      setSelectedArticleId(contentArticles[0].id);
    }
  }, [contentArticles, selectedArticleId]);

  const selectedArticle = contentArticles.find(article => article.id === selectedArticleId) ?? contentArticles[0];
  const publishedArticles = contentArticles.filter(article => article.status === "publicado");
  const draftArticles = contentArticles.filter(article => article.status !== "publicado");
  const unreadNotifications = contentNotifications.filter(notification => !notification.read).length;
  const canCreate = activeRole === "profesor" || activeRole === "direccion";
  const canPublish = activeRole === "profesor" || activeRole === "direccion";

  useEffect(() => {
    if (activeRole === "alumno" && selectedArticleId) {
      const relatedNotifs = contentNotifications.filter(n => n.articleId === selectedArticleId && !n.read);
      relatedNotifs.forEach(n => markContentNotificationRead(n.id));
    }
  }, [selectedArticleId, activeRole, contentNotifications, markContentNotificationRead]);

  const statusLabel: Record<ContentArticle["status"], string> = {
    borrador_ia: "Borrador IA",
    revision_profesor: "Revisión docente",
    publicado: "Publicado",
  };

  const statusClass: Record<ContentArticle["status"], string> = {
    borrador_ia: "text-brain bg-brain/12 border-brain/25",
    revision_profesor: "text-warning bg-warning/12 border-warning/25",
    publicado: "text-success bg-success/12 border-success/25",
  };

  if (activeRole === "alumno") {
    return (
      <div className="dashboard-canvas space-y-5">
        {/* Header */}
        <div className="rounded-xl border border-border bg-surface/90 px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recursos Pedagógicos</p>
            <h2 className="text-xl font-black">Biblioteca de Recursos</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Artículos de técnica, expresión e interpretación publicados por el profesorado</p>
          </div>
          <span className="rounded-lg border border-border bg-black/20 px-3 py-2 text-xs font-bold text-muted-foreground shrink-0">
            Alumno/a · {activeSede}
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* List of articles (left 4 columns) */}
          <div className="lg:col-span-4 space-y-3">
            <Card className="rounded-xl border-border bg-surface/90 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Artículos publicados ({publishedArticles.length})</h3>
                {unreadNotifications > 0 && (
                  <span className="rounded-full bg-jana-primary text-white text-[9px] font-black px-1.5 py-0.5">
                    {unreadNotifications} nuevos
                  </span>
                )}
              </div>
              <div className="space-y-2.5">
                {publishedArticles.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">No hay artículos publicados en esta sede.</p>
                ) : (
                  publishedArticles.map(article => {
                    const isUnread = contentNotifications.some(n => n.articleId === article.id && !n.read);
                    return (
                      <button
                        key={article.id}
                        type="button"
                        onClick={() => setSelectedArticleId(article.id)}
                        className={cn(
                          "w-full rounded-xl border p-4 text-left transition relative cursor-pointer block",
                          selectedArticleId === article.id 
                            ? "border-jana-primary bg-jana-primary/8" 
                            : "border-border bg-black/15 hover:bg-surface-elevated/40",
                          isUnread && "border-jana-primary/40 bg-jana-primary/4"
                        )}
                      >
                        {isUnread && (
                          <span className="absolute top-3.5 right-3.5 flex h-2 w-2 rounded-full bg-jana-primary" />
                        )}
                        <p className="line-clamp-2 text-xs font-black text-foreground">{article.title}</p>
                        <p className="mt-2 text-[10px] text-foreground-muted leading-relaxed line-clamp-2">{article.excerpt}</p>
                        <div className="mt-3 flex items-center justify-between text-[9px] text-muted-foreground">
                          <span>{article.author}</span>
                          <span>{article.readingMinutes} min lectura</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Article preview (right 8 columns) */}
          <div className="lg:col-span-8">
            {selectedArticle ? (
              <ArticlePreview article={selectedArticle} />
            ) : (
              <Card className="rounded-xl border-border bg-surface/90 p-8 text-center text-sm text-muted-foreground">
                Selecciona un artículo de la biblioteca para leerlo.
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-canvas space-y-5">
      <div className="grid gap-5 xl:grid-cols-[360px_1fr_320px]">
        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-black">
              <Newspaper className="size-5 text-jana-primary" />
              Backstage Content
            </CardTitle>
            <p className="text-xs text-foreground-muted">
              CMS docente con agente IA para investigación, redacción y adaptación SEO/GEO/AIO.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hitos de Aula */}
            <div className="rounded-lg border border-border bg-black/20 p-3 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Hitos de Aula disponibles (RAG)
              </label>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
                {classroomMilestones.map((milestone) => (
                  <button
                    key={milestone.id}
                    type="button"
                    onClick={() => {
                      setTopic(milestone.topic);
                      setGenLogs(prev => [
                        `[${new Date().toLocaleTimeString("es-ES")}] 📍 Seleccionado hito: "${milestone.title}" para sede ${milestone.sede}.`,
                        ...prev.slice(0, 15)
                      ]);
                    }}
                    className="w-full rounded border border-border bg-surface/50 p-2 text-left hover:border-jana-primary/40 hover:bg-surface-elevated/40 transition block text-[10px]"
                  >
                    <span className="font-bold text-foreground block truncate">{milestone.title}</span>
                    <span className="text-[9px] text-muted-foreground block truncate mt-0.5">{milestone.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-black/20 p-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-heading">Orden al agente IA</label>
              <Input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="mt-2 h-11 bg-surface text-xs"
                placeholder="Tema educativo del artículo"
              />
              <Button
                disabled={!canCreate}
                onClick={() => {
                  generateContentArticle(topic, activeRole === "direccion" ? "Dirección JANA" : "Elena Ruiz", activeSede);
                }}
                className="mt-3 h-10 w-full bg-jana-primary font-bold hover:bg-jana-primary-hover text-xs"
              >
                <Sparkles className="mr-2 size-4" />
                Generar borrador IA
              </Button>
              {!canCreate && (
                <p className="mt-2 text-[10px] text-warning">Solo profesorado o dirección pueden crear artículos.</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg border border-border bg-black/20 p-2">
                <p className="font-mono text-xl font-black text-brain">{draftArticles.length}</p>
                <p className="text-[10px] text-muted-foreground">en revisión</p>
              </div>
              <div className="rounded-lg border border-border bg-black/20 p-2">
                <p className="font-mono text-xl font-black text-success">{publishedArticles.length}</p>
                <p className="text-[10px] text-muted-foreground">publicados</p>
              </div>
              <div className="rounded-lg border border-border bg-black/20 p-2">
                <p className="font-mono text-xl font-black text-jana-primary-accessible">{contentNotifications.length}</p>
                <p className="text-[10px] text-muted-foreground">avisos</p>
              </div>
            </div>

            <div className="space-y-2">
              {contentArticles.map(article => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() => setSelectedArticleId(article.id)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition",
                    selectedArticle?.id === article.id ? "border-jana-primary bg-jana-primary/8" : "border-border bg-black/15 hover:bg-surface-elevated/40"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-xs font-bold text-foreground">{article.title}</p>
                    <span className={cn("shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-black", statusClass[article.status])}>
                      {statusLabel[article.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">{article.author} · {article.sede}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-surface/90">
          <CardHeader>
            <CardTitle className="text-lg font-black">Editor docente</CardTitle>
            <p className="text-xs text-foreground-muted">
              El agente redacta y optimiza. El profesor revisa, ajusta y publica.
            </p>
          </CardHeader>
          <CardContent>
            {selectedArticle ? (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[1fr_140px]">
                  <Input
                    value={selectedArticle.title}
                    onChange={(event) => updateContentArticle(selectedArticle.id, { title: event.target.value })}
                    className="h-11 bg-black/20 font-bold"
                  />
                  <span className={cn("flex items-center justify-center rounded-lg border text-[10px] font-black", statusClass[selectedArticle.status])}>
                    {statusLabel[selectedArticle.status]}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Entradilla</label>
                  <textarea
                    value={selectedArticle.excerpt}
                    onChange={(event) => updateContentArticle(selectedArticle.id, { excerpt: event.target.value })}
                    className="mt-2 min-h-20 w-full rounded-lg border border-border bg-black/20 p-3 text-sm outline-none focus:border-jana-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Artículo</label>
                  <textarea
                    value={selectedArticle.body}
                    onChange={(event) => updateContentArticle(selectedArticle.id, { body: event.target.value })}
                    className="mt-2 min-h-64 w-full rounded-lg border border-border bg-black/20 p-3 text-sm leading-relaxed outline-none focus:border-jana-primary"
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-black/25 p-4">
                  <div className="space-y-0.5 text-left">
                    <p className="text-xs font-bold text-foreground">Visibilidad Pública</p>
                    <p className="text-[10px] text-muted-foreground">Muestra el artículo en Comunidad &gt; Noticias de la Landing Page pública.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold border",
                      selectedArticle.showOnLanding 
                        ? "text-success bg-success/10 border-success/20" 
                        : "text-info bg-info/10 border-info/20"
                    )}>
                      <span className={cn("size-1.5 rounded-full", selectedArticle.showOnLanding ? "bg-success animate-pulse" : "bg-info")} />
                      {selectedArticle.showOnLanding ? "Público en Landing" : "Privado en Aula"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedArticle.showOnLanding || false}
                        onChange={(e) => updateContentArticle(selectedArticle.id, { showOnLanding: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-jana-primary" />
                    </label>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button disabled={!canPublish || selectedArticle.status === "publicado"} onClick={() => publishContentArticle(selectedArticle.id)} className="bg-success text-white hover:bg-success/90">
                    Publicar y notificar alumnos
                  </Button>
                  <Button variant="outline" onClick={() => deleteContentArticle(selectedArticle.id)} className="gap-2 border-error/30 text-error hover:bg-error/10">
                    <Trash2 className="size-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Genera o selecciona un artículo.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-surface/90 p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pipeline IA</p>
                <h3 className="text-sm font-black font-heading mt-0.5">SEO · GEO · AIO</h3>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setSeoTab("meta")}
                  className={cn(
                    "px-2 py-1 text-[9px] font-bold rounded border transition",
                    seoTab === "meta"
                      ? "bg-jana-primary/10 border-jana-primary text-jana-primary-accessible"
                      : "bg-surface-elevated/40 border-border text-muted-foreground hover:bg-surface-elevated/60"
                  )}
                >
                  Meta
                </button>
                <button
                  type="button"
                  onClick={() => setSeoTab("jsonld")}
                  className={cn(
                    "px-2 py-1 text-[9px] font-bold rounded border transition",
                    seoTab === "jsonld"
                      ? "bg-jana-primary/10 border-jana-primary text-jana-primary-accessible"
                      : "bg-surface-elevated/40 border-border text-muted-foreground hover:bg-surface-elevated/60"
                  )}
                >
                  JSON-LD
                </button>
              </div>
            </div>

            {selectedArticle && seoTab === "meta" && (
              <>
                <div className="space-y-2 text-left">
                  <p className="text-xs font-bold text-foreground">Keywords SEO</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.seoKeywords.map(keyword => (
                      <span key={keyword} className="rounded-md border border-brain/25 bg-brain/10 px-2 py-1 text-[10px] font-semibold text-brain">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-xs font-bold text-foreground">Objetivos GEO</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.geoTargets.map(target => (
                      <span key={target} className="rounded-md border border-jana-primary/25 bg-jana-primary/10 px-2 py-1 text-[10px] font-semibold text-jana-primary-accessible">
                        {target}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-black/20 p-3 text-left">
                  <p className="text-xs font-bold text-foreground">Resumen AIO</p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground-muted">{selectedArticle.aioSummary}</p>
                </div>
              </>
            )}

            {selectedArticle && seoTab === "jsonld" && (
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Marcado AIO/GEO Estructurado</span>
                  <span className="text-[9px] text-success font-semibold flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-success animate-pulse" />
                    Validado
                  </span>
                </div>
                <div className="h-48 overflow-y-auto rounded border border-border bg-black/45 p-2 font-mono text-[9px] text-foreground-muted whitespace-pre">
                  {getJsonLd()}
                </div>
                <div className="rounded-lg border border-border bg-black/20 p-3 text-[10px] space-y-1 text-muted-foreground">
                  <p className="text-foreground font-bold mb-1">Señales de indexación:</p>
                  <p>✓ Tipo: LocalBusiness y FAQPage</p>
                  <p>✓ Geo-target: {selectedArticle.sede} enlazado</p>
                  <p>✓ @graph id-linking estructurado para Google/Gemini</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* AI CONTINUOUS GENERATOR CARD */}
        <Card className="rounded-xl border-border bg-surface/90 p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">JANA Brain Engine</p>
                <h3 className="text-base font-black">Autogenerador Continuo</h3>
              </div>
              <span className={cn(
                "relative flex h-2 w-2 rounded-full",
                autoGenActive ? "bg-success" : "bg-muted-foreground"
              )}>
                {autoGenActive && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                )}
              </span>
            </div>

            <p className="text-xs text-foreground-muted leading-relaxed text-left">
              Genera automáticamente borradores de artículos educativos optimizados para motores AIO/GEO/SEO a intervalos regulares.
            </p>

            <div className="flex items-center justify-between rounded-lg border border-border bg-black/20 p-3">
              <span className="text-xs font-bold text-foreground font-heading">Simulación Activa</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoGenActive}
                  onChange={(e) => setAutoGenActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-border rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brain" />
              </label>
            </div>

            <Button
              variant="outline"
              onClick={forcePublishCycle}
              className="w-full text-xs font-bold border-border bg-surface hover:bg-accent/40 h-10 rounded-lg"
            >
              Simular Ciclo Lote Completo
            </Button>

            {/* Simulated terminal console */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-left">Consola de Indexación IA</p>
              <div className="h-40 overflow-y-auto rounded-lg border border-border bg-black/45 p-2.5 font-mono text-[9px] text-brain leading-tight space-y-1.5">
                {genLogs.map((log, idx) => (
                  <div key={idx} className="border-b border-border/10 pb-1 text-left">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {selectedArticle && <ArticlePreview article={selectedArticle} />}
    </div>
  );
}

function ArticlePreview({ article }: { article: ContentArticle }) {
  return (
    <Card className="rounded-xl border-border bg-surface/90 p-6">
      <article className="mx-auto max-w-3xl">
        <div className="border-b border-border pb-5">
          <span className="rounded-md border border-jana-primary/25 bg-jana-primary/10 px-2 py-1 text-[10px] font-black text-jana-primary-accessible">
            Blog Escuela JANA
          </span>
          <h2 className="mt-4 text-2xl font-black leading-tight md:text-3xl">{article.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{article.excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span>Firmado por <strong className="text-foreground">{article.author}</strong></span>
            <span>{article.sede}</span>
            <span>{article.readingMinutes} min</span>
            {article.publishedAt && <span>Publicado {article.publishedAt}</span>}
          </div>
        </div>
        <p className="pt-5 text-sm leading-7 text-foreground-muted">{article.body}</p>
      </article>
    </Card>
  );
}

