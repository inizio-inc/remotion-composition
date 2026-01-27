import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionPage } from "./CaptionPage";
import type { TikTokPage } from "@remotion/captions";

export const SubtitlePage: React.FC<{
  readonly page: TikTokPage;
  readonly highlightColor?: string;
}> = ({ page, highlightColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy entrance animation
  const enter = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    durationInFrames: 5,
  });

  return (
    <AbsoluteFill>
      <CaptionPage
        enterProgress={enter}
        page={page}
        highlightColor={highlightColor}
      />
    </AbsoluteFill>
  );
};
