"use client";

import { FormEvent, useMemo, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Activity,
  Brain,
  Clapperboard,
  GraduationCap,
  Menu,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Search,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  Send,
  PlusCircle,
  HelpCircle,
  FileText,
  DollarSign,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { useMockData, Student, Teacher } from "@/components/mock-data-context";
import { JanaLogo } from "@/components/jana-logo";
import { ProductionPlayer } from "@/components/remotion/production-player";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";

const navItems = [
  { label: "Brain", icon: Brain },
  { label: "Aula", icon: GraduationCap },
  { label: "Chat", icon: MessageSquare },
  { label: "Talent Graph", icon: Users },
  { label: "Panel", icon: Clapperboard },
];

const sedes = ["Madrid Centro", "Alcalá de Henares", "Majadahonda"];

const rolesList = [
  { role: "direccion", label: "Dirección", user: "direccion@jana.os", tone: "text-jana-primary-accessible" },
  { role: "admin", label: "Administración", user: "admin@jana.os", tone: "text-info" },
  { role: "profesor", label: "Profesorado", user: "profesor@jana.os", tone: "text-talent" },
  { role: "alumno", label: "Alumnado", user: "alumno@jana.os", tone: "text-production" },
];

export function JanaStage() {
  const { resolvedTheme, setTheme } = useTheme();
  const {
    activeRole,
    setActiveRole,
    activeSede,
    setActiveSede,
    students,
    teachers,
  } = useMockData();

  const [activeNav, setActiveNav] = useState("Brain");
  const [email, setEmail] = useState("direccion@jana.os");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "Selecciona un rol y valida acceso Backstage.",
  });
  const [showBackstage, setShowBackstage] = useState(false);

  const isLight = resolvedTheme === "light";

  // Auto-sync email field when clicking user templates
  const selectMockUser = (role: JanaRole, userEmail: string) => {
    setEmail(userEmail);
    // Auto-populate simulated correct password
    if (role === "direccion") setPassword("DirJana2026!");
    if (role === "admin") setPassword("AdminJana2026!");
    if (role === "profesor") setPassword("ProfJana2026!");
    if (role === "alumno") setPassword("AlumJana2026!");
  };

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLogin({ status: "loading", message: "Validando credenciales..." });

    const response = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const payload = await response.json();

    if (!response.ok || !payload.ok) {
      setLogin({ status: "error", message: payload.message ?? "Acceso denegado." });
      return;
    }

    setLogin({
      status: "success",
      message: `Acceso concedido a ${payload.session.defaultStage}.`,
    });

    // Update global context active role
    setActiveRole(payload.session.role);
    if (payload.session.role === "alumno") {
      setActiveNav("Talent Graph");
    } else if (payload.session.role === "profesor") {
      setActiveNav("Aula");
    } else if (payload.session.role === "admin") {
      setActiveNav("Panel");
    } else {
      setActiveNav("Brain");
    }
    setShowBackstage(true);
  }

  // Filter students based on active Sede
  const filteredStudents = useMemo(() => {
    return students.filter(s => s.sede === activeSede);
  }, [students, activeSede]);

  if (!showBackstage) {
    return (
      <LandingPage
        resolvedTheme={resolvedTheme}
        setTheme={setTheme}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        login={login}
        setLogin={setLogin}
        handleLogin={handleLogin}
        selectMockUser={selectMockUser}
      />
    );
  }

  return (
    <main className="stage-vignette min-h-screen overflow-hidden bg-background">
      <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[280px_1fr]">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden border-r border-border bg-surface/72 px-4 py-5 lg:block">
          <BrandBlock />
          <nav aria-label="Navegación Backstage" className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={cn(
                  "h-11 w-full justify-start gap-3 border-l-2 border-transparent text-foreground-muted hover:bg-accent/40",
                  activeNav === item.label && "border-l-jana-primary bg-accent/80 text-foreground"
                )}
                onClick={() => setActiveNav(item.label)}
              >
                <item.icon className="size-4" aria-hidden="true" />
                <span>Backstage {item.label}</span>
              </Button>
            ))}
          </nav>

          <Card className="mt-8 rounded-lg bg-surface-elevated/80 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Brain className="size-4 text-brain" />
                Cabina Cognitiva
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-foreground-muted">
              <p className="flex items-center gap-2 text-foreground font-medium">
                <Activity className="size-3 text-talent" />
                Rol: <span className="capitalize text-jana-primary-accessible font-semibold">{activeRole}</span>
              </p>
              <p className="flex items-center gap-2 text-foreground font-medium">
                <Activity className="size-3 text-production" />
                Sede: <span className="font-semibold text-foreground">{activeSede}</span>
              </p>
              <p>El RAG filtrará de forma automática según estos permisos de seguridad.</p>
            </CardContent>
          </Card>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <section className="flex min-w-0 flex-col">
          
          {/* HEADER */}
          <header className="sticky top-0 z-30 border-b border-border bg-background/82 px-4 py-3 backdrop-blur-xl md:px-6">
            <div className="flex items-center justify-between gap-3">
              
              {/* MOBILE MENU SHEET */}
              <div className="flex min-w-0 items-center gap-3 lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline" aria-label="Abrir navegación">
                      <Menu className="size-5" aria-hidden="true" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="glass-panel text-foreground">
                    <SheetHeader>
                      <SheetTitle>JANA OS</SheetTitle>
                      <SheetDescription>Backstage creativo unificado.</SheetDescription>
                    </SheetHeader>
                    <nav className="mt-6 space-y-2">
                      {navItems.map((item) => (
                        <Button
                          key={item.label}
                          variant="ghost"
                          className={cn(
                            "h-11 w-full justify-start gap-3 text-foreground-muted",
                            activeNav === item.label && "bg-accent/80 text-foreground"
                          )}
                          onClick={() => setActiveNav(item.label)}
                        >
                          <item.icon className="size-4" aria-hidden="true" />
                          <span>Backstage {item.label}</span>
                        </Button>
                      ))}
                    </nav>
                  </SheetContent>
                </Sheet>
                <JanaLogo className="h-8 w-auto" />
              </div>

              {/* CONTEXT SELECTORS (RAG Simulator controls in header) */}
              <div className="hidden min-w-0 md:flex items-center gap-4 lg:block">
                <p className="text-xs font-semibold uppercase text-jana-primary-accessible tracking-wider">
                  JANA Creative Stage System
                </p>
                <h1 className="text-lg font-semibold truncate">Backstage {activeNav}</h1>
              </div>

              {/* QUICK SWITCHERS FOR AGENT TESTING */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1 text-xs">
                  <span className="text-muted-foreground">Sede:</span>
                  <select
                    value={activeSede}
                    onChange={(e) => setActiveSede(e.target.value)}
                    className="bg-transparent font-semibold focus:outline-none cursor-pointer"
                  >
                    {sedes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1 text-xs">
                  <span className="text-muted-foreground">Rol:</span>
                  <select
                    value={activeRole}
                    onChange={(e) => {
                      setActiveRole(e.target.value as JanaRole);
                      setLogin({ status: "idle", message: "Rol simulado actualizado." });
                    }}
                    className="bg-transparent font-semibold focus:outline-none cursor-pointer capitalize text-jana-primary-accessible"
                  >
                    {rolesList.map(r => <option key={r.role} value={r.role}>{r.label}</option>)}
                  </select>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3">
                      <Moon className="size-4 text-muted-foreground" aria-hidden="true" />
                      <Switch
                        checked={isLight}
                        onCheckedChange={(checked) => setTheme(checked ? "light" : "dark")}
                        aria-label="Alternar tema claro"
                      />
                      <Sun className="size-4 text-muted-foreground" aria-hidden="true" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Cambiar tema</TooltipContent>
                </Tooltip>

                <Button
                  variant="outline"
                  className="h-11 border-border text-foreground hover:bg-accent/40 mr-1"
                  onClick={() => setShowBackstage(false)}
                >
                  Ver Web Pública
                </Button>

                {/* LOGIN DIALOG */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="h-11 gap-2 bg-jana-primary text-primary-foreground hover:bg-jana-primary-hover">
                      <ShieldCheck className="size-4" aria-hidden="true" />
                      Acceder (.env)
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-panel sm:max-w-md text-foreground">
                    <DialogHeader>
                      <DialogTitle>Acceso Credenciales .env.local</DialogTitle>
                      <DialogDescription>
                        Validación local por rol contra variables de entorno simuladas.
                      </DialogDescription>
                    </DialogHeader>
                    <LoginForm
                      email={email}
                      setEmail={setEmail}
                      password={password}
                      setPassword={setPassword}
                      login={login}
                      handleLogin={handleLogin}
                      selectMockUser={selectMockUser}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          {/* DYNAMIC DASHBOARD VIEWS CONTAINER */}
          <div className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
            <AnimatePresence mode="wait">
              {activeNav === "Brain" && (
                <motion.div
                  key="brain-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <BrainView activeRole={activeRole} activeSede={activeSede} />
                </motion.div>
              )}

              {activeNav === "Aula" && (
                <motion.div
                  key="aula-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <AulaView activeRole={activeRole} activeSede={activeSede} students={filteredStudents} />
                </motion.div>
              )}

              {activeNav === "Talent Graph" && (
                <motion.div
                  key="talent-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <TalentGraphView students={filteredStudents} />
                </motion.div>
              )}

              {activeNav === "Panel" && (
                <motion.div
                  key="panel-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <PanelView activeSede={activeSede} teachers={teachers} students={filteredStudents} />
                </motion.div>
              )}

              {activeNav === "Chat" && (
                <motion.div
                  key="chat-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChatView activeRole={activeRole} activeSede={activeSede} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ==========================================================================
   SUB-VIEW COMPONENTS
   ========================================================================== */

/* 1. BACKSTAGE BRAIN (RAG Search Simulator) */
function BrainView({ activeRole, activeSede }: { activeRole: JanaRole; activeSede: string }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchDatabase = [
    { title: "Evaluaciones Trimestrales Canto - 1ºA", content: "Resultados detallados del examen de técnica vocal de Sofía García. Nivel actual: 8/10.", Sede: "Madrid Centro", sensitivity: "RESTRICTED", roleRequired: "profesor" },
    { title: "Mapeo Financiero y Margen Comercial Q2", content: "Ingresos netos por mensualidades de Madrid Centro: 14,200€. Tasa de morosidad: 2.1%.", Sede: "Madrid Centro", sensitivity: "CONFIDENTIAL", roleRequired: "direccion" },
    { title: "Contrato de Alquiler de Espacio Escénico", content: "Cláusulas de fianza y montaje de luces de la Sala Roja en sede Majadahonda.", Sede: "Majadahonda", sensitivity: "INTERNAL", roleRequired: "admin" },
    { title: "Metodología Artística: Focos Escénicos", content: "Guía de expresión corporal y control de pánico escénico para nuevos talentos.", Sede: "Madrid Centro", sensitivity: "PUBLIC", roleRequired: "alumno" },
    { title: "Lista de Alumnos Morosos Junio", content: "Avisos pendientes de pago para la sede Alcalá de Henares.", Sede: "Alcalá de Henares", sensitivity: "CONFIDENTIAL", roleRequired: "admin" },
    { title: "Ficha del Alumno - Mateo Rodríguez", content: "Anotaciones confidenciales de comportamiento y afinidad artística en ensayos.", Sede: "Madrid Centro", sensitivity: "RESTRICTED", roleRequired: "profesor" }
  ];

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* RAG SEARCH BOX */}
      <Card className="rounded-lg bg-surface/90 border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="size-5 text-brain" />
            Simulador de Consultas RAG Seguro
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Busca por notas, finanzas, metodologías, alumnos..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-11"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} className="h-11 bg-jana-primary hover:bg-jana-primary-hover">
              Consultar RAG
            </Button>
          </div>

          {/* RAG SIMULATOR METADATA */}
          {query && (
            <div className="mt-4 rounded-lg bg-black/40 p-4 border border-border space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">LOG DE SEGURIDAD RAG (Filtros en tiempo real):</p>
              {isSearching ? (
                <div className="flex items-center gap-2 text-sm text-brain font-medium animate-pulse">
                  <Sparkles className="size-4 animate-spin" />
                  Generando respuesta contextual del JANA Brain...
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <p className="text-success flex items-center gap-1.5">
                    <CheckCircle className="size-3.5" />
                    Filtro de Sede activo: <span className="font-bold">{activeSede}</span> (Excluye otras sedes)
                  </p>
                  <p className="text-info flex items-center gap-1.5">
                    <CheckCircle className="size-3.5" />
                    Rol activo: <span className="font-bold uppercase">{activeRole}</span>
                  </p>
                  
                  <div className="border-t border-border mt-3 pt-3">
                    <p className="font-semibold mb-2">Estado de Documentos Vectoriales recuperados:</p>
                    <div className="grid gap-2">
                      {searchDatabase.map((doc, idx) => {
                        const hasSedeAccess = doc.Sede === activeSede;
                        let hasRoleAccess = false;
                        if (activeRole === "direccion") hasRoleAccess = true;
                        else if (activeRole === "admin" && ["CONFIDENTIAL", "INTERNAL", "PUBLIC"].includes(doc.sensitivity)) hasRoleAccess = true;
                        else if (activeRole === "profesor" && ["RESTRICTED", "INTERNAL", "PUBLIC"].includes(doc.sensitivity)) hasRoleAccess = true;
                        else if (activeRole === "alumno" && doc.sensitivity === "PUBLIC") hasRoleAccess = true;

                        const isAuthorized = hasSedeAccess && hasRoleAccess;

                        return (
                          <div key={idx} className={cn("p-2 rounded border text-xs flex justify-between items-center", isAuthorized ? "bg-surface/50 border-border" : "bg-error/5 border-error/20 opacity-70")}>
                            <div>
                              <span className="font-semibold block">{doc.title}</span>
                              <span className="text-[10px] text-muted-foreground">{doc.Sede} · Sensibilidad: <span className="font-bold">{doc.sensitivity}</span></span>
                            </div>
                            {isAuthorized ? (
                              <span className="text-success text-[10px] flex items-center gap-1"><Unlock className="size-3" /> Incluido</span>
                            ) : (
                              <span className="text-error text-[10px] flex items-center gap-1"><Lock className="size-3" /> Filtrado</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MOCK SEARCH RESULTS OR INTRO */}
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="searching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 rounded-lg border border-border bg-surface/50"
          >
            <div className="size-14 rounded-full bg-brain/10 flex items-center justify-center animate-bounce mb-4">
              <Brain className="size-8 text-brain animate-pulse" />
            </div>
            <p className="font-display font-semibold text-lg animate-pulse text-brain">🧠 Analizando fuentes y filtrando accesos...</p>
            <p className="text-xs text-muted-foreground mt-1">Generando respuesta libre de filtraciones de datos sensibles.</p>
          </motion.div>
        ) : query ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border bg-surface p-5 space-y-4"
          >
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Brain className="size-5 text-brain" />
                <h3 className="font-semibold">Respuesta de JANA Brain (RAG Asistido)</h3>
              </div>
              <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded font-mono">✓ RAG Seguro</span>
            </div>
            
            <div className="text-sm leading-relaxed text-foreground-muted">
              {query.toLowerCase().includes("notas") || query.toLowerCase().includes("canto") ? (
                activeRole === "alumno" ? (
                  <p>Has solicitado información sobre notas. Según tus registros de alumno, tienes un **8.5** en Técnica Vocal. Sin embargo, no tienes permisos para acceder a las notas detalladas ni comentarios privados del resto de los alumnos de tu clase.</p>
                ) : activeRole === "profesor" || activeRole === "direccion" ? (
                  <p>Analizando la clase de canto en la sede **Madrid Centro**. Alumna **Sofía García** ha progresado notablemente, consolidando un **8.5** en afinación y respiración lírica. Se aconseja agendar un ensayo focalizado para reforzar su timbre vocal.</p>
                ) : (
                  <p>Permisos insuficientes para consultar evaluaciones de alumnos. Como administrador, puedes gestionar las aulas y asistencias globales en el Backstage Panel.</p>
                )
              ) : query.toLowerCase().includes("finanzas") || query.toLowerCase().includes("gastos") ? (
                activeRole === "direccion" ? (
                  <p>El resumen comercial de la sede **Madrid Centro** para el Q2 indica un ingreso total de **14,200€** con un margen de beneficio saludable. La tasa de morosidad se mantiene controlada en un **2.1%**.</p>
                ) : (
                  <p className="text-error flex items-center gap-2 font-medium">
                    <Lock className="size-4" /> Acceso denegado. Este documento tiene una clasificación **CONFIDENTIAL** y requiere un nivel de acceso directivo.
                  </p>
                )
              ) : (
                <p>He procesado tu búsqueda &quot;{query}&quot; en la sede **{activeSede}**. He recuperado 3 documentos públicos e internos autorizados para tu rol. Se sugiere consultar el Backstage Aula para informes en vivo o hablar con el profesor en el canal de chat.</p>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="text-center p-8 border border-dashed border-border rounded-lg bg-surface/30">
            <HelpCircle className="size-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-semibold">Realiza una consulta para poner a prueba el RAG Seguro</p>
            <p className="text-xs text-muted-foreground mt-1">
              Escribe &apos;notas de canto&apos; o &apos;finanzas de madrid&apos; y cambia los roles en la cabecera para ver cómo se filtran los datos.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* 1.5 BACKSTAGE CHAT (Communication & Real-time AI Analysis) */
function ChatView({ activeRole, activeSede }: { activeRole: JanaRole; activeSede: string }) {
  const { chatMessages, sendChatMessage, updateStudentSkill } = useMockData();
  const [newChatText, setNewChatText] = useState("");
  const [showAppliedAlert, setShowAppliedAlert] = useState(false);

  const handleSendChat = (e: FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    const nameMap = {
      direccion: "Dirección JANA",
      admin: "Administrador Sede",
      profesor: "Elena Ruiz (Profa)",
      alumno: "Sofía García (Alumna)"
    };
    sendChatMessage(nameMap[activeRole], newChatText);
    setNewChatText("");
  };

  const handleApplyAIPromotion = () => {
    updateStudentSkill("s1", "Técnica vocal", 8);
    setShowAppliedAlert(true);
    setTimeout(() => setShowAppliedAlert(false), 3000);
  };

  const hasAIPromotionSuggestion = useMemo(() => {
    return chatMessages.some(m => m.sender.includes("Brain") && m.text.toLowerCase().includes("sugerencia"));
  }, [chatMessages]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
      {/* MAIN CHAT AREA */}
      <Card className="rounded-lg bg-surface/90 border-border flex flex-col h-[550px]">
        <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Activity className="size-4 text-jana-primary-accessible animate-pulse" />
            Canal de Ensayos ({activeSede})
          </CardTitle>
          <span className="text-[10px] text-muted-foreground capitalize font-bold">Rol: {activeRole}</span>
        </CardHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg) => {
            const isAI = msg.sender.includes("Brain");
            return (
              <div
                key={msg.id}
                className={cn(
                  "max-w-[85%] rounded-lg p-3 text-xs leading-normal",
                  isAI
                    ? "bg-brain/10 border border-brain/20 text-brain-accessible ml-0"
                    : msg.role === activeRole
                    ? "bg-jana-primary/15 text-foreground ml-auto border border-jana-primary/10"
                    : "bg-surface-elevated text-foreground-muted mr-auto border border-border"
                )}
              >
                <div className="flex justify-between items-center gap-2 mb-1">
                  <span className="font-bold text-[10px]">{msg.sender}</span>
                  <span className="text-[9px] text-muted-foreground">{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSendChat} className="p-3 border-t border-border flex gap-2">
          <Input
            placeholder="Escribe un mensaje al canal de ensayos..."
            value={newChatText}
            onChange={(e) => setNewChatText(e.target.value)}
            className="flex-1 text-xs"
          />
          <Button type="submit" size="icon" className="bg-jana-primary hover:bg-jana-primary-hover">
            <Send className="size-4" />
          </Button>
        </form>
      </Card>

      {/* JANA BRAIN REAL-TIME CO-PILOT ANALYSIS */}
      <div className="space-y-6">
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Brain className="size-4 text-brain" />
              Copiloto IA - JANA Brain
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="bg-black/30 p-3 rounded-lg border border-border space-y-2">
              <p className="font-semibold text-muted-foreground">ANÁLISIS EN TIEMPO REAL:</p>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Sentimiento:</span>
                <span className="text-success font-semibold">Constructivo / Enfocado</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Participación:</span>
                <span className="text-foreground font-semibold">4 miembros activos</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-muted-foreground">Hilos temáticos:</span>
                <span className="text-brain-accessible font-semibold">#TécnicaVocal, #Ritmo</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-semibold text-muted-foreground">SUGERENCIAS OPERATIVAS:</p>
              
              {hasAIPromotionSuggestion ? (
                <div className="p-3 rounded-lg border border-brain/30 bg-brain/5 space-y-2">
                  <p className="font-medium text-foreground">
                    Actualización de Habilidad Recomendada
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    El asistente ha detectado que **Sofía García** ha progresado en afinación y técnica vocal.
                  </p>
                  
                  {activeRole === "profesor" || activeRole === "direccion" ? (
                    <div className="pt-2">
                      <Button
                        size="sm"
                        onClick={handleApplyAIPromotion}
                        className="w-full bg-brain text-white hover:bg-brain/90 text-[11px] h-8"
                      >
                        Aplicar Mejora a Talent Graph
                      </Button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-warning flex items-center gap-1">
                      <Lock className="size-3" /> Inicia sesión como Profesor para aplicar esta mejora.
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg border border-border bg-black/10 text-center text-muted-foreground">
                  Ninguna acción pendiente. 
                  <p className="text-[10px] mt-1">
                    (Tip: Envía un chat que diga &apos;vocal&apos; y &apos;excelente&apos; con rol de Profesor para forzar la sugerencia de la IA).
                  </p>
                </div>
              )}

              {showAppliedAlert && (
                <div className="p-2 rounded text-center text-success bg-success/15 border border-success/30 text-[11px] animate-pulse">
                  ✓ Habilidad de Sofía actualizada exitosamente a nivel 8 en el Talent Graph.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Activity className="size-3 text-talent" />
              Sede e Integración
            </CardTitle>
          </CardHeader>
          <CardContent className="text-[11px] text-foreground-muted space-y-1">
            <p>Canal encriptado de sede: **{activeSede}**</p>
            <p>Los análisis cognitivos se guardan de forma anónima en el log seguro para cumplir con la protección de datos artísticos de menores.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* 2. BACKSTAGE AULA (Class details & student grading) */
function AulaView({
  activeRole,
  activeSede,
  students,
}: {
  activeRole: JanaRole;
  activeSede: string;
  students: Student[];
}) {
  const { addGrade, updateStudentSkill } = useMockData();
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("Afinación");
  const [gradeInput, setGradeInput] = useState("8");
  const [commentInput, setCommentInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const activeStudent = useMemo(() => {
    return students.find(s => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  // Set default student if none selected
  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  const handleSubmitGrade = (e: FormEvent) => {
    e.preventDefault();
    const parsedGrade = parseFloat(gradeInput);
    if (isNaN(parsedGrade) || parsedGrade < 1 || parsedGrade > 10 || !selectedStudentId) return;

    // Save grade details
    addGrade(selectedStudentId, "Mapeo Técnico en vivo", parsedGrade, commentInput || "Evaluación periódica de clase.");
    // Update skill score
    updateStudentSkill(selectedStudentId, selectedSkill, Math.floor(parsedGrade));

    setShowSuccess(true);
    setCommentInput("");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isTeacherOrAdmin = activeRole === "profesor" || activeRole === "direccion" || activeRole === "admin";

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      
      {/* LEFT SIDE: STUDENT LIST */}
      <Card className="rounded-lg bg-surface/90 border-border lg:col-span-4 max-h-[600px] flex flex-col">
        <CardHeader className="pb-3 border-b border-border">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span>Alumnos ({students.length})</span>
            <span className="text-xs text-muted-foreground font-normal">{activeSede}</span>
          </CardTitle>
        </CardHeader>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {students.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudentId(student.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition",
                selectedStudentId === student.id
                  ? "bg-jana-primary/10 border-jana-primary"
                  : "bg-surface-elevated/50 border-border hover:border-muted-foreground/30"
              )}
            >
              <div>
                <span className="font-bold block">{student.name}</span>
                <span className="text-muted-foreground block text-[10px]">{student.email}</span>
              </div>
              <span className="text-[10px] bg-accent px-2 py-0.5 rounded font-mono">
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
            <Card className="rounded-lg bg-surface/90 border-border">
              <CardHeader className="pb-3 border-b border-border flex flex-row items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback className="bg-jana-primary/10 text-jana-primary-accessible font-bold">
                    {activeStudent.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-bold">{activeStudent.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{activeStudent.email} · Sede principal: {activeStudent.sede}</p>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 p-3 rounded-lg border border-border text-center">
                    <p className="text-xs text-muted-foreground">Asistencia General</p>
                    <p className="text-2xl font-bold text-talent">{activeStudent.attendance}%</p>
                  </div>
                  <div className="bg-black/30 p-3 rounded-lg border border-border text-center">
                    <p className="text-xs text-muted-foreground">Puntualidad habitual</p>
                    <p className="text-2xl font-bold text-production">{activeStudent.punctuality ? "Sí" : "En revisión"}</p>
                  </div>
                </div>

                {/* GRADES HISTORY */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-muted-foreground">HISTORIAL DE EVALUACIONES:</h4>
                  <div className="space-y-2">
                    {activeStudent.grades.map((g, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-border bg-surface-elevated/40 text-xs flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <span className="font-bold text-foreground block">{g.course}</span>
                          <span className="text-muted-foreground block text-[11px] mt-0.5">{g.comments}</span>
                        </div>
                        <span className="text-base font-bold bg-jana-primary/10 text-jana-primary-accessible px-2.5 py-1 rounded">
                          {g.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GRADING FORM (Visible only to teachers/admin/dir) */}
            {isTeacherOrAdmin ? (
              <Card className="rounded-lg bg-surface/90 border-border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <PlusCircle className="size-4 text-jana-primary" />
                    Nueva Calificación Artística
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitGrade} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground" htmlFor="select-skill">
                          Habilidad evaluada (Talent Graph)
                        </label>
                        <select
                          id="select-skill"
                          value={selectedSkill}
                          onChange={(e) => setSelectedSkill(e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-xs text-foreground focus:outline-none"
                        >
                          {activeStudent.skills.map(s => <option key={s.name} value={s.name}>{s.name} ({s.category})</option>)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground" htmlFor="grade">
                          Nota numérica (1-10)
                        </label>
                        <Input
                          id="grade"
                          type="number"
                          min="1"
                          max="10"
                          step="0.5"
                          value={gradeInput}
                          onChange={(e) => setGradeInput(e.target.value)}
                          className="h-10 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground" htmlFor="comment">
                        Feedback pedagógico (Copywriting inclusivo)
                      </label>
                      <Input
                        id="comment"
                        placeholder="Ej: Destaca en el soporte diafragmático. Cuidar la expresión corporal..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="h-11 text-xs"
                      />
                    </div>

                    <Button type="submit" className="w-full h-11 bg-jana-primary hover:bg-jana-primary-hover">
                      Guardar en Aula y Talent Graph
                    </Button>

                    <AnimatePresence>
                      {showSuccess && (
                        <motion.p
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-success bg-success/15 border border-success/30 rounded p-2 text-center"
                        >
                          ✓ Nota guardada y perfiles de Talent Graph recalculados.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <div className="p-4 rounded-lg bg-surface/30 border border-dashed border-border text-center text-xs text-muted-foreground">
                <Lock className="size-4 mx-auto mb-1" />
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

/* 3. BACKSTAGE TALENT GRAPH (Interactive SVG Map & Accessible Table) */
type SVGNode = {
  id: string;
  label: string;
  type: "center" | "skill" | "student";
  x: number;
  y: number;
};

function TalentGraphView({ students }: { students: Student[] }) {
  const [viewType, setViewType] = useState<"graph" | "table">("graph");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("center");
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  // SVG coordinate dimensions
  const svgWidth = 600;
  const svgHeight = 400;

  // Initialize nodes
  const [nodes, setNodes] = useState<SVGNode[]>([
    { id: "center", label: "Talento JANA", type: "center", x: 300, y: 200 },
    
    // Skills
    { id: "canto", label: "Canto", type: "skill", x: 150, y: 120 },
    { id: "danza", label: "Danza", type: "skill", x: 450, y: 120 },
    { id: "interpretacion", label: "Interpretación", type: "skill", x: 150, y: 280 },
    { id: "dinamica", label: "Dinámica", type: "skill", x: 450, y: 280 },

    // Top students
    { id: "stu1", label: "Sofía G.", type: "student", x: 90, y: 80 },
    { id: "stu2", label: "Mateo R.", type: "student", x: 180, y: 60 },
    { id: "stu3", label: "Valentina G.", type: "student", x: 380, y: 60 },
    { id: "stu4", label: "Santiago F.", type: "student", x: 500, y: 80 },
    { id: "stu5", label: "Isabella L.", type: "student", x: 90, y: 320 },
    { id: "stu6", label: "Sebastián M.", type: "student", x: 180, y: 340 },
    { id: "stu7", label: "Lucía G.", type: "student", x: 380, y: 340 },
    { id: "stu8", label: "Matías P.", type: "student", x: 500, y: 320 }
  ]);

  // Edges mapping
  const edges = [
    { from: "center", to: "canto" },
    { from: "center", to: "danza" },
    { from: "center", to: "interpretacion" },
    { from: "center", to: "dinamica" },

    // Student connections to major skills
    { from: "stu1", to: "canto" },
    { from: "stu2", to: "canto" },
    { from: "stu3", to: "danza" },
    { from: "stu4", to: "danza" },
    { from: "stu5", to: "interpretacion" },
    { from: "stu6", to: "interpretacion" },
    { from: "stu7", to: "dinamica" },
    { from: "stu8", to: "dinamica" }
  ];

  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDown = (nodeId: string) => {
    setDraggedNodeId(nodeId);
    setSelectedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!draggedNodeId || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Cap boundaries
    const cappedX = Math.max(20, Math.min(svgWidth - 20, mouseX));
    const cappedY = Math.max(20, Math.min(svgHeight - 20, mouseY));

    setNodes(prev =>
      prev.map(node => (node.id === draggedNodeId ? { ...node, x: cappedX, y: cappedY } : node))
    );
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
  };

  // Find info of the selected node
  const nodeDetails = useMemo(() => {
    const node = nodes.find(n => n.id === selectedNodeId);
    if (!node) return null;

    if (node.type === "student") {
      // Find actual mock student data
      const studentMap: Record<string, string> = {
        stu1: "Sofía", stu2: "Mateo", stu3: "Valentina", stu4: "Santiago",
        stu5: "Isabella", stu6: "Sebastián", stu7: "Lucía", stu8: "Matías"
      };
      const shortName = studentMap[node.id] || "Sofía";
      const actual = students.find(s => s.name.startsWith(shortName));
      return {
        title: actual?.name || node.label,
        type: "Ficha del Alumno",
        detail1: `Asistencia: ${actual?.attendance ?? 96}%`,
        detail2: `Calificaciones: ${actual?.grades.length ?? 0} registradas`,
        skills: actual?.skills.slice(0, 4) ?? []
      };
    } else if (node.type === "skill") {
      return {
        title: node.label,
        type: "Habilidad Pedagógica",
        detail1: "Categoría estática del modelo de JANA.",
        detail2: "Influye en el análisis contextual de JANA Brain.",
        skills: []
      };
    } else {
      return {
        title: "Grafo Central de Talento JANA",
        type: "Módulo Base",
        detail1: "315 nodos de evolución y competencias interconectados.",
        detail2: "Sincronizado con RAG seguro.",
        skills: []
      };
    }
  }, [selectedNodeId, nodes, students]);

  return (
    <div className="space-y-6">
      
      {/* VIEW SELECTOR HEADER */}
      <div className="flex justify-between items-center bg-surface border border-border p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-talent" />
          <h3 className="font-semibold">Mapeo del Grafo de Habilidades</h3>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={viewType === "graph" ? "default" : "outline"}
            className={viewType === "graph" ? "bg-jana-primary hover:bg-jana-primary-hover" : ""}
            onClick={() => setViewType("graph")}
          >
            Vista Grafo
          </Button>
          <Button
            size="sm"
            variant={viewType === "table" ? "default" : "outline"}
            className={viewType === "table" ? "bg-jana-primary hover:bg-jana-primary-hover" : ""}
            onClick={() => setViewType("table")}
          >
            Vista Tabla (Accesible)
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* GRAPH RENDER OR TABLE */}
        <Card className="rounded-lg bg-surface/90 border-border lg:col-span-8 overflow-hidden min-h-[420px] flex flex-col justify-center items-center">
          {viewType === "graph" ? (
            <div className="w-full overflow-x-auto p-4 flex justify-center">
              <svg
                ref={svgRef}
                width={svgWidth}
                height={svgHeight}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="bg-black/35 rounded-lg border border-border cursor-grab select-none max-w-full"
              >
                {/* DRAW EDGES (LINES) */}
                {edges.map((edge, idx) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  if (!fromNode || !toNode) return null;
                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="rgba(255, 255, 255, 0.12)"
                      strokeWidth={selectedNodeId === fromNode.id || selectedNodeId === toNode.id ? 2 : 1}
                      strokeDasharray={selectedNodeId === fromNode.id || selectedNodeId === toNode.id ? "0" : "4 2"}
                    />
                  );
                })}

                {/* DRAW NODES (CIRCLES) */}
                {nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  let nodeColor = "#ec690c"; // jana-primary
                  let size = 10;

                  if (node.type === "center") {
                    nodeColor = "#7c5cff"; // brain
                    size = 22;
                  } else if (node.type === "skill") {
                    nodeColor = "#1fbf75"; // talent
                    size = 15;
                  }

                  return (
                    <g key={node.id} className="cursor-pointer">
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={size}
                        fill={nodeColor}
                        stroke="#121417"
                        strokeWidth="2"
                        className="transition-transform hover:scale-110"
                        onMouseDown={() => handleMouseDown(node.id)}
                      />
                      {isSelected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={size + 6}
                          fill="none"
                          stroke="#ec690c"
                          strokeWidth="1.5"
                          className="animate-ping opacity-60"
                        />
                      )}
                      <text
                        x={node.x}
                        y={node.y - size - 6}
                        textAnchor="middle"
                        fontSize="10px"
                        fontWeight="600"
                        fill="#F5F7FA"
                        className="bg-black/80 px-1 rounded pointer-events-none"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* ACCESSIBLE TABULAR VIEW (WCAG 2.2 AA requirement) */
            <div className="w-full p-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
                    <th className="p-3">Nombre Alumno</th>
                    <th className="p-3">Sede</th>
                    <th className="p-3">Asistencia %</th>
                    <th className="p-3">Skills Promedio</th>
                    <th className="p-3">Notas Registradas</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const avgSkill = (
                      student.skills.reduce((acc, curr) => acc + curr.level, 0) / student.skills.length
                    ).toFixed(1);
                    return (
                      <tr key={student.id} className="border-b border-border hover:bg-surface-elevated/40">
                        <td className="p-3 font-semibold text-foreground">{student.name}</td>
                        <td className="p-3 text-foreground-muted">{student.sede}</td>
                        <td className="p-3 font-mono text-talent font-bold">{student.attendance}%</td>
                        <td className="p-3 font-mono text-brain-accessible font-bold">{avgSkill} / 10</td>
                        <td className="p-3 text-foreground-muted">{student.grades.length}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* DETAILS SIDE PANEL */}
        <Card className="rounded-lg bg-surface/90 border-border lg:col-span-4 p-5 space-y-4">
          {nodeDetails ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] bg-jana-primary/10 text-jana-primary-accessible px-2 py-0.5 rounded font-mono font-bold">
                  {nodeDetails.type}
                </span>
                <h4 className="text-xl font-bold mt-2">{nodeDetails.title}</h4>
              </div>
              
              <div className="space-y-2 text-xs text-foreground-muted">
                <p>{nodeDetails.detail1}</p>
                <p>{nodeDetails.detail2}</p>
              </div>

              {nodeDetails.skills.length > 0 && (
                <div className="space-y-2 mt-4 pt-4 border-t border-border">
                  <h5 className="text-xs font-semibold text-muted-foreground">HABILIDADES ARTÍSTICAS:</h5>
                  <div className="space-y-2">
                    {nodeDetails.skills.map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span>{s.name} ({s.category})</span>
                          <span>{s.level}/10</span>
                        </div>
                        <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                          <div className="h-full bg-talent rounded-full" style={{ width: `${s.level * 10}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground border-t border-border pt-3">
                Tip: Arrastra los nodos en el grafo para recolocar y reorganizar la vista.
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center">Selecciona un nodo para consultar su información.</p>
          )}
        </Card>

      </div>
    </div>
  );
}

/* 4. BACKSTAGE PANEL (CRM Finance Visualizer & Production Details) */
function PanelView({
  activeSede,
  teachers,
  students,
}: {
  activeSede: string;
  teachers: Teacher[];
  students: Student[];
}) {
  const { invoices } = useMockData();

  // Filter teachers for the active Sede
  const sedeTeachers = useMemo(() => {
    return teachers.filter(t => t.sede === activeSede);
  }, [teachers, activeSede]);

  // Compute mock financial metrics
  const totalRevenue = useMemo(() => {
    return invoices
      .filter(inv => inv.status === "completado")
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [invoices]);

  const activeInvoices = useMemo(() => {
    return invoices.filter(inv => inv.verifactuStatus === "enviado" || inv.verifactuStatus === "registrado");
  }, [invoices]);

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      
      {/* METRICS ROW */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* KPI CARDS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-lg bg-surface/90 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-foreground-muted">Total Ingresos CRM (Completados)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold flex items-center gap-1">
                <DollarSign className="size-6 text-talent" />
                {totalRevenue}€
              </p>
              <span className="text-[10px] text-talent font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="size-3" /> +14.2% mes anterior
              </span>
            </CardContent>
          </Card>

          <Card className="rounded-lg bg-surface/90 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-foreground-muted">Alumnos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{students.length}</p>
              <span className="text-[10px] text-muted-foreground block mt-1.5">Matriculados en {activeSede}</span>
            </CardContent>
          </Card>

          <Card className="rounded-lg bg-surface/90 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-foreground-muted">Profesorado Asignado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{sedeTeachers.length}</p>
              <span className="text-[10px] text-muted-foreground block mt-1.5">Docentes activos en sede</span>
            </CardContent>
          </Card>
        </div>

        {/* CRM FINANCIAL LOGS & VERIFACTU LOG */}
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader className="border-b border-border pb-3 flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="size-4 text-jana-primary" />
              Sincronización de Facturas del CRM (Verifactu)
            </CardTitle>
            <span className="text-[10px] text-muted-foreground">Visualizador de logs integrados</span>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground uppercase text-[9px] tracking-wider">
                  <th className="p-3">ID Factura</th>
                  <th className="p-3">Concepto</th>
                  <th className="p-3">Alumno</th>
                  <th className="p-3">Monto</th>
                  <th className="p-3">Estado Pago</th>
                  <th className="p-3">Verifactu</th>
                  <th className="p-3">Sincronización</th>
                </tr>
              </thead>
              <tbody>
                {activeInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border hover:bg-surface-elevated/40">
                    <td className="p-3 font-mono font-semibold text-foreground">{inv.id}</td>
                    <td className="p-3 text-foreground-muted">{inv.concept}</td>
                    <td className="p-3 font-bold">{inv.studentName}</td>
                    <td className="p-3 font-mono font-semibold">{inv.amount}€</td>
                    <td className="p-3">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", inv.status === "completado" ? "bg-success/15 text-success" : "bg-warning/15 text-warning")}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium", inv.verifactuStatus === "enviado" ? "bg-info/15 text-info" : "bg-warning/15 text-warning")}>
                        {inv.verifactuStatus}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-muted-foreground">{inv.syncTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

      {/* RIGHT SIDE: CRM CONFIGURATION & STAFF LIST */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* SEDE TEACHERS LIST */}
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold">Profesorado en {activeSede}</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {sedeTeachers.map((teacher) => (
              <div key={teacher.id} className="p-3 rounded-lg border border-border bg-surface-elevated/40 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-foreground block">{teacher.name}</span>
                  <span className="text-muted-foreground block text-[10px] mt-0.5">{teacher.subjects.join(", ")}</span>
                </div>
                <span className="text-[10px] bg-jana-primary/10 text-jana-primary-accessible px-2 py-0.5 rounded font-bold font-mono">
                  {teacher.hours}h acumu.
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* REMOTION PRODUCTION PLAYER CARD */}
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader className="pb-3 border-b border-border flex flex-row justify-between items-center">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clapperboard className="size-4 text-jana-primary" aria-hidden="true" />
              Previsualización Remotion
            </CardTitle>
            <span className="text-[10px] bg-jana-primary/10 text-jana-primary-accessible px-2 py-0.5 rounded font-mono font-bold">Luz/Voz/Movimiento</span>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-normal">
              Previsualizador dinámico de ensayos del backstage de producciones.
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <ProductionPlayer />
            </div>
          </CardContent>
        </Card>

        {/* CRM SYNC METRICS CARD */}
        <Card className="rounded-lg bg-surface/90 border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Logs de Sincronización del CRM</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Estado de conexión:</span>
              <span className="text-success font-semibold flex items-center gap-1">
                <CheckCircle className="size-3.5" /> En Línea
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Sincronización automática:</span>
              <span className="text-foreground-muted">Cada 10 minutos</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Último paquete enviado:</span>
              <span className="text-foreground-muted font-mono">2026-06-12 15:40</span>
            </div>
            <div className="border-t border-border pt-3 mt-1 text-[10px] text-muted-foreground leading-normal flex items-start gap-2">
              <AlertTriangle className="size-3.5 text-warning flex-shrink-0 mt-0.5" />
              <span>
                Verifactu está activo en modo Lectura/Auditoría para esta sede. Todas las transacciones son firmadas digitalmente por el CRM de origen.
              </span>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}

/* ==========================================================================
   BRAND AND MARKS
   ========================================================================== */

function BrandBlock() {
  return (
    <div className="flex items-center justify-start py-1">
      <JanaLogo className="h-9 w-auto" />
    </div>
  );
}

function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  login,
  handleLogin,
  selectMockUser,
}: {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  login: { status: "idle" | "loading" | "success" | "error"; message: string };
  handleLogin: (event: FormEvent<HTMLFormElement>) => void;
  selectMockUser: (role: JanaRole, userEmail: string) => void;
}) {
  return (
    <form className="space-y-4 text-left" onSubmit={handleLogin}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="login-email">
          Usuario
        </label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="login-password">
          Contraseña
        </label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11"
        />
      </div>
      <Button type="submit" className="h-11 w-full bg-jana-primary hover:bg-jana-primary-hover font-semibold" disabled={login.status === "loading"}>
        {login.status === "loading" ? "Validando..." : "Iniciar Sesión"}
      </Button>
      <p
        className={cn(
          "rounded-lg border px-3 py-2 text-sm transition-all",
          login.status === "success" && "border-success/50 text-success bg-success/10",
          login.status === "error" && "border-error/50 text-error bg-error/10",
          login.status !== "success" &&
            login.status !== "error" &&
            "border-border text-muted-foreground"
        )}
        role="status"
      >
        {login.message}
      </p>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Simular Plantilla de Credenciales:</p>
        <div className="grid grid-cols-2 gap-2">
          {rolesList.map(r => (
            <button
              key={r.role}
              type="button"
              onClick={() => selectMockUser(r.role as JanaRole, r.user)}
              className="text-left text-xs p-2 rounded border border-border hover:border-jana-primary bg-surface/50 truncate cursor-pointer transition"
            >
              <span className="font-semibold block">{r.label}</span>
              <span className="text-muted-foreground block text-[10px] truncate">{r.user}</span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}

/* ==========================================================================
   PUBLIC LANDING PAGE (Escuela JANA + JANA Producciones)
   ========================================================================== */
type LandingPageProps = {
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  login: { status: "idle" | "loading" | "success" | "error"; message: string };
  setLogin: React.Dispatch<React.SetStateAction<{ status: "idle" | "loading" | "success" | "error"; message: string }>>;
  handleLogin: (event: FormEvent<HTMLFormElement>) => void;
  selectMockUser: (role: JanaRole, userEmail: string) => void;
};

function LandingPage({
  resolvedTheme,
  setTheme,
  email,
  setEmail,
  password,
  setPassword,
  login,
  handleLogin,
  selectMockUser,
}: LandingPageProps) {
  const isLight = resolvedTheme === "light";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const megaMenu = {
    Formación: ["Cursos Anuales", "Nuestras Sedes", "Colegios", "Campamentos de Verano", "Inscripción Online"],
    Escenario: ["Musicales en Cartel", "Microconciertos JANA", "Compra de Entradas", "Giras Nacionales"],
    Comunidad: ["Profesorado", "Espacios Escénicos", "Agenda de Ensayos", "Noticias JANA"],
    Nosotros: ["Quiénes Somos", "Historia JANA", "Bolsa de Empleo", "Contactar"],
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* PUBLIC HEADER */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <JanaLogo className="h-10 w-auto" />
          </div>

          {/* DESKTOP MEGA-MENU */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
            {Object.entries(megaMenu).map(([category, items]) => (
              <div key={category} className="relative group py-2">
                <button className="text-foreground-muted hover:text-foreground flex items-center gap-1 cursor-pointer transition">
                  {category}
                  <span className="text-[10px] opacity-65 transition-transform group-hover:rotate-180">▼</span>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl border border-border bg-surface-elevated/95 p-3 shadow-xl backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-jana-primary-accessible uppercase tracking-wider px-2 pb-1 border-b border-border/40 mb-1">
                      {category} JANA
                    </p>
                    {items.map((item) => (
                      <a
                        key={item}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="block rounded-lg px-2 py-1.5 text-xs text-foreground-muted hover:text-foreground hover:bg-accent/40 transition"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setTheme(isLight ? "dark" : "light")}
                  className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface hover:bg-accent/30 transition cursor-pointer"
                  aria-label="Alternar tema claro y oscuro"
                >
                  {isLight ? (
                    <Moon className="size-4 text-foreground-muted" />
                  ) : (
                    <Sun className="size-4 text-foreground-muted" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Alternar Tema</TooltipContent>
            </Tooltip>

            {/* Backstage Access */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-11 px-5 bg-jana-primary text-primary-foreground hover:bg-jana-primary-hover font-semibold rounded-lg shadow-md cursor-pointer transition-all hover:shadow-jana-primary/20">
                  Acceso Backstage
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel sm:max-w-md text-foreground">
                <DialogHeader>
                  <DialogTitle>Acceso Credenciales .env.local</DialogTitle>
                  <DialogDescription>
                    Inicia sesión por rol para acceder al simulador Backstage JANA OS.
                  </DialogDescription>
                </DialogHeader>
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  login={login}
                  handleLogin={handleLogin}
                  selectMockUser={selectMockUser}
                />
              </DialogContent>
            </Dialog>

            {/* MOBILE NAVIGATION MENU TRIGGER */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex size-10 items-center justify-center rounded-lg border border-border bg-surface hover:bg-accent/30 transition cursor-pointer"
              aria-label="Abrir navegación móvil"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>

        {/* MOBILE MENU PANEL */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 border-t border-border pt-3 space-y-4">
            <nav className="space-y-3">
              {Object.entries(megaMenu).map(([category, items]) => (
                <div key={category} className="space-y-1">
                  <p className="text-xs font-bold text-jana-primary-accessible uppercase px-2">{category}</p>
                  <div className="grid grid-cols-2 gap-1 pl-2">
                    {items.map((item) => (
                      <a
                        key={item}
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="block rounded px-2 py-1 text-xs text-foreground-muted hover:text-foreground hover:bg-accent/20"
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative py-16 md:py-24 px-4 md:px-8 text-center max-w-6xl mx-auto space-y-10 flex-1 flex flex-col justify-center">
        {/* Ambient glow background */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="h-96 w-96 rounded-full bg-jana-primary/12 blur-[120px] -translate-y-8" />
          <div className="h-80 w-80 rounded-full bg-brain/10 blur-[140px] translate-x-32 translate-y-16" />
          <div className="h-60 w-60 rounded-full bg-talent/8 blur-[100px] -translate-x-32 translate-y-20" />
        </div>

        {/* Sede pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {["Madrid Centro", "Alcalá de Henares", "Majadahonda"].map(sede => (
            <span key={sede} className="inline-flex items-center gap-1.5 rounded-full border border-jana-primary/30 bg-jana-primary/8 px-3 py-1 text-[11px] font-semibold text-jana-primary-accessible">
              <span className="size-1.5 rounded-full bg-jana-primary-accessible animate-pulse" />
              {sede}
            </span>
          ))}
        </div>

        <div className="space-y-6">
          <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05]">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-jana-primary-accessible bg-clip-text text-transparent">
              El escenario donde se
            </span>
            <br />
            <span className="bg-gradient-to-r from-jana-primary via-jana-primary-accessible to-foreground bg-clip-text text-transparent">
              forma el talento artístico
            </span>
          </h1>
          <p className="text-foreground-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Unificando <strong className="text-foreground">JANA Producciones</strong> — musicales galardonados, teatro de alto nivel y giras nacionales — con{" "}
            <strong className="text-foreground">Escuela JANA</strong> — formación artística en Canto, Danza e Interpretación.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-13 px-8 bg-jana-primary hover:bg-jana-primary-hover text-white text-sm font-bold rounded-xl shadow-lg shadow-jana-primary/25 transition-all hover:scale-105 hover:shadow-jana-primary/40 cursor-pointer">
                🎭 Iniciar Backstage OS
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel sm:max-w-md text-foreground">
              <DialogHeader>
                <DialogTitle>Acceso Credenciales .env.local</DialogTitle>
                <DialogDescription>
                  Inicia sesión para ver la simulación de paneles por rol.
                </DialogDescription>
              </DialogHeader>
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                login={login}
                handleLogin={handleLogin}
                selectMockUser={selectMockUser}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="h-13 px-8 border-border text-foreground hover:bg-accent/40 text-sm font-semibold rounded-xl transition-all hover:scale-105 cursor-pointer">
            Ver Catálogo de Cursos
          </Button>
        </div>

        {/* KPI Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
          {[
            { value: "15+", label: "Años de Trayectoria", color: "text-jana-primary-accessible" },
            { value: "3", label: "Sedes Activas", color: "text-brain" },
            { value: "400+", label: "Alumnos Matriculados", color: "text-talent" },
            { value: "50+", label: "Producciones Escénicas", color: "text-production" },
          ].map(stat => (
            <div key={stat.label} className="text-center space-y-1 p-4 rounded-xl bg-surface/50 border border-border hover:border-jana-primary/30 transition">
              <p className={`text-3xl font-black font-heading ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-foreground-muted font-medium leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>


      {/* GRID DE SERVICIOS CON EFECTO DE IMÁGENES EN ENLACE (GRAYSCALE TO COLOR HOVER) */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold font-heading">Nuestras Áreas de Excelencia</h2>
          <p className="text-xs text-foreground-muted max-w-md mx-auto">
            Cada imagen actúa como un enlace. Pasa el cursor por encima para revelar su color y magia artística.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Card JANA Producciones */}
          <a
            href="#producciones"
            onClick={(e) => e.preventDefault()}
            className="group block overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-md transition hover:border-jana-primary/50"
          >
            <div className="relative overflow-hidden h-64 bg-black/40">
              <img
                src="/production_la_bella.png"
                alt="JANA Producciones - Musical La Bella y la Bestia"
                className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[9px] bg-jana-primary text-white font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Producciones
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">Giras y Musicales Nacionales</h3>
              </div>
            </div>
            <div className="p-5 space-y-2 text-left">
              <p className="text-xs text-foreground-muted leading-relaxed">
                Desde grandes producciones musicales de Broadway en España hasta obras teatrales galardonadas a nivel nacional.
              </p>
              <span className="text-xs text-jana-primary-accessible font-bold group-hover:underline flex items-center gap-1">
                Conoce las producciones en cartelera →
              </span>
            </div>
          </a>

          {/* Card Escuela JANA */}
          <a
            href="#escuela"
            onClick={(e) => e.preventDefault()}
            className="group block overflow-hidden rounded-2xl border border-border bg-surface/50 shadow-md transition hover:border-jana-primary/50"
          >
            <div className="relative overflow-hidden h-64 bg-black/40">
              <img
                src="/escuela_canto.png"
                alt="Escuela JANA - Alumnos en clase de Canto"
                className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="text-[9px] bg-talent text-white font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Escuela JANA
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mt-1">Formación Artística</h3>
              </div>
            </div>
            <div className="p-5 space-y-2 text-left">
              <p className="text-xs text-foreground-muted leading-relaxed">
                Escuela líder especializada en Canto, Danza, Interpretación y Música para niños, jóvenes y adultos.
              </p>
              <span className="text-xs text-talent font-bold group-hover:underline flex items-center gap-1">
                Descubre nuestros planes formativos →
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* SOCIAL PROOF + CRO SECTION */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        {/* Testimonials */}
        <div className="text-center space-y-2 mb-12">
          <p className="text-[11px] font-bold text-foreground-muted uppercase tracking-widest">Lo que dicen quienes ya lo usan</p>
          <h2 className="text-2xl md:text-3xl font-black font-heading">Resultados reales en escuelas reales</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3 mb-16">
          {[
            {
              quote: "Antes gestionaba las notas en Excel. Ahora el profesor puntúa desde el aula y la dirección lo ve en tiempo real. Hemos reducido el tiempo de administración un 60%.",
              name: "Carmen Vega",
              role: "Directora · Escuela de Teatro Vega",
              initial: "CV",
              color: "text-jana-primary-accessible",
              border: "border-jana-primary/20",
            },
            {
              quote: "El RAG seguro fue el argumento definitivo para el RGPD. Podemos demostrar ante auditoría que ningún alumno accede a datos de otro. Eso no tiene precio.",
              name: "Alejandro Fuentes",
              role: "Director Digital · Compañía Danza Sur",
              initial: "AF",
              color: "text-brain",
              border: "border-brain/20",
            },
            {
              quote: "Las familias preguntan menos porque el alumno ya puede ver su progreso. El Talent Graph ha reducido las llamadas de padres a la mitad.",
              name: "Lucía Romero",
              role: "Coordinadora · Academia Musical Romero",
              initial: "LR",
              color: "text-talent",
              border: "border-talent/20",
            },
          ].map((t) => (
            <div key={t.name} className={`rounded-2xl border ${t.border} bg-surface/60 p-6 space-y-4 flex flex-col`}>
              <p className="text-sm text-foreground-muted leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <div className={`size-9 rounded-full bg-surface-elevated flex items-center justify-center text-xs font-black ${t.color}`}>
                  {t.initial}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-foreground-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA BLOCK */}
        <div className="relative overflow-hidden rounded-3xl border border-jana-primary/30 bg-gradient-to-br from-jana-primary/10 via-surface to-brain/10 p-10 md:p-14 text-center space-y-6">
          {/* Glow */}
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="h-64 w-64 rounded-full bg-jana-primary/15 blur-[80px]" />
          </div>

          <div className="space-y-3">
            <span className="inline-block rounded-full border border-jana-primary/40 bg-jana-primary/10 px-4 py-1.5 text-[11px] font-bold text-jana-primary-accessible uppercase tracking-widest">
              Demo gratuita · Sin compromiso
            </span>
            <h2 className="text-3xl md:text-4xl font-black font-heading">
              ¿Tu escuela merece una gestión<br className="hidden md:block" /> del siglo XXI?
            </h2>
            <p className="text-foreground-muted text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              Solicita una demo personalizada. Configuramos JANA OS con los datos reales de tu escuela en menos de 48h.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-13 px-10 bg-jana-primary hover:bg-jana-primary-hover text-white text-sm font-bold rounded-xl shadow-lg shadow-jana-primary/30 hover:shadow-jana-primary/50 transition-all hover:scale-105 cursor-pointer">
                  🎭 Solicitar Demo Backstage
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel sm:max-w-md text-foreground">
                <DialogHeader>
                  <DialogTitle>Acceso Demo · JANA OS</DialogTitle>
                  <DialogDescription>
                    Usa las credenciales de demo para explorar todos los paneles por rol.
                  </DialogDescription>
                </DialogHeader>
                <LoginForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  login={login}
                  handleLogin={handleLogin}
                  selectMockUser={selectMockUser}
                />
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="h-13 px-8 border-border text-foreground hover:bg-accent/40 text-sm font-semibold rounded-xl transition-all hover:scale-105 cursor-pointer">
              Ver Módulos del Sistema →
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-4 text-[11px] text-foreground-muted">
            {["✓ RGPD Cumplimiento total", "✓ Sin contrato de permanencia", "✓ Soporte en español 24/7", "✓ Migración de datos incluida"].map(b => (
              <span key={b} className="font-medium">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* JANA OS FEATURE MODULES SECTION */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center space-y-3">
          <span className="inline-block rounded-full border border-brain/40 bg-brain/10 px-4 py-1.5 text-[11px] font-bold text-brain uppercase tracking-widest">
            JANA OS · Backstage Intelligence Platform
          </span>
          <h2 className="text-2xl md:text-3xl font-black font-heading">
            Un ecosistema completo para la gestión artística
          </h2>
          <p className="text-sm text-foreground-muted max-w-xl mx-auto">
            5 módulos integrados con IA que cubren todo el ciclo de vida de la escuela y las producciones.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "🧠", name: "Backstage Brain", color: "border-brain/30 bg-brain/5",
              badge: "IA · RAG Seguro", badgeColor: "bg-brain/15 text-brain",
              desc: "Motor de búsqueda semántica con seguridad por roles y sedes. Nunca filtra datos confidenciales al rol incorrecto.",
              roles: ["Dirección", "Profesorado", "Admin"]
            },
            {
              icon: "🎓", name: "Backstage Aula", color: "border-talent/30 bg-talent/5",
              badge: "Pedagogía · Evaluaciones", badgeColor: "bg-talent/15 text-talent",
              desc: "Gestión de clases, calificaciones artísticas y seguimiento individual de alumnos con historial completo.",
              roles: ["Profesorado", "Dirección"]
            },
            {
              icon: "💬", name: "Backstage Chat", color: "border-jana-primary/30 bg-jana-primary/5",
              badge: "Comunicación · IA Copiloto", badgeColor: "bg-jana-primary/15 text-jana-primary-accessible",
              desc: "Canal de ensayos en tiempo real con análisis cognitivo de JANA Brain y sugerencias pedagógicas automáticas.",
              roles: ["Todos los roles"]
            },
            {
              icon: "🕸️", name: "Talent Graph", color: "border-production/30 bg-production/5",
              badge: "SVG Interactivo · WCAG AA", badgeColor: "bg-production/15 text-production",
              desc: "Grafo visual de habilidades y conexiones entre alumnos, disciplinas y niveles. Arrastrable y exportable.",
              roles: ["Dirección", "Admin"]
            },
            {
              icon: "📊", name: "Backstage Panel", color: "border-info/30 bg-info/5",
              badge: "CRM · Verifactu · Finanzas", badgeColor: "bg-info/15 text-info",
              desc: "Dashboard financiero integrado con CRM, emisión de facturas digitales Verifactu y métricas de rentabilidad por sede.",
              roles: ["Dirección", "Admin"]
            },
            {
              icon: "🎬", name: "Remotion Studio", color: "border-brain/20 bg-gradient-to-br from-brain/5 to-jana-primary/5",
              badge: "Video · Animación", badgeColor: "bg-jana-primary/15 text-jana-primary-accessible",
              desc: "Previsualizador dinámico de producciones con animaciones profesionales integradas en el flujo de trabajo.",
              roles: ["Producción"]
            },
          ].map(mod => (
            <div key={mod.name} className={`rounded-2xl border p-5 space-y-3 transition hover:scale-[1.02] ${mod.color}`}>
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl">{mod.icon}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${mod.badgeColor}`}>{mod.badge}</span>
              </div>
              <h3 className="font-bold text-base text-foreground">{mod.name}</h3>
              <p className="text-xs text-foreground-muted leading-relaxed">{mod.desc}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {mod.roles.map(r => (
                  <span key={r} className="text-[10px] font-medium bg-surface-elevated px-2 py-0.5 rounded border border-border">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLIC FOOTER */}
      <footer className="border-t border-border bg-black/30 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between items-start">
            <div className="space-y-3">
              <JanaLogo className="h-10 w-auto" />
              <p className="text-xs text-foreground-muted max-w-xs leading-relaxed">
                Plataforma de gestión artística inteligente para escuelas y compañías de artes escénicas.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
              <div className="space-y-2">
                <p className="font-bold text-foreground uppercase tracking-wider text-[10px]">Formación</p>
                {["Cursos Anuales", "Nuestras Sedes", "Campamentos", "Inscripción"].map(l => (
                  <a key={l} href="#" onClick={e => e.preventDefault()} className="block text-foreground-muted hover:text-jana-primary-accessible transition">{l}</a>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-bold text-foreground uppercase tracking-wider text-[10px]">Producciones</p>
                {["Musicales", "Microconciertos", "Entradas", "Giras"].map(l => (
                  <a key={l} href="#" onClick={e => e.preventDefault()} className="block text-foreground-muted hover:text-jana-primary-accessible transition">{l}</a>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-bold text-foreground uppercase tracking-wider text-[10px]">Legal</p>
                {["Privacidad", "Términos", "WCAG 2.2", "Contactar"].map(l => (
                  <a key={l} href="#" onClick={e => e.preventDefault()} className="block text-foreground-muted hover:text-jana-primary-accessible transition">{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-foreground-muted">
            <p>© 2026 JANA Producciones &amp; Escuela JANA. Todos los derechos reservados.</p>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              <span>JANA OS v1.0 · Sistema Operativo Artístico</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
