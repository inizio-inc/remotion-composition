import React from "react";
import { Composition, staticFile } from "remotion";
import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  TIKTOK_FPS,
  TIKTOK_HEIGHT,
  TIKTOK_WIDTH,
} from "../../types/constants";

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

// Import TikTok composition
import { TikTokVideo, tikTokVideoSchema } from "./tiktok";
import { getVideoMetadata } from "@remotion/media-utils";

// Import CaptionedVideo composition (cc-slides compatible)
import { CaptionedVideo, videoCompositionSchema, calculateCaptionedVideoMetadata } from "./captioned";

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

      {/* ============================================ */}
      {/* TikTok/Reels/Shorts - Vertical 9:16         */}
      {/* ============================================ */}

      <Composition
        id="TikTokVideo"
        component={TikTokVideo}
        schema={tikTokVideoSchema}
        calculateMetadata={async ({ props }) => {
          const fps = TIKTOK_FPS;
          try {
            const metadata = await getVideoMetadata(props.src);
            return {
              fps,
              durationInFrames: Math.floor(metadata.durationInSeconds * fps),
            };
          } catch {
            // Fallback duration if no video metadata
            return {
              fps,
              durationInFrames: 60 * fps, // 60 seconds default
            };
          }
        }}
        width={TIKTOK_WIDTH}
        height={TIKTOK_HEIGHT}
        defaultProps={{
          src: staticFile("sample-video.mp4"),
          showSafeZone: true,
          highlightColor: "#39E508",
        }}
      />

      {/* ============================================ */}
      {/* CaptionedVideo - cc-slides compatible        */}
      {/* Timeline-based with character-level captions */}
      {/* ============================================ */}

      <Composition
        id="CaptionedVideo"
        component={CaptionedVideo}
        fps={TIKTOK_FPS}
        width={TIKTOK_WIDTH}
        height={TIKTOK_HEIGHT}
        schema={videoCompositionSchema}
        calculateMetadata={calculateCaptionedVideoMetadata as any}
        defaultProps={{
          timeline: {
            elements: [],
            audio: [],
            text: [],
          },
          showCaptions: true,
        }}
      />
    </>
  );
};
