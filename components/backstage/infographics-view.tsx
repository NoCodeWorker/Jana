"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  Share2,
  Download,
  X,
  Loader2,
  Ratio,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
  Wand2,
  CheckCircle2,
  ZoomIn,
  MessageSquare,
} from "lucide-react";
import { useMockData, Infographic } from "@/components/mock-data-context";
import { JanaRole } from "@/lib/jana-auth";
import { cn } from "@/lib/utils";

/* ============================================================
   JANA BRANDING SYSTEM PROMPT (DALL-E 3)
   ============================================================ */
export const JANA_INFOGRAPHIC_SYSTEM_PROMPT = `
You are a world-class infographic designer specialized in performing arts education.
Create a visually stunning, premium infographic for Escuela JANA (Spanish performing arts school).

MANDATORY BRAND IDENTITY:
- COLOR PALETTE (LIGHT MODE):
  * Primary: Vibrant coral-red #E8432D (JANA brand red) — use for key highlights, headers, icons
  * Secondary: Warm cream/ivory #FDF8F3 — use as main background
  * Accent: Deep charcoal #1A1A2E — use for primary text and strong structural elements
  * Support: Warm gold #D4A853 — use for secondary accents and star ratings
  * Subtle: Soft sage #8BA888 — use for supporting body text and dividers
- TYPOGRAPHY: Clean, modern sans-serif (Outfit or Montserrat style). Bold headers, light body text.
- STYLE: Glassmorphism-inspired card containers with subtle shadows. White frosted-glass panels with light red tint borders.
- LAYOUT: Organized in clear hierarchy: Title → Key Concept → 3-5 numbered steps or categories → Footer with JANA logo area.
- VISUAL LANGUAGE: Elegant icons or geometric line-art illustrations. Minimalist but rich. Premium editorial quality.
- MOOD: Inspiring, academic excellence, artistic mastery. Feels like a top European performing arts conservatory.
- LIGHT BACKGROUND: Always use light/white background — never dark mode.
- NO TEXT CLUTTER: Maximum impact with minimum words. Each visual element must add meaning.
- INFOGRAPHIC FORMAT: Educational, structured, easy to scan. Grid or flow-based composition.

The infographic must feel like it belongs in a high-end arts magazine and would be proudly shared by students and teachers.
`.trim();

/* ============================================================
   GENERATION STEPS ANIMATION
   ============================================================ */
const GENERATION_STEPS = [
  "🎨 Analizando prompt educativo...",
  "🖼️ Trazando composición y layout...",
  "🔴 Aplicando paleta de colores JANA...",
  "✍️ Ajustando tipografía y jerarquía visual...",
  "✨ Refinando calidad de imagen...",
  "🚀 Finalizando infografía premium...",
];

/* ============================================================
   MOCK IMAGE POOL (Unsplash — performing arts / education)
   ============================================================ */
const MOCK_IMAGES_16_9 = [
  "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1280&h=720&fit=crop&q=80",
  "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1280&h=720&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&h=720&fit=crop&q=80",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1280&h=720&fit=crop&q=80",
];
const MOCK_IMAGES_9_16 = [
  "https://images.unsplash.com/photo-1547153760-18fc86324498?w=720&h=1280&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=720&h=1280&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?w=720&h=1280&fit=crop&q=80",
];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* ============================================================
   LIGHTBOX COMPONENT
   ============================================================ */
