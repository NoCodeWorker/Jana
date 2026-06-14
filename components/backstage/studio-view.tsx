"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { Activity, Clapperboard, Download, Loader2, Monitor, Smartphone, Square, Video } from "lucide-react";
import { StageComposition } from "@/components/remotion/stage-composition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
export function StudioView() {
  const [productionTitle, setProductionTitle] = useState("La Bella y la Bestia");
  const [scene, setScene] = useState("Ensayo general: Acto II · Escena del Baile Principal");
  const [intensity, setIntensity] = useState(72);
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [bgClip, setBgClip] = useState<"luces" | "canto" | "danza" | "montaje">("luces");
  const [videoUrl, setVideoUrl] = useState("");
  const [customUrlInput, setCustomUrlInput] = useState("");

  // Rendering state
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderLogs, setRenderLogs] = useState<string[]>([]);
  const [renderCompleted, setRenderCompleted] = useState(false);
  const [showRenderModal, setShowRenderModal] = useState(false);

  // Video stock presets
  const presets = [
    {
      id: "luces",
      name: "Focos Estándar JANA (Gradiente)",
      clip: "luces",
      url: "",
      desc: "Gradiente animado original con focos dinámicos en CSS",
    },
    {
      id: "teatro",
      name: "Ensayo de Teatro",
      clip: "montaje",
      url: "https://assets.mixkit.co/videos/preview/mixkit-actor-practicing-a-monologue-in-a-theater-43098-large.mp4",
      desc: "Clip de actor ensayando un monólogo en el escenario",
    },
    {
      id: "danza",
      name: "Clase de Danza",
      clip: "danza",
      url: "https://assets.mixkit.co/videos/preview/mixkit-ballerina-training-in-front-of-a-mirror-48866-large.mp4",
      desc: "Clip de bailarina entrenando frente al espejo de ensayo",
    },
    {
      id: "canto",
      name: "Interpretación de Canto",
      clip: "canto",
      url: "https://assets.mixkit.co/videos/preview/mixkit-singer-singing-into-a-microphone-43099-large.mp4",
      desc: "Clip de vocalista proyectando su voz con micrófono de estudio",
    },
    {
      id: "focos",
      name: "Haces de Luz",
      clip: "luces",
      url: "https://assets.mixkit.co/videos/preview/mixkit-light-beams-from-stage-spotlights-43826-large.mp4",
      desc: "Clip de haces de luces robóticas cruzando el escenario",
    },
  ];

  const handleSelectPreset = (p: typeof presets[0]) => {
    setBgClip(p.clip as "luces" | "canto" | "danza" | "montaje");
    setVideoUrl(p.url);
    setCustomUrlInput(p.url);
  };

  const handleApplyCustomUrl = () => {
    setVideoUrl(customUrlInput);
  };

  // Simulated render loop
  const triggerRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setRenderCompleted(false);
    setShowRenderModal(true);
    setRenderLogs(["[0%] Inicializando entorno de renderizado (Chrome Headless)..."]);

    const steps = [
      { prg: 10, log: "[10%] Lanzando instancia del navegador headless Puppeteer..." },
      { prg: 22, log: "[22%] Conectando con servidor local de Remotion Bundle..." },
      { prg: 35, log: "[35%] Cargando recursos multimedia y fuentes corporativas (Outfit, Inter)..." },
      { prg: 48, log: "[48%] Pre-procesando capas de iluminación y desenfoques radiales en Canvas..." },
      { prg: 60, log: "[60%] Renderizando fotogramas (secuencia frames 1 a 210) en paralelo (x8 hilos)..." },
      { prg: 72, log: "[72%] Exportando fotogramas PNG temporales a la caché del servidor..." },
      { prg: 85, log: "[85%] Codificando pista de vídeo con codec H.264 (FFmpeg multipass)..." },
      { prg: 93, log: "[93%] Multiplexando audio de referencia y pistas de sincronización..." },
      { prg: 100, log: "[100%] ¡Renderizado completado con éxito! Archivo MP4 generado y empaquetado." },
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        setRenderProgress(step.prg);
        setRenderLogs((prev) => [...prev, step.log]);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        setIsRendering(false);
        setRenderCompleted(true);
      }
    }, 1200);
  };

  const handleDownload = () => {
    const downloadUrl = videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-light-beams-from-stage-spotlights-43826-large.mp4";
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `jana-studio-${productionTitle.toLowerCase().replace(/\s+/g, "-")}.mp4`);
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Determine dimension settings based on selected aspect ratio
  const getPlayerDimensions = () => {
    if (aspectRatio === "16:9") return { width: 1280, height: 720, aspectClass: "aspect-video max-h-[480px]" };
    if (aspectRatio === "9:16") return { width: 720, height: 1280, aspectClass: "aspect-[9/16] max-h-[500px]" };
    return { width: 1080, height: 1080, aspectClass: "aspect-square max-h-[450px]" };
  };

  const dims = getPlayerDimensions();

  return (
    <div className="dashboard-canvas space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Clapperboard className="size-6 text-jana-primary" />
            Backstage Studio
          </h2>
          <p className="text-xs text-foreground-muted mt-1 max-w-2xl">
            Edición, previsualización y exportación de vídeos promocionales y de ensayo. Configura aspectos de composición de Remotion y renderiza directamente a MP4 con clips reales.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* LEFT COLUMN: Visualizer Monitor */}
        <div className="flex flex-col items-center justify-start bg-black/45 rounded-xl border border-border overflow-hidden p-6 gap-4 relative">
          <div className="w-full flex items-center justify-between border-b border-border/40 pb-3 mb-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f56]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">
              Monitor de Salida · {aspectRatio} ({dims.width}x{dims.height})
            </div>
            <div className="flex items-center gap-1.5 font-bold text-success text-[10px]">
              <span className="size-1.5 rounded-full bg-success animate-pulse" />
              Previsualización Remotion
            </div>
          </div>

          {/* Player Wrapper Container to constrain dimensions and handle Aspect Ratio changes beautifully */}
          <div className={cn("w-full flex items-center justify-center overflow-hidden rounded-lg border border-border shadow-2xl bg-black/90 relative transition-all duration-300", dims.aspectClass)}>
            <Player
              component={StageComposition}
              compositionWidth={dims.width}
              compositionHeight={dims.height}
              durationInFrames={210}
              fps={30}
              acknowledgeRemotionLicense
              controls
              loop
              autoPlay
              style={{ width: "100%", height: "100%" }}
              inputProps={{
                productionTitle,
                scene,
                intensity,
                bgClip,
                videoUrl,
              }}
            />
          </div>

          <div className="w-full flex items-center justify-between text-[11px] text-foreground-muted pt-2 border-t border-border/20 px-2 mt-2">
            <span>Composición: {productionTitle}</span>
            <span className="font-mono">Total Frames: 210 | 30 FPS (7s)</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Editor Controls */}
        <div className="space-y-6">
          {/* ASPECT RATIO CARD */}
          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-jana-primary-accessible">
                Relación de Aspecto (Aspect Ratio)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition cursor-pointer",
                    aspectRatio === "16:9"
                      ? "border-jana-primary bg-jana-primary/10 text-jana-primary-accessible"
                      : "border-border hover:bg-accent/30 text-foreground-muted"
                  )}
                >
                  <Monitor className="size-5 mb-1.5" />
                  <span className="text-xs font-bold">16:9</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5">Horizontal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition cursor-pointer",
                    aspectRatio === "9:16"
                      ? "border-jana-primary bg-jana-primary/10 text-jana-primary-accessible"
                      : "border-border hover:bg-accent/30 text-foreground-muted"
                  )}
                >
                  <Smartphone className="size-5 mb-1.5" />
                  <span className="text-xs font-bold">9:16</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5">Vertical</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio("1:1")}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-lg border text-center transition cursor-pointer",
                    aspectRatio === "1:1"
                      ? "border-jana-primary bg-jana-primary/10 text-jana-primary-accessible"
                      : "border-border hover:bg-accent/30 text-foreground-muted"
                  )}
                >
                  <Square className="size-5 mb-1.5" />
                  <span className="text-xs font-bold">1:1</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5">Cuadrado</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* OVERLAY TEXTS CARD */}
          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-jana-primary-accessible">
                Textos de Superposición
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="studio-title-input">
                  Título de la Producción
                </label>
                <Input
                  id="studio-title-input"
                  value={productionTitle}
                  onChange={(e) => setProductionTitle(e.target.value)}
                  className="h-10 text-xs bg-black/20 border-border"
                  placeholder="Ej: La Bella y la Bestia"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="studio-scene-input">
                  Detalle de Ensayo / Escena
                </label>
                <Input
                  id="studio-scene-input"
                  value={scene}
                  onChange={(e) => setScene(e.target.value)}
                  className="h-10 text-xs bg-black/20 border-border"
                  placeholder="Ej: Ensayo general..."
                />
              </div>
            </CardContent>
          </Card>

          {/* BACKGROUND MEDIA LIBRARY CARD */}
          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-jana-primary-accessible">
                Biblioteca Multimedia (Vídeo de Fondo)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Presets List */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vídeos Predefinidos JANA</p>
                <div className="grid grid-cols-1 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {presets.map((p) => {
                    const isSelected = videoUrl === p.url && (p.url !== "" || bgClip === p.clip);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPreset(p)}
                        className={cn(
                          "w-full text-left p-2 rounded-lg border text-xs flex justify-between items-center transition cursor-pointer",
                          isSelected
                            ? "border-jana-primary bg-jana-primary/5 text-foreground font-semibold"
                            : "border-border hover:bg-accent/40 text-foreground-muted"
                        )}
                      >
                        <div className="min-w-0">
                          <span className="block truncate text-xs">{p.name}</span>
                          <span className="block truncate text-[9px] text-muted-foreground mt-0.5">{p.desc}</span>
                        </div>
                        <Video className={cn("size-3.5 shrink-0 ml-2", isSelected ? "text-jana-primary" : "text-muted-foreground")} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom URL Input */}
              <div className="space-y-2 pt-2 border-t border-border/40">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="studio-custom-url">
                  Insertar Vídeo Externo (URL .mp4)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="studio-custom-url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    className="h-9 text-[11px] bg-black/20 border-border flex-1 font-mono"
                    placeholder="https://ejemplo.com/video.mp4"
                  />
                  <Button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="h-9 text-xs bg-surface-elevated hover:bg-surface-elevated/80 border border-border px-3 font-semibold"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* INTENSITY & RENDER CARD */}
          <Card className="rounded-xl border-border bg-surface/90">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-jana-primary-accessible">
                Iluminación y Exportación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <label htmlFor="studio-intensity-slider">Intensidad de Focos</label>
                  <span className="text-jana-primary-accessible font-mono font-bold">{intensity}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground font-semibold">10%</span>
                  <input
                    id="studio-intensity-slider"
                    type="range"
                    min="10"
                    max="100"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="w-full h-1.5 bg-black/40 rounded-lg appearance-none cursor-pointer accent-jana-primary"
                  />
                  <span className="text-[10px] text-muted-foreground font-semibold">100%</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border/40">
                <Button
                  onClick={triggerRender}
                  className="w-full h-11 bg-jana-primary hover:bg-jana-primary-hover font-bold text-sm shadow-lg gap-2"
                >
                  <Clapperboard className="size-4" />
                  Renderizar y Descargar MP4
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RENDER TERMINAL DIALOG/MODAL */}
      <Dialog open={showRenderModal} onOpenChange={(open) => !isRendering && setShowRenderModal(open)}>
        <DialogContent className="glass-panel max-w-lg text-foreground border-border/80 text-left">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-left">
              <Activity className={cn("size-5 text-jana-primary", isRendering && "animate-pulse")} />
              Consola de Exportación (JANA Studio Render)
            </DialogTitle>
            <DialogDescription className="text-xs text-left">
              Remotion Engine renderizando frames para {productionTitle}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* PROGRESS BAR */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Progreso del Render</span>
                <span className="font-mono text-jana-primary-accessible">{renderProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden border border-border/30">
                <div
                  className="h-full bg-jana-primary transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>
            </div>

            {/* TERMINAL LOGS */}
            <div className="h-48 rounded-lg border border-border bg-black/80 p-3 font-mono text-[10px] text-success/90 overflow-y-auto space-y-1 text-left">
              {renderLogs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-muted-foreground select-none">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              {isRendering && (
                <div className="flex items-center gap-1 text-muted-foreground animate-pulse mt-1">
                  <span>&gt; Procesando fotogramas...</span>
                  <Loader2 className="size-3 animate-spin" />
                </div>
              )}
            </div>

            {/* ACTION FOOTER */}
            <div className="flex justify-end gap-2 border-t border-border/40 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRenderModal(false)}
                disabled={isRendering}
                className="text-xs"
              >
                Cerrar
              </Button>
              {renderCompleted && (
                <Button
                  onClick={handleDownload}
                  className="bg-success hover:bg-success/90 text-white font-bold text-xs gap-1.5"
                >
                  <Download className="size-3.5" />
                  Descargar Archivo MP4
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ==========================================================================
   PUBLIC LANDING PAGE (Escuela JANA + JANA Producciones)
   ========================================================================== */

