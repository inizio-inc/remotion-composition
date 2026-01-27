import React from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Audio } from "@remotion/media";

// TODO: Import your scenes here
// import { IntroScene, INTRO_SCENE_DURATION } from "./scenes/IntroScene";
// import { FeatureScene, FEATURE_SCENE_DURATION } from "./scenes/FeatureScene";
// import { CTAScene, CTA_SCENE_DURATION } from "./scenes/CTAScene";

// TODO: Calculate total duration from all scenes
export const FULL_VIDEO_DURATION = 300; // 10 seconds placeholder

// Music fade settings
const MUSIC_FADE_IN = 10;
const MUSIC_FADE_OUT = 20;
const MUSIC_VOLUME = 0.25;

const BackgroundMusic: React.FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, MUSIC_FADE_IN], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(
    frame,
    [FULL_VIDEO_DURATION - MUSIC_FADE_OUT, FULL_VIDEO_DURATION],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const volume = fadeIn * fadeOut * MUSIC_VOLUME;

  return <Audio src={staticFile("audio/music.mp3")} volume={volume} />;
};

export const FullVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f23" }}>
      {/* TODO: Add your scenes using Series */}
      {/*
      <Series>
        <Series.Sequence durationInFrames={INTRO_SCENE_DURATION}>
          <IntroScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FEATURE_SCENE_DURATION}>
          <FeatureScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_SCENE_DURATION}>
          <CTAScene />
        </Series.Sequence>
      </Series>
      */}

      {/* Placeholder - remove when adding scenes */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "white",
          fontSize: 48,
          fontFamily: "Inter, sans-serif",
        }}
      >
        Create your scenes in src/remotion/scenes/
      </div>

      {/* Voiceover */}
      <Audio src={staticFile("audio/voiceover.wav")} volume={1} />

      {/* Background music with fade in/out */}
      <BackgroundMusic />
    </AbsoluteFill>
  );
};
