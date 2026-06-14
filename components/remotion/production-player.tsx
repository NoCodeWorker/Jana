"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { StageComposition } from "@/components/remotion/stage-composition";
import { Input } from "@/components/ui/input";

export function ProductionPlayer() {
  const [productionTitle, setProductionTitle] = useState("La Bella y la Bestia");
  const [scene, setScene] = useState("Ensayo general: Acto II · Escena del Baile Principal");
  const [intensity, setIntensity] = useState(72);

  return (
    <div className="space-y-4 bg-surface/30 p-4 rounded-xl border border-border/80">
      {/* Player Frame */}
      <div className="overflow-hidden rounded-xl border border-border bg-black shadow-card">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-border/40 bg-black/60 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-[#ff5f56]" />
            <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="size-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <span className="text-[10px] font-bold text-foreground-muted tracking-widest uppercase">
            JANA Studio · Remotion Render Preview
          </span>
          <div className="flex items-center gap-1.5 text-[10px] text-success font-medium">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            Live
          </div>
        </div>

        <Player
          component={StageComposition}
          compositionWidth={1280}
          compositionHeight={720}
          durationInFrames={210}
          fps={30}
          acknowledgeRemotionLicense
          controls
          loop
          autoPlay
          style={{ width: "100%" }}
          inputProps={{
            productionTitle,
            scene,
            intensity,
          }}
        />
      </div>

      {/* Control panel for live rendering variables */}
      <div className="rounded-lg border border-border bg-surface p-4 space-y-3 shadow-sm">
        <div className="space-y-1">
          <p className="text-xs font-bold text-jana-primary-accessible uppercase tracking-wider">
            Consola de Variables del Render (Remotion)
          </p>
          <p className="text-[10px] text-foreground-muted leading-relaxed">
            Modifica los textos o la intensidad de focos para ver cómo la previsualización se recalcula y renderiza en vivo en el vídeo.
          </p>
        </div>

        <div className="space-y-3 pt-2 border-t border-border/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="prod-title-input">
                Título de la Producción
              </label>
              <Input
                id="prod-title-input"
                value={productionTitle}
                onChange={(e) => setProductionTitle(e.target.value)}
                className="h-9 text-xs bg-black/20 border-border"
                placeholder="Ej: La Bella y la Bestia"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground" htmlFor="prod-scene-input">
                Escena / Foco de Ensayo
              </label>
              <Input
                id="prod-scene-input"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
                className="h-9 text-xs bg-black/20 border-border"
                placeholder="Ej: Ensayo general..."
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <label htmlFor="intensity-slider">Intensidad de Focos de Escenario</label>
              <span className="text-jana-primary-accessible font-mono font-bold">{intensity}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground font-semibold">10%</span>
              <input
                id="intensity-slider"
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
        </div>
      </div>
    </div>
  );
}
