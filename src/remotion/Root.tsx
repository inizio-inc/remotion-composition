import React from "react";
import { Composition } from "remotion";
import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_WIDTH } from "../../types/constants";

// Import individual scenes (for preview/development)
import {
  IntroScene,
  INTRO_SCENE_DURATION,
  ContentScene,
  CONTENT_SCENE_DURATION,
  OutroScene,
  OUTRO_SCENE_DURATION,
} from "./scenes";

// Import full video composition
import { FullVideo, FULL_VIDEO_DURATION } from "./FullVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ============================================ */}
      {/* Individual Scenes - for preview/development */}
      {/* ============================================ */}

      <Composition
        id="IntroScene"
        component={IntroScene}
        durationInFrames={INTRO_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="ContentScene"
        component={ContentScene}
        durationInFrames={CONTENT_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="OutroScene"
        component={OutroScene}
        durationInFrames={OUTRO_SCENE_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      {/* ============================================ */}
      {/* Full Video - all scenes combined            */}
      {/* ============================================ */}

      <Composition
        id="FullVideo"
        component={FullVideo}
        durationInFrames={FULL_VIDEO_DURATION}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
