import React from "react";
import { Composition } from "remotion";
import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  TIKTOK_FPS,
  TIKTOK_HEIGHT,
  TIKTOK_WIDTH,
} from "../../types/constants";

// Both YouTube and TikTok use the same timeline-based composition.
// Only differences: dimensions and captions toggle.
import { Video, videoSchema, calculateVideoMetadata } from "./video";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ============================================ */}
      {/* YOUTUBE - Landscape 16:9 (1920x1080)        */}
      {/* ============================================ */}
      {/*
        Usage: pnpm exec remotion render YouTubeVideo out/youtube.mp4 \
               --props='{"timeline":'$(cat public/video-manifest.json | jq -c .timeline)',"showCaptions":false}'

        Timeline-based, NO captions.
      */}

      <Composition
        id="YouTubeVideo"
        component={Video}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        schema={videoSchema}
        calculateMetadata={calculateVideoMetadata as any}
        defaultProps={{
          timeline: {
            elements: [],
            audio: [],
            text: [],
          },
          showCaptions: false,
        }}
      />

      {/* ============================================ */}
      {/* TIKTOK/REELS/SHORTS - Vertical 9:16         */}
      {/* ============================================ */}
      {/*
        Usage: pnpm exec remotion render TikTokVideo out/tiktok.mp4 \
               --props='{"timeline":'$(cat public/video-manifest.json | jq -c .timeline)',"showCaptions":true}'

        Timeline-based, WITH captions.
      */}

      <Composition
        id="TikTokVideo"
        component={Video}
        fps={TIKTOK_FPS}
        width={TIKTOK_WIDTH}
        height={TIKTOK_HEIGHT}
        schema={videoSchema}
        calculateMetadata={calculateVideoMetadata as any}
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
