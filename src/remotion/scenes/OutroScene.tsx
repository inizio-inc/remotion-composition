import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

// Export duration for use in Root.tsx and FullVideo.tsx
export const OUTRO_SCENE_DURATION = 30; // 1 second at 30fps

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Constants - ConceptCraft CTA
  const BACKGROUND_COLOR = "#0f0f23";
  const PRIMARY_COLOR = "#ffffff";
  const ACCENT_COLOR = "#6366f1";
  const CTA_TEXT = "Get Started";
  const URL_TEXT = "conceptcraft.ai";

  // Scale animation for CTA - fast entrance
  const ctaProgress = spring({
    fps,
    frame,
    config: { damping: 15, stiffness: 150 },
  });

  const ctaScale = interpolate(ctaProgress, [0, 1], [0.5, 1]);
  const ctaOpacity = interpolate(ctaProgress, [0, 1], [0, 1]);

  // URL fade in quickly
  const urlOpacity = interpolate(frame, [8, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulsing glow effect
  const glowIntensity = interpolate(frame, [0, 15, 30], [0.4, 0.8, 0.4]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* CTA Button */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaScale})`,
          backgroundColor: ACCENT_COLOR,
          padding: "28px 56px",
          borderRadius: 16,
          boxShadow: `0 0 ${60 * glowIntensity}px ${30 * glowIntensity}px ${ACCENT_COLOR}88`,
          marginBottom: 30,
        }}
      >
        <span
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: PRIMARY_COLOR,
          }}
        >
          {CTA_TEXT}
        </span>
      </div>

      {/* URL */}
      <div
        style={{
          opacity: urlOpacity,
          fontSize: 28,
          fontWeight: 500,
          color: `${PRIMARY_COLOR}cc`,
          letterSpacing: "1px",
        }}
      >
        {URL_TEXT}
      </div>
    </AbsoluteFill>
  );
};
