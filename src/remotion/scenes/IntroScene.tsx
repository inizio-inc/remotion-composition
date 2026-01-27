import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../../../types/constants";

export const INTRO_SCENE_DURATION = 90; // 3 seconds at 30fps / 1.5 seconds at 60fps

export const IntroScene: React.FC = () => {
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
        Intro Scene
      </h1>
    </AbsoluteFill>
  );
};
