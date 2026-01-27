import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../../types/constants";

export const CONTENT_SCENE_DURATION = 180; // 6 seconds at 30fps / 3 seconds at 60fps

export const ContentScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background.dark,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: COLORS.text.inverse,
          fontSize: 72,
          fontFamily: "Inter, sans-serif",
        }}
      >
        Content Scene
      </h1>
    </AbsoluteFill>
  );
};