function Lightbox({
  infographic,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  infographic: Infographic;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  const is169 = infographic.aspectRatio === "16:9";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative mx-4 flex max-h-[95vh] w-full max-w-5xl flex-col gap-4"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">{infographic.title}</h2>
            <p className="text-sm text-white/60">
              {infographic.author} · {infographic.sede} · {infographic.createdAt}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={infographic.imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="size-3.5" />
              Descargar
            </a>
            <button
              className="rounded-lg bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              onClick={onClose}
              aria-label="Cerrar lightbox"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Image in locked aspect-ratio container */}
        <div className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl",
          is169 ? "aspect-video w-full" : "mx-auto aspect-[9/16] w-full max-w-sm"
        )}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={infographic.imageUrl}
            alt={infographic.title}
            className="h-full w-full object-contain"
          />
          {/* Aspect ratio badge */}
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <Ratio className="size-3" />
            {infographic.aspectRatio}
          </span>
        </div>

        {/* Distribution metadata, never internal generation prompt */}
        <div className="rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Compartida con</p>
          <p className="text-sm text-white/80">{infographic.audience.length ? infographic.audience.join(", ") : "Pendiente de compartir"}</p>
        </div>

        {/* Nav arrows */}
        {hasPrev && (
          <button
            className="absolute -left-14 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
            onClick={onPrev}
            aria-label="Infografía anterior"
          >
            <ChevronLeft className="size-6" />
          </button>
        )}
        {hasNext && (
          <button
            className="absolute -right-14 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition hover:bg-white/20"
            onClick={onNext}
            aria-label="Infografía siguiente"
          >
            <ChevronRight className="size-6" />
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   INFOGRAPHIC CARD
   ============================================================ */
function InfographicCard({
  infographic,
  onClick,
  index,
  viewed,
  showViewedState = false,
}: {
  infographic: Infographic;
  onClick: () => void;
  index: number;
  viewed?: boolean;
  showViewedState?: boolean;
}) {
  const is169 = infographic.aspectRatio === "16:9";
  return (
    <motion.div
      className="glass-panel group relative cursor-pointer overflow-hidden rounded-2xl border border-border/60 shadow-md transition-shadow hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 300, damping: 25 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      {/* Image */}
      <div className={cn(
        "relative overflow-hidden bg-surface",
        is169 ? "aspect-video" : "aspect-[9/16]"
      )}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={infographic.imageUrl}
          alt={infographic.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
          <ZoomIn className="size-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        {/* Aspect badge */}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
          <Ratio className="size-2.5" />
          {infographic.aspectRatio}
        </span>
        {showViewedState && (
          <span className={cn(
            "absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-black backdrop-blur-sm",
            viewed ? "bg-black/60 text-white" : "bg-jana-primary text-white"
          )}>
            {viewed ? "Vista" : "Nueva"}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="mb-1 line-clamp-2 text-sm font-bold text-foreground">{infographic.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="size-3" />
            {infographic.author}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {infographic.sede}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {infographic.createdAt}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   TEACHER VIEW — Generation Panel
   ============================================================ */
function TeacherInfographicsView({ email, activeSede }: { email: string; activeSede: string }) {
  const { infographics, addInfographic } = useMockData();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [generationState, setGenerationState] = useState<"idle" | "generating" | "done">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<Infographic | null>(null);
  const [shared, setShared] = useState(false);
  const [shareAudience, setShareAudience] = useState<string[]>([`Alumnado ${activeSede}`]);
  const [shareChannels, setShareChannels] = useState<Array<"infographics" | "chat">>(["infographics"]);
  const [lightboxItem, setLightboxItem] = useState<Infographic | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  // Author name from email
  const authorName = email.split("@")[0].replace(".", " ").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerationState("generating");
    setCurrentStep(0);
    setShared(false);
    setGeneratedImage(null);

    // Simulate sequential generation steps
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      setCurrentStep(i + 1);
    }

    // Create mock infographic result
    const imageUrl = aspectRatio === "16:9"
      ? randomFromArray(MOCK_IMAGES_16_9)
      : randomFromArray(MOCK_IMAGES_9_16);

    const newInfographic: Infographic = {
      id: `infog-${Date.now()}`,
      title: prompt.length > 60 ? prompt.slice(0, 57) + "..." : prompt,
      prompt,
      aspectRatio,
      imageUrl,
      createdAt: new Date().toLocaleString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      author: authorName,
      authorRole: "Profesorado JANA",
      sede: activeSede,
      audience: [],
      shareChannels: [],
      viewedBy: [],
    };

    setGeneratedImage(newInfographic);
    setGenerationState("done");
  };

  const handleShare = () => {
    if (!generatedImage) return;
    addInfographic({ ...generatedImage, audience: shareAudience, shareChannels, viewedBy: [] });
    setShared(true);
  };

  const handleNewGeneration = () => {
    setGenerationState("idle");
    setGeneratedImage(null);
    setShared(false);
    setShareAudience([`Alumnado ${activeSede}`]);
    setShareChannels(["infographics"]);
    setPrompt("");
    setTimeout(() => promptRef.current?.focus(), 100);
  };

  // Teacher's own infographics (those they created)
  const myInfographics = infographics.filter(i => i.author === authorName || i.sede === activeSede);
  const audienceOptions = [
    `Alumnado ${activeSede}`,
    "Todo el alumnado",
    "Canto 1ºA",
    "Danza",
    "Teatro Musical",
  ];
  const toggleAudience = (audience: string) => {
    setShareAudience(prev => (
      prev.includes(audience) ? prev.filter(item => item !== audience) : [...prev, audience]
    ));
  };
  const toggleChannel = (channel: "infographics" | "chat") => {
    setShareChannels(prev => (
      prev.includes(channel) ? prev.filter(item => item !== channel) : [...prev, channel]
    ));
  };

  const openLightbox = (item: Infographic) => {
    const idx = myInfographics.findIndex(i => i.id === item.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxItem(item);
  };

  return (
    <div className="dashboard-canvas space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-jana-primary/10">
          <Sparkles className="size-6 text-jana-primary-accessible" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground">BackStage Infographics</h2>
          <p className="text-sm text-muted-foreground">Genera infografías educativas con IA y compártelas con tu alumnado</p>
        </div>
      </div>

      {/* Generation Panel */}
      <div className="glass-panel rounded-2xl border border-border/60 p-6 shadow-lg">
        {generationState === "idle" && (
          <div className="space-y-5">
            <div>
              <label htmlFor="infographic-prompt" className="mb-2 block text-sm font-semibold text-foreground">
                Describe tu infografía
              </label>
              <textarea
                id="infographic-prompt"
                ref={promptRef}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="Ej: Infografía sobre técnica de respiración costodiafragmática para cantantes, con pasos numerados y diagrama anatómico..."
                className="min-h-[100px] w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-jana-primary/40 transition"
                maxLength={500}
              />
              <div className="mt-1 flex justify-end">
                <span className="text-xs text-muted-foreground">{prompt.length}/500</span>
              </div>
            </div>

            {/* Aspect Ratio Selector */}
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">Proporción de imagen</p>
              <div className="flex gap-4">
                {(["16:9", "9:16"] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200",
                      aspectRatio === ratio
                        ? "border-jana-primary bg-jana-primary/5 shadow-md"
                        : "border-border bg-surface hover:border-jana-primary/40 hover:bg-accent/20"
                    )}
                    aria-pressed={aspectRatio === ratio}
                    aria-label={`Seleccionar proporción ${ratio}`}
                  >
                    {/* Preview shape */}
                    <div className={cn(
                      "rounded border-2 bg-gradient-to-br from-jana-primary/20 to-jana-primary/5 transition-colors",
                      aspectRatio === ratio ? "border-jana-primary" : "border-border",
                      ratio === "16:9" ? "h-9 w-16" : "h-16 w-9"
                    )} />
                    <div className="text-center">
                      <p className={cn(
                        "text-sm font-bold transition-colors",
                        aspectRatio === ratio ? "text-jana-primary-accessible" : "text-foreground"
                      )}>
                        {ratio}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ratio === "16:9" ? "Horizontal" : "Vertical"}
                      </p>
                    </div>
                    {aspectRatio === ratio && (
                      <motion.div
                        layoutId="ratio-indicator"
                        className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-jana-primary text-white shadow-md"
                      >
                        <CheckCircle2 className="size-3" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* System Prompt Preview (collapsed) */}
            <details className="group rounded-lg border border-border/50 bg-surface/60 p-3">
              <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-foreground">
                🎨 Ver System Prompt de Branding JANA
              </summary>
              <pre className="mt-3 max-h-32 overflow-y-auto whitespace-pre-wrap text-[10px] text-muted-foreground leading-relaxed">
                {JANA_INFOGRAPHIC_SYSTEM_PROMPT}
              </pre>
            </details>

            <button
              id="generate-infographic-btn"
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-200",
                prompt.trim()
                  ? "bg-jana-primary text-white shadow-lg shadow-jana-primary/25 hover:bg-jana-primary/90 hover:shadow-jana-primary/40 hover:-translate-y-0.5 active:translate-y-0"
                  : "cursor-not-allowed bg-muted text-muted-foreground"
              )}
            >
              <Wand2 className="size-4" />
              Generar Infografía con DALL-E 3
            </button>
          </div>
        )}

        {generationState === "generating" && (
          <div className="flex flex-col items-center gap-6 py-8">
            {/* Animated loader */}
            <div className="relative flex size-20 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-jana-primary/20" style={{ animationDuration: "1.5s" }} />
              <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-jana-primary" />
              <Sparkles className="size-8 text-jana-primary-accessible" />
            </div>

            <div className="text-center">
              <p className="text-base font-bold text-foreground">Generando tu infografía...</p>
              <p className="text-sm text-muted-foreground">DALL-E 3 + Branding JANA</p>
            </div>

            {/* Steps */}
            <div className="w-full max-w-sm space-y-2">
              {GENERATION_STEPS.map((step, i) => (
                <motion.div
                  key={step}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300",
                    i < currentStep
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : i === currentStep
                      ? "bg-jana-primary/10 text-jana-primary-accessible"
                      : "text-muted-foreground opacity-50"
                  )}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i <= currentStep ? 1 : 0.5, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                  ) : i === currentStep ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-jana-primary-accessible" />
                  ) : (
                    <div className="size-4 shrink-0 rounded-full border border-border" />
                  )}
                  <span className="font-medium">{step}</span>
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-border">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-jana-primary to-red-400"
                initial={{ width: "0%" }}
                animate={{ width: `${(currentStep / GENERATION_STEPS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        {generationState === "done" && generatedImage && (
          <motion.div
            className="space-y-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Success header */}
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="size-5" />
              <span className="text-sm font-bold">¡Infografía generada con éxito!</span>
            </div>

            {/* Generated image preview */}
            <div
              className={cn(
                "relative overflow-hidden rounded-xl border-2 border-jana-primary/30 bg-surface shadow-lg cursor-zoom-in",
                generatedImage.aspectRatio === "16:9" ? "aspect-video" : "mx-auto max-w-[280px] aspect-[9/16]"
              )}
              onClick={() => openLightbox(generatedImage)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={generatedImage.imageUrl}
                alt={generatedImage.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 hover:bg-black/20">
                <ZoomIn className="size-8 text-white opacity-0 transition-opacity duration-300 hover:opacity-100" />
              </div>
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-jana-primary px-2.5 py-1 text-[10px] font-black text-white shadow">
                <Ratio className="size-2.5" />
                {generatedImage.aspectRatio}
              </span>
            </div>

            {/* Image details */}
            <div className="rounded-xl bg-surface/80 p-4 text-sm space-y-1.5 border border-border/50">
              <p className="font-bold text-foreground">{generatedImage.title}</p>
              <p className="text-muted-foreground text-xs">Revisa el resultado, elige destinatarios y decide si también se publica como mensaje oficial en Backstage Chat.</p>
            </div>

            <div className="rounded-xl border border-border bg-surface/80 p-4 space-y-4">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">Destinatarios</p>
                <div className="flex flex-wrap gap-2">
                  {audienceOptions.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleAudience(option)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                        shareAudience.includes(option)
                          ? "border-jana-primary bg-jana-primary text-white"
                          : "border-border bg-black/10 text-foreground-muted hover:text-foreground"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">Canales</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {[
                    { id: "infographics" as const, label: "Backstage Infographics", icon: ImageIcon },
                    { id: "chat" as const, label: "Backstage Chat", icon: MessageSquare },
                  ].map(channel => {
                    const Icon = channel.icon;
                    return (
                      <button
                        key={channel.id}
                        type="button"
                        onClick={() => toggleChannel(channel.id)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition cursor-pointer",
                          shareChannels.includes(channel.id)
                            ? "border-jana-primary bg-jana-primary/12 text-jana-primary-accessible"
                            : "border-border bg-black/10 text-foreground-muted hover:text-foreground"
                        )}
                      >
                        <Icon className="size-4" />
                        {channel.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {!shared ? (
                <button
                  id="share-infographic-btn"
                  onClick={handleShare}
                  disabled={!shareAudience.length || !shareChannels.length}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-jana-primary py-3 text-sm font-bold text-white shadow-lg shadow-jana-primary/25 transition hover:bg-jana-primary/90 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Share2 className="size-4" />
                  Compartir recurso
                </button>
              ) : (
                <motion.div
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-500/10 border border-green-500/30 py-3 text-sm font-bold text-green-600 dark:text-green-400"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <CheckCircle2 className="size-4" />
                  Compartida en {shareChannels.includes("chat") ? "Infographics y Chat" : "Infographics"}
                </motion.div>
              )}
              <a
                href={generatedImage.imageUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-accent/40"
              >
                <Download className="size-4" />
                Descargar
              </a>
              <button
                onClick={handleNewGeneration}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:bg-accent/40"
              >
                <Wand2 className="size-4" />
                Nueva
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* My infographics history */}
      {myInfographics.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <ImageIcon className="size-5 text-jana-primary-accessible" />
            <h3 className="text-base font-bold text-foreground">Historial de Infografías</h3>
            <span className="rounded-full bg-jana-primary/10 px-2 py-0.5 text-xs font-bold text-jana-primary-accessible">
              {myInfographics.length}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myInfographics.map((infog, i) => (
              <InfographicCard
                key={infog.id}
                infographic={infog}
                index={i}
                onClick={() => openLightbox(infog)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            infographic={lightboxItem}
            onClose={() => setLightboxItem(null)}
            onPrev={() => {
              const prev = myInfographics[lightboxIndex - 1];
              if (prev) { setLightboxItem(prev); setLightboxIndex(i => i - 1); }
            }}
            onNext={() => {
              const next = myInfographics[lightboxIndex + 1];
              if (next) { setLightboxItem(next); setLightboxIndex(i => i + 1); }
            }}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < myInfographics.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   STUDENT / DIRECTION VIEW — Gallery
   ============================================================ */
function GalleryInfographicsView({ activeRole, email, activeSede }: { activeRole: JanaRole; email: string; activeSede: string }) {
  const { infographics, markInfographicViewed } = useMockData();
  const [filterRatio, setFilterRatio] = useState<"all" | "16:9" | "9:16">("all");
  const [lightboxItem, setLightboxItem] = useState<Infographic | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const visibleInfographics = activeRole === "alumno"
    ? infographics.filter(item => item.audience.includes("Todo el alumnado") || item.audience.some(audience => audience.includes(activeSede)))
    : infographics;
  const filtered = filterRatio === "all" ? visibleInfographics : visibleInfographics.filter(i => i.aspectRatio === filterRatio);
  const unreadCount = activeRole === "alumno" ? filtered.filter(item => !item.viewedBy.includes(email)).length : 0;

  const openLightbox = (item: Infographic) => {
    const idx = filtered.findIndex(i => i.id === item.id);
    setLightboxIndex(idx >= 0 ? idx : 0);
    setLightboxItem(item);
    if (activeRole === "alumno") {
      markInfographicViewed(item.id, email);
    }
  };

  const isAlumno = activeRole === "alumno";

  return (
    <div className="dashboard-canvas space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-jana-primary/10">
          <ImageIcon className="size-6 text-jana-primary-accessible" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-foreground">
            {isAlumno ? "Infografías Educativas" : "Infografías Sede"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isAlumno
              ? "Recursos visuales creados por tus profesores para tu formación artística"
              : "Todas las infografías publicadas en las sedes"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", "16:9", "9:16"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilterRatio(f)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200",
              filterRatio === f
                ? "bg-jana-primary text-white shadow-md"
                : "border border-border bg-surface text-muted-foreground hover:bg-accent/40 hover:text-foreground"
            )}
          >
            {f === "all" ? "Todas" : <><Ratio className="size-3" />{f}</>}
          </button>
        ))}
        <span className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground">
          {isAlumno && unreadCount > 0 && (
            <span className="rounded-full bg-jana-primary px-2 py-1 text-[10px] font-black text-white">{unreadCount} sin ver</span>
          )}
          {filtered.length} infografías
        </span>
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-surface">
            <ImageIcon className="size-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No hay infografías todavía</p>
            <p className="text-sm text-muted-foreground">
              {isAlumno ? "Tus profesores aún no han publicado infografías." : "No hay infografías con este filtro."}
            </p>
          </div>
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:balance]">
          {filtered.map((infog, i) => (
            <div key={infog.id} className="mb-4 break-inside-avoid">
              <InfographicCard
                infographic={infog}
                index={i}
                onClick={() => openLightbox(infog)}
                viewed={infog.viewedBy.includes(email)}
                showViewedState={isAlumno}
              />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <Lightbox
            infographic={lightboxItem}
            onClose={() => setLightboxItem(null)}
            onPrev={() => {
              const prev = filtered[lightboxIndex - 1];
              if (prev) { setLightboxItem(prev); setLightboxIndex(i => i - 1); }
            }}
            onNext={() => {
              const next = filtered[lightboxIndex + 1];
              if (next) { setLightboxItem(next); setLightboxIndex(i => i + 1); }
            }}
            hasPrev={lightboxIndex > 0}
            hasNext={lightboxIndex < filtered.length - 1}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   MAIN EXPORT — Route-aware
   ============================================================ */
export function InfographicsView({
  activeRole,
  email,
  activeSede,
}: {
  activeRole: JanaRole;
  email: string;
  activeSede: string;
}) {
  if (activeRole === "profesor") {
    return <TeacherInfographicsView email={email} activeSede={activeSede} />;
  }
  return <GalleryInfographicsView activeRole={activeRole} email={email} activeSede={activeSede} />;
}
