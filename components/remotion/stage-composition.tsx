import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type StageCompositionProps = {
  productionTitle: string;
  scene: string;
  intensity: number;
};

export function StageComposition({
  productionTitle,
  scene,
  intensity,
}: StageCompositionProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = interpolate(frame, [0, fps * 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const cue = interpolate(frame, [fps * 1.4, fps * 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const pulse = interpolate(frame % fps, [0, fps / 2, fps], [0.65, 1, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 5%, rgba(236,105,12,0.46), transparent 34%), linear-gradient(180deg, #14171b 0%, #08090b 100%)",
        color: "#f5f7fa",
        fontFamily: "Outfit, Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "8%",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 28,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          bottom: "18%",
          height: 10,
          borderRadius: 999,
          background: `linear-gradient(90deg, #7c5cff ${intensity * 0.7}%, #ec690c ${
            intensity + 18
          }%, #f5b74f)`,
          boxShadow: `0 0 ${36 * pulse}px rgba(236,105,12,0.72)`,
          transform: `scaleX(${0.35 + cue * 0.65})`,
          transformOrigin: "left center",
        }}
      />
      <Sequence from={0} durationInFrames={fps * 3} layout="none">
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "10%",
            right: "10%",
            opacity: entrance,
            transform: `translateY(${(1 - entrance) * 28}px)`,
          }}
        >
          <div
            style={{
              color: "#f28533",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 0,
              textTransform: "uppercase",
            }}
          >
            JANA Creative Stage System
          </div>
          <div
            style={{
              marginTop: 20,
              maxWidth: 760,
              fontSize: 70,
              lineHeight: 0.92,
              fontWeight: 800,
              letterSpacing: 0,
            }}
          >
            {productionTitle}
          </div>
        </div>
      </Sequence>
      <Sequence from={fps * 2} durationInFrames={fps * 4} layout="none">
        <div
          style={{
            position: "absolute",
            left: "10%",
            right: "10%",
            bottom: "26%",
            opacity: cue,
            color: "rgba(245,247,250,0.82)",
            fontSize: 30,
            lineHeight: 1.25,
          }}
        >
          {scene}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
}
