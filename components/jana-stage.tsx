"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Activity,
  Brain,
  Clapperboard,
  ClipboardCheck,
  GraduationCap,
  Menu,
  Moon,
  ShieldCheck,
  Sun,
  Users,
  MessageSquare,
  Newspaper,
  ChevronDown,
  Home as HomeIcon,
  LayoutTemplate,

} from "lucide-react";
import { useMockData } from "@/components/mock-data-context";
import { AlumnoHomeView } from "@/components/backstage/alumno-home-view";
import { AulaView } from "@/components/backstage/aula-view";
import { BrainView } from "@/components/backstage/brain-view";
import { ChatView } from "@/components/backstage/chat-view";
import { LandingPage } from "@/components/backstage/landing-page";
import { BrandBlock, LoginForm } from "@/components/backstage/login-form";
import { ContentView } from "@/components/backstage/content-view";
import { ExecutiveCockpitView } from "@/components/backstage/executive-cockpit-view";
import { PanelView } from "@/components/backstage/panel-view";
import { StudioView } from "@/components/backstage/studio-view";
import { TalentGraphView } from "@/components/backstage/talent-graph-view";
import { TeacherCockpitView } from "@/components/backstage/teacher-cockpit-view";
import { InfographicsView } from "@/components/backstage/infographics-view";

import { JanaLogo } from "@/components/jana-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { JanaRole } from "@/lib/jana-auth";

const navItems = [
  { label: "Dirección", icon: ShieldCheck },
  { label: "Profesorado", icon: ClipboardCheck },
  { label: "Inicio", icon: HomeIcon },
  { label: "Brain", icon: Brain },
  { label: "Aula", icon: GraduationCap },
  { label: "Chat", icon: MessageSquare },
  { label: "Content", icon: Newspaper },
  { label: "Talent Graph", icon: Users },
  { label: "Studio", icon: Clapperboard },
  { label: "Panel", icon: Activity },
  { label: "Infographics", icon: LayoutTemplate },
];


// Role-aware label overrides: same tab ID, different display name per role
const alumnoNavLabels: Record<string, string> = {
  "Inicio":         "Mi Inicio",
  "Brain":          "Consulta IA",
  "Aula":           "Mi Expediente",
  "Content":        "Recursos",
  "Talent Graph":   "Mi Evolución",
  "Chat":           "Mensajes",
  "Infographics":   "Infografías",
};


const GLOBAL_SCOPE = "Global";
const DEFAULT_SEDE = "Madrid Sede Central";
const sedes = [DEFAULT_SEDE, "Alcalá de Henares", "Majadahonda", "México (CDMX)"];

const rolesList = [
  { role: "direccion", label: "Dirección", user: "direccion@jana.os", tone: "text-jana-primary-accessible" },
  { role: "admin", label: "Administración", user: "admin@jana.os", tone: "text-info" },
  { role: "profesor", label: "Profesorado", user: "profesor@jana.os", tone: "text-talent" },
  { role: "alumno", label: "Alumnado", user: "alumno@jana.os", tone: "text-production" },
];

const demoPasswords: Record<JanaRole, string> = {
  direccion: "DirJana2026!",
  admin: "AdminJana2026!",
  profesor: "ProfJana2026!",
  alumno: "AlumJana2026!",
};

type DropdownOption<T> = {
  value: T;
  label: string;
};

function CustomDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClose = () => setIsOpen(false);
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block text-left", className)} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold hover:bg-accent/40 transition-colors h-9"
      >
        <span className="text-muted-foreground">{label}:</span>
        <span className="text-foreground capitalize">{selectedOption?.label || value}</span>
        <ChevronDown className="size-3 text-muted-foreground transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-44 rounded-lg border border-border bg-popover p-1 shadow-xl backdrop-blur-md z-50 overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left rounded-md px-2.5 py-1.5 text-xs transition-colors capitalize",
                  opt.value === value
                    ? "bg-jana-primary/10 text-jana-primary-accessible font-bold"
                    : "text-foreground-muted hover:text-foreground hover:bg-accent/40"
                )}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const allowedTabsByRole: Record<JanaRole, string[]> = {
  direccion: ["Dirección", "Brain", "Aula", "Chat", "Content", "Talent Graph", "Studio", "Panel", "Infographics"],
  admin: ["Brain", "Chat", "Content", "Studio", "Panel"],
  profesor: ["Profesorado", "Brain", "Aula", "Chat", "Content", "Talent Graph", "Studio", "Infographics"],
  alumno: ["Inicio", "Brain", "Aula", "Chat", "Content", "Talent Graph", "Infographics"],
};


