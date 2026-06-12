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

  // Global entrance
  const bgIn = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Title entrance
  const titleIn = interpolate(frame, [fps * 0.3, fps * 1.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Subtitle entrance
  const subIn = interpolate(frame, [fps * 1.8, fps * 2.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Stats entrance (bottom row)
  const statsIn = interpolate(frame, [fps * 2.5, fps * 3.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Curtain bar progress
  const barProgress = interpolate(frame, [fps * 0.5, fps * 3.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Glow pulse
  const glowPulse = interpolate(frame % (fps * 2), [0, fps, fps * 2], [0.7, 1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Spotlight 1 sway
  const spot1 = interpolate(frame % (fps * 3), [0, fps * 1.5, fps * 3], [-12, 12, -12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  // Spotlight 2 sway (opposite)
  const spot2 = interpolate(frame % (fps * 3), [0, fps * 1.5, fps * 3], [12, -12, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  // Counter animation for "400+ alumnos"
  const counterVal = Math.round(interpolate(frame, [fps * 2.5, fps * 4.5], [0, 400], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  }));

  const stats = [
    { label: "Alumnos", value: counterVal + "+", color: "#1fbf75" },
    { label: "Sedes", value: "3", color: "#7c5cff" },
    { label: "Producciones", value: "50+", color: "#f5b74f" },
    { label: "Años", value: "15+", color: "#ec690c" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0d0f12 0%, #14171b 50%, #08090b 100%)",
        color: "#f5f7fa",
        fontFamily: "Outfit, Inter, sans-serif",
        overflow: "hidden",
        opacity: bgIn,
      }}
    >
      {/* === SPOTLIGHT 1 (left) === */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "28%",
          width: 3,
          height: "100%",
          background: "linear-gradient(180deg, rgba(245,183,79,0.9) 0%, rgba(245,183,79,0.1) 60%, transparent 100%)",
          transform: `rotate(${spot1}deg)`,
          transformOrigin: "top center",
          filter: "blur(4px)",
          opacity: 0.6 * bgIn,
        }}
      />
      {/* Spotlight cone 1 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          width: "20%",
          height: "70%",
          background: "linear-gradient(160deg, rgba(245,183,79,0.18) 0%, transparent 100%)",
          transform: `rotate(${spot1 * 0.5}deg)`,
          transformOrigin: "top center",
          filter: "blur(12px)",
          opacity: bgIn,
        }}
      />

      {/* === SPOTLIGHT 2 (right) === */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "28%",
          width: 3,
          height: "100%",
          background: "linear-gradient(180deg, rgba(236,105,12,0.9) 0%, rgba(236,105,12,0.1) 60%, transparent 100%)",
          transform: `rotate(${spot2}deg)`,
          transformOrigin: "top center",
          filter: "blur(4px)",
          opacity: 0.6 * bgIn,
        }}
      />
      {/* Spotlight cone 2 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: "20%",
          width: "20%",
          height: "70%",
          background: "linear-gradient(200deg, rgba(236,105,12,0.18) 0%, transparent 100%)",
          transform: `rotate(${spot2 * 0.5}deg)`,
          transformOrigin: "top center",
          filter: "blur(12px)",
          opacity: bgIn,
        }}
      />

      {/* === CENTER GLOW === */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "30%",
          right: "30%",
          height: "50%",
          background: `radial-gradient(ellipse at 50% 10%, rgba(236,105,12,${0.35 * glowPulse}), transparent 70%)`,
          filter: "blur(20px)",
        }}
      />

      {/* === STAGE FLOOR LINE === */}
      <div
        style={{
          position: "absolute",
          bottom: "22%",
          left: "5%",
          right: "5%",
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.12) 80%, transparent)",
          opacity: bgIn,
        }}
      />

      {/* === LABEL (top) === */}
      <Sequence from={0} durationInFrames={fps * 6} layout="none">
        <div
          style={{
            position: "absolute",
            top: "7%",
            left: "8%",
            opacity: titleIn,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 99,
              background: "#ec690c",
              boxShadow: `0 0 12px rgba(236,105,12,0.8)`,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#f28533",
            }}
          >
            JANA Creative Stage System
          </span>
        </div>
      </Sequence>

      {/* === MAIN TITLE === */}
      <Sequence from={Math.floor(fps * 0.3)} durationInFrames={fps * 6} layout="none">
        <div
          style={{
            position: "absolute",
            top: "18%",
            left: "8%",
            right: "8%",
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 40}px)`,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: -2,
              background: "linear-gradient(135deg, #ffffff 30%, #f28533 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              maxWidth: 700,
            }}
          >
            {productionTitle}
          </div>
        </div>
      </Sequence>

      {/* === SCENE DESCRIPTION === */}
      <Sequence from={Math.floor(fps * 1.8)} durationInFrames={fps * 5} layout="none">
        <div
          style={{
            position: "absolute",
            left: "8%",
            right: "30%",
            bottom: "30%",
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 20}px)`,
            fontSize: 22,
            lineHeight: 1.4,
            color: "rgba(245,247,250,0.75)",
            fontWeight: 400,
          }}
        >
          {scene}
        </div>
      </Sequence>

      {/* === PROGRESS BAR (curtain) === */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: "14%",
          height: 6,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          opacity: bgIn,
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 999,
            width: `${barProgress * 100}%`,
            background: `linear-gradient(90deg, #7c5cff, #ec690c ${intensity}%, #f5b74f)`,
            boxShadow: `0 0 ${20 * glowPulse}px rgba(236,105,12,0.7)`,
            transition: "width 0.016s linear",
          }}
        />
      </div>

      {/* === KPI STATS ROW (bottom) === */}
      <Sequence from={Math.floor(fps * 2.5)} durationInFrames={fps * 4} layout="none">
        <div
          style={{
            position: "absolute",
            bottom: "4%",
            left: "8%",
            right: "8%",
            display: "flex",
            gap: 24,
            opacity: statsIn,
            transform: `translateY(${(1 - statsIn) * 16}px)`,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${s.color}44`,
                borderRadius: 12,
                padding: "10px 18px",
                textAlign: "center",
                minWidth: 110,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "rgba(245,247,250,0.55)",
                  marginTop: 4,
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Sequence>
    </AbsoluteFill>
  );
}
