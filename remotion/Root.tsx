import { Composition } from "remotion";
import { StageComposition } from "@/components/remotion/stage-composition";

export function RemotionRoot() {
  return (
    <Composition
      id="JanaStagePreview"
      component={StageComposition}
      durationInFrames={180}
      fps={30}
      width={1080}
      height={720}
      defaultProps={{
        productionTitle: "JANA Creative Stage System",
        scene: "Vista de produccion con cues, intensidad y timing para piezas artisticas.",
        intensity: 68,
      }}
    />
  );
}
