"use client";

import { Player } from "@remotion/player";
import { StageComposition } from "@/components/remotion/stage-composition";

export function ProductionPlayer() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-black shadow-card">
      <Player
        component={StageComposition}
        compositionWidth={1080}
        compositionHeight={720}
        durationInFrames={180}
        fps={30}
        acknowledgeRemotionLicense
        controls
        loop
        autoPlay
        style={{ width: "100%" }}
        inputProps={{
          productionTitle: "Ensayo general: Luz, voz y movimiento",
          scene: "Transicion escenica sincronizada para vista previa de producciones artisticas.",
          intensity: 72,
        }}
      />
    </div>
  );
}
