import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// Export duration for use in Root.tsx and FullVideo.tsx
export const CONTENT_SCENE_DURATION = 75; // 2.5 seconds at 30fps

export const ContentScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Constants - ConceptCraft value proposition
  const BACKGROUND_COLOR = "#0f0f23";
  const PRIMARY_COLOR = "#ffffff";
  const ACCENT_COLOR = "#6366f1";
  const HEADING_TEXT = "Turbocharge your product development";
  const SUBHEADING_TEXT = "with AI";

  // Heading animation - slide up
  const headingProgress = spring({
    fps,
    frame,
    config: { damping: 20, stiffness: 100 },
  });

  const headingOpacity = interpolate(headingProgress, [0, 1], [0, 1]);
  const headingY = interpolate(headingProgress, [0, 1], [60, 0]);

  // Subheading animation - delayed with accent color
  const subProgress = spring({
    fps,
    frame: frame - 15,
    config: { damping: 20, stiffness: 100 },
  });

  const subOpacity = interpolate(subProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
  });
  const subY = interpolate(subProgress, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
  });

  // Subtle background gradient pulse
  const gradientOpacity = interpolate(frame, [0, 75], [0.1, 0.3]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BACKGROUND_COLOR,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at center, ${ACCENT_COLOR}${Math.round(gradientOpacity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        }}
      />

      {/* Content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        {/* Main heading */}
        <div
          style={{
            opacity: headingOpacity,
            transform: `translateY(${headingY}px)`,
            fontSize: 72,
            fontWeight: 700,
            color: PRIMARY_COLOR,
            maxWidth: 1200,
            lineHeight: 1.1,
          }}
        >
          {HEADING_TEXT}
        </div>

        {/* AI highlight */}
        <div
          style={{
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            fontSize: 80,
            fontWeight: 800,
            color: ACCENT_COLOR,
            marginTop: 20,
            textShadow: `0 0 40px ${ACCENT_COLOR}`,
          }}
        >
          {SUBHEADING_TEXT}
        </div>
      </div>
    </AbsoluteFill>
  );
};
