import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TIKTOK_FONT_FAMILY } from "./load-font";
import { fitText } from "@remotion/layout-utils";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import type { TikTokPage } from "@remotion/captions";

const DESIRED_FONT_SIZE = 120;
const HIGHLIGHT_COLOR = "#39E508"; // TikTok green
const DEFAULT_COLOR = "#FFFFFF";

const containerStyle: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: 350, // Above the 384px bottom safe zone
  height: 150,
};

export const CaptionPage: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
  readonly highlightColor?: string;
}> = ({ enterProgress, page, highlightColor = HIGHLIGHT_COLOR }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily: TIKTOK_FONT_FAMILY,
    text: page.text,
    withinWidth: width * 0.85, // Leave space for right icons
    textTransform: "uppercase",
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  return (
    <AbsoluteFill style={containerStyle}>
      <div
        style={{
          fontSize,
          color: DEFAULT_COLOR,
          WebkitTextStroke: "16px black",
          paintOrder: "stroke",
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          fontFamily: TIKTOK_FONT_FAMILY,
          textTransform: "uppercase",
          fontWeight: 900,
          textAlign: "center",
          paddingLeft: 40,
          paddingRight: 140, // Clear of right icons
        }}
      >
        {page.tokens.map((token) => {
          const startRelativeToSequence = token.fromMs - page.startMs;
          const endRelativeToSequence = token.toMs - page.startMs;

          const active =
            startRelativeToSequence <= timeInMs &&
            endRelativeToSequence > timeInMs;

          return (
            <span
              key={token.fromMs}
              style={{
                display: "inline",
                whiteSpace: "pre",
                color: active ? highlightColor : DEFAULT_COLOR,
                transition: "color 0.05s ease-out",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
