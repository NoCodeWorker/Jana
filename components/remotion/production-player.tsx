"use client";

import { Player } from "@remotion/player";
import { StageComposition } from "@/components/remotion/stage-composition";

export function ProductionPlayer() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-black shadow-card">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/40 bg-black/60 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-error" />
          <span className="size-2.5 rounded-full bg-warning" />
          <span className="size-2.5 rounded-full bg-success" />
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
          productionTitle: "La Bella y la Bestia",
          scene: "Ensayo general: Acto II · Escena del Baile Principal",
          intensity: 72,
        }}
      />
    </div>
  );
}
