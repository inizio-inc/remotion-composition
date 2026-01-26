import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Export duration for use in Root.tsx and FullVideo.tsx
export const INTRO_SCENE_DURATION = 45; // 1.5 seconds at 30fps

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Constants - ConceptCraft branding
  const BACKGROUND_COLOR = "#0f0f23";
  const PRIMARY_COLOR = "#ffffff";
  const ACCENT_COLOR = "#6366f1";
  const TITLE_TEXT = "ConceptCraft";

  // Title animation - dramatic spring entrance
  const titleProgress = spring({
    fps,
    frame,
    config: { damping: 15, stiffness: 80, mass: 1 },
  });

  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);
  const titleScale = interpolate(titleProgress, [0, 1], [0.8, 1]);

  // Accent line animation - grows from center
  const lineProgress = spring({
    fps,
    frame: frame - 10,
    config: { damping: 20, stiffness: 100 },
  });

  const lineWidth = interpolate(lineProgress, [0, 1], [0, 300], {
    extrapolateLeft: "clamp",
  });

  // Subtle glow pulse
  const glowIntensity = interpolate(frame, [0, 45], [0.3, 0.6]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Title with glow */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `scale(${titleScale})`,
          fontSize: 120,
          fontWeight: 800,
          color: PRIMARY_COLOR,
          textAlign: "center",
          textShadow: `0 0 ${60 * glowIntensity}px ${ACCENT_COLOR}`,
          letterSpacing: "-2px",
        }}
      >
        {TITLE_TEXT}
      </div>

      {/* Accent line below */}
      <div
        style={{
          width: lineWidth,
          height: 6,
          backgroundColor: ACCENT_COLOR,
          borderRadius: 3,
          marginTop: 30,
          boxShadow: `0 0 20px ${ACCENT_COLOR}`,
        }}
      />
    </AbsoluteFill>
  );
};