export function JanaStage() {
  const { resolvedTheme, setTheme } = useTheme();
  const {
    activeRole,
    setActiveRole,
    activeSede,
    setActiveSede,
    students,
    teachers,
    contentArticles,
    contentNotifications,
  } = useMockData();

  const getNavBadge = (label: string) => {
    if (activeRole !== "alumno") return null;
    if (label === "Content") {
      const count = contentNotifications.filter(n => !n.read).length;
      return count > 0 ? count : null;
    }
    if (label === "Chat") {
      return 2; // Mock 2 unread messages from teachers/group to show active system
    }
    return null;
  };

  const [activeNav, setActiveNav] = useState("Dirección");
  const [email, setEmail] = useState("direccion@jana.os");
  const [password, setPassword] = useState(demoPasswords.direccion);
  const [login, setLogin] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "Selecciona un rol y valida acceso Backstage.",
  });
  const [showBackstage, setShowBackstage] = useState(false);

  const isLight = resolvedTheme === "light";

  const sedeOptions = useMemo(() => {
    const sedeList = activeRole === "direccion" && activeNav === "Dirección" ? [GLOBAL_SCOPE, ...sedes] : sedes;
    return sedeList.map(s => ({ value: s, label: s }));
  }, [activeRole, activeNav]);
  const roleOptions = useMemo(() => rolesList.map(r => ({ value: r.role as JanaRole, label: r.label })), []);

  // Redirect to allowed tab if current activeNav is not allowed for the active role
  useEffect(() => {
    const allowed = allowedTabsByRole[activeRole];
    if (allowed && !allowed.includes(activeNav)) {
      if (activeRole === "alumno") {
        setActiveNav("Inicio");
      } else if (activeRole === "profesor") {
        setActiveNav("Profesorado");
      } else if (activeRole === "admin") {
        setActiveNav("Panel");
      } else {
        setActiveNav("Dirección");
      }
    }
  }, [activeRole, activeNav]);

  useEffect(() => {
    if (activeRole === "direccion" && activeNav === "Dirección" && activeSede !== GLOBAL_SCOPE) {
      setActiveSede(GLOBAL_SCOPE);
      return;
    }

    if ((activeRole !== "direccion" || activeNav !== "Dirección") && activeSede === GLOBAL_SCOPE) {
      setActiveSede(DEFAULT_SEDE);
    }
  }, [activeRole, activeNav, activeSede, setActiveSede]);

  // Auto-sync email field when clicking user templates
  const selectMockUser = (role: JanaRole, userEmail: string) => {
    setEmail(userEmail);
    setPassword(demoPasswords[role]);
  };

  async function submitCredentials(nextEmail: string, nextPassword: string) {
    setLogin({ status: "loading", message: "Validando credenciales..." });

    let response: Response;
    let payload: {
      ok?: boolean;
      message?: string;
      session?: {
        role: JanaRole;
        defaultStage: string;
      };
    };

    try {
      response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nextEmail, password: nextPassword }),
      });
      payload = await response.json();
    } catch {
      setLogin({ status: "error", message: "No se pudo conectar con el acceso privado. Revisa el servidor local." });
      return;
    }

    if (!response.ok || !payload.ok || !payload.session) {
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
      setActiveNav("Inicio");
    } else if (payload.session.role === "profesor") {
      setActiveNav("Profesorado");
    } else if (payload.session.role === "admin") {
      setActiveNav("Panel");
    } else {
      setActiveNav("Dirección");
    }
    setShowBackstage(true);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitCredentials(email, password);
  }

  async function quickLogin(role: JanaRole, userEmail: string) {
    const nextPassword = demoPasswords[role];
    setEmail(userEmail);
    setPassword(nextPassword);
    await submitCredentials(userEmail, nextPassword);
  }

  // Filter students based on active Sede
  const filteredStudents = useMemo(() => {
    if (activeSede === GLOBAL_SCOPE) return students;
    return students.filter(s => s.sede === activeSede);
  }, [students, activeSede]);

  return (
    <AnimatePresence mode="wait">
      {!showBackstage ? (
        <motion.div
          key="landing-page"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="min-h-screen w-full"
        >
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
            quickLogin={quickLogin}
            selectMockUser={selectMockUser}
            demoProfiles={rolesList}
            articles={contentArticles}
            activeSede={activeSede}
            setActiveSede={setActiveSede}
          />
        </motion.div>
      ) : (
        <motion.main
          key="backstage-dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="stage-vignette h-screen overflow-hidden bg-background"
        >
          <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[280px_1fr]">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="sticky top-0 hidden h-screen min-h-0 flex-col overflow-y-auto border-r border-border bg-surface/72 px-4 py-5 lg:flex">
          <BrandBlock />
          <nav aria-label="Navegación Backstage" className="mt-8 space-y-2">
            {navItems
              .filter((item) => allowedTabsByRole[activeRole]?.includes(item.label))
              .map((item) => {
                const displayLabel = activeRole === "alumno" && alumnoNavLabels[item.label]
                  ? alumnoNavLabels[item.label]
                  : `Backstage ${item.label}`;
                const badge = getNavBadge(item.label);
                return (
                  <Button
                    key={item.label}
                    variant="ghost"
                    className={cn(
                      "h-11 w-full justify-start gap-3 border-l-2 border-transparent text-foreground-muted hover:bg-accent/40 relative",
                      activeNav === item.label && "border-l-jana-primary bg-accent/80 text-foreground"
                    )}
                    onClick={() => setActiveNav(item.label)}
                  >
                    <item.icon className="size-4" aria-hidden="true" />
                    <span>{displayLabel}</span>
                    {badge !== null && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full bg-jana-primary text-[10px] font-black text-white">
                        {badge}
                      </span>
                    )}
                  </Button>
                );
              })}
          </nav>

          <Card className="mt-auto rounded-lg bg-surface-elevated/80 border-border">
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
              <p>Las respuestas y acciones se adaptan de forma automática al rol, sede y contexto permitido.</p>
            </CardContent>
          </Card>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <section className="flex h-screen min-w-0 flex-col overflow-hidden">
          
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
                      {navItems
                        .filter((item) => allowedTabsByRole[activeRole]?.includes(item.label))
                        .map((item) => {
                          const displayLabel = activeRole === "alumno" && alumnoNavLabels[item.label]
                            ? alumnoNavLabels[item.label]
                            : `Backstage ${item.label}`;
                          const badge = getNavBadge(item.label);
                          return (
                            <Button
                              key={item.label}
                              variant="ghost"
                              className={cn(
                                "h-11 w-full justify-start gap-3 text-foreground-muted relative",
                                activeNav === item.label && "bg-accent/80 text-foreground"
                              )}
                              onClick={() => setActiveNav(item.label)}
                            >
                              <item.icon className="size-4" aria-hidden="true" />
                              <span>{displayLabel}</span>
                              {badge !== null && (
                                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full bg-jana-primary text-[10px] font-black text-white">
                                  {badge}
                                </span>
                              )}
                            </Button>
                          );
                        })}
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
                <CustomDropdown
                  label="Sede"
                  value={activeSede}
                  options={sedeOptions}
                  onChange={setActiveSede}
                  className="hidden sm:inline-block"
                />

                <CustomDropdown
                  label="Rol"
                  value={activeRole}
                  options={roleOptions}
                  onChange={(val) => {
                    setActiveRole(val);
                    setLogin({ status: "idle", message: "Rol simulado actualizado." });
                  }}
                  className="hidden sm:inline-block font-semibold text-jana-primary-accessible"
                />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setTheme(isLight ? "dark" : "light")}
                      className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface hover:bg-accent/30 transition cursor-pointer"
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
                      quickLogin={quickLogin}
                      selectMockUser={selectMockUser}
                      demoProfiles={rolesList}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          {/* DYNAMIC DASHBOARD VIEWS CONTAINER */}
          <div className="dashboard-viewport flex-1 overflow-y-auto">
            <AnimatePresence mode="wait" initial={false}>
              {activeNav === "Inicio" && (
                <motion.div
                  key="inicio-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <AlumnoHomeView
                    students={students}
                    activeSede={activeSede}
                    onNavigate={setActiveNav}
                    contentArticles={contentArticles}
                    contentNotifications={contentNotifications}
                    email={email}
                  />
                </motion.div>
              )}

              {activeNav === "Dirección" && (
                <motion.div
                  key="direccion-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <ExecutiveCockpitView activeSede={activeSede} students={students} teachers={teachers} />
                </motion.div>
              )}

              {activeNav === "Profesorado" && (
                <motion.div
                  key="profesorado-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <TeacherCockpitView
                    activeSede={activeSede}
                    students={filteredStudents}
                    teachers={teachers}
                    articles={contentArticles}
                    onNavigate={setActiveNav}
                  />
                </motion.div>
              )}

              {activeNav === "Brain" && (
                <motion.div
                  key="brain-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <BrainView activeRole={activeRole} activeSede={activeSede} onNavigate={setActiveNav} />
                </motion.div>
              )}

              {activeNav === "Aula" && (
                <motion.div
                  key="aula-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <AulaView activeRole={activeRole} activeSede={activeSede} students={filteredStudents} email={email} />
                </motion.div>
              )}

              {activeNav === "Talent Graph" && (
                <motion.div
                  key="talent-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <TalentGraphView students={students} activeRole={activeRole} activeSede={activeSede} email={email} />
                </motion.div>
              )}

              {activeNav === "Content" && (
                <motion.div
                  key="content-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <ContentView activeRole={activeRole} activeSede={activeSede} />
                </motion.div>
              )}

              {activeNav === "Studio" && (
                <motion.div
                  key="studio-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <StudioView />
                </motion.div>
              )}

              {activeNav === "Panel" && (
                <motion.div
                  key="panel-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <PanelView activeSede={activeSede} teachers={teachers} students={filteredStudents} activeRole={activeRole} />
                </motion.div>
              )}

              {activeNav === "Chat" && (
                <motion.div
                  key="chat-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <ChatView activeRole={activeRole} activeSede={activeSede} />
                </motion.div>
              )}

              {activeNav === "Infographics" && (
                <motion.div
                  key="infographics-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                >
                  <InfographicsView activeRole={activeRole} email={email} activeSede={activeSede} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </motion.main>
      )}
    </AnimatePresence>
  );
}

/* ==========================================================================
   SUB-VIEW COMPONENTS
   ========================================================================== */

/* 0. EXECUTIVE COCKPIT (Direction Command Center) */

