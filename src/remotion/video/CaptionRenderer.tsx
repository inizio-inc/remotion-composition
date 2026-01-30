'use client';
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { fitText } from "@remotion/layout-utils";
import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";

const fontFamily = "Bangers";

loadFont({
  family: fontFamily,
  url: staticFile("fonts/bangers.ttf"),
});

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: 350,
  height: 150,
};

const DESIRED_FONT_SIZE = 180;

export const CaptionRenderer: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  // Memoize text fitting to avoid recalculation on every frame
  const fontSize = useMemo(() => {
    try {
      const fittedText = fitText({
        fontFamily: fontFamily,
        text: page.text,
        withinWidth: width * 0.9,
        textTransform: "uppercase",
      });
      return Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);
    } catch (error) {
      // Fallback if measureText is not available (during SSR or initial render)
      // Calculate approximate font size based on text length
      const textLength = page.text.length;
      const targetWidth = width * 0.9;
      // Approximate: each character at font size X takes ~0.6*X pixels
      const approximateFontSize = Math.floor(targetWidth / (textLength * 0.6));
      return Math.min(DESIRED_FONT_SIZE, Math.max(60, approximateFontSize));
    }
  }, [page.text, width]);

  const currentToken = page.tokens.find((t) => {
    const startRelativeToSequence = t.fromMs - page.startMs;
    const endRelativeToSequence = t.toMs - page.startMs;
    return startRelativeToSequence <= timeInMs && endRelativeToSequence > timeInMs;
  });

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          fontSize,
          fontWeight: 900,
          color: "white",
          WebkitTextStroke: "8px black",
          paintOrder: "stroke fill",
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          fontFamily,
          textTransform: "uppercase",
          letterSpacing: "2px",
        }}
      >
        {currentToken?.text || ""}
      </div>
    </AbsoluteFill>
  );
};
