import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../../types/constants";

export const OUTRO_SCENE_DURATION = 90; // 3 seconds at 30fps

export const OutroScene: React.FC = () => {
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
        Outro Scene
      </h1>
    </AbsoluteFill>
  );
};
