import React from "react";
import { AbsoluteFill, Series, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Audio } from "@remotion/media";
import {
  IntroScene,
  INTRO_SCENE_DURATION,
  ContentScene,
  CONTENT_SCENE_DURATION,
  OutroScene,
  OUTRO_SCENE_DURATION,
} from "./scenes";

// Total duration of all scenes combined
export const FULL_VIDEO_DURATION =
  INTRO_SCENE_DURATION +
  CONTENT_SCENE_DURATION +
  OUTRO_SCENE_DURATION;

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
    <AbsoluteFill>
      {/* Sequence all scenes using Series */}
      <Series>
        <Series.Sequence durationInFrames={INTRO_SCENE_DURATION}>
          <IntroScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={CONTENT_SCENE_DURATION}>
          <ContentScene />
        </Series.Sequence>

        <Series.Sequence durationInFrames={OUTRO_SCENE_DURATION}>
          <OutroScene />
        </Series.Sequence>
      </Series>

      {/* Voiceover */}
      <Audio src={staticFile("audio/voiceover.wav")} volume={1} />

      {/* Background music with fade in/out */}
      <BackgroundMusic />
    </AbsoluteFill>
  );
};
