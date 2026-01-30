"use client";

import { Caption, createTikTokStyleCaptions } from "@remotion/captions";
import { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import SubtitlePage from "./SubtitlePage";

const SWITCH_CAPTIONS_EVERY_MS = 1;

const MediaElement: React.FC<{
  element: any;
  durationInFrames: number;
  fps: number;
}> = ({ element, durationInFrames, fps }) => {
  const frame = useCurrentFrame();

  const scale = element.animations?.find((a: any) => a.type === "scale");
  let scaleValue = 1;
  if (scale) {
    const progress = frame / durationInFrames;
    scaleValue = interpolate(progress, [0, 1], [scale.from, scale.to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // Render video if videoUrl is present, otherwise render image
  if (element.videoUrl) {
    const videoSrc = element.videoUrl.startsWith('http') ? element.videoUrl : staticFile(element.videoUrl);
    return (
      <AbsoluteFill>
        <OffthreadVideo
          src={videoSrc}
          startFrom={0}
          endAt={durationInFrames}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scaleValue})`,
          }}
        />
      </AbsoluteFill>
    );
  }

  // Fallback to image
  const imageSrc = element.imageUrl.startsWith('http') ? element.imageUrl : staticFile(element.imageUrl);
  return (
    <AbsoluteFill>
      <Img
        src={imageSrc}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scaleValue})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const CaptionedVideo: React.FC<{
  timeline: any;
  showCaptions?: boolean;
}> = ({ timeline, showCaptions = true }) => {
  const { fps } = useVideoConfig();
  const [handle] = useState(() => delayRender());
  const [initialized, setInitialized] = useState(false);

  const subtitles = useMemo(() => {
    const convertedCaptions = (timeline.text || []).map((t: any) => {
      const words: Caption[] = [];
      let currentWord = "";
      let wordStartIndex = 0;

      t.timestamps.characters.forEach((char: string, i: number) => {
        if (char === " ") {
          if (currentWord) {
            words.push({
              text: currentWord,
              startMs: t.timestamps.characterStartTimesSeconds[wordStartIndex] * 1000 + t.startMs,
              endMs: t.timestamps.characterEndTimesSeconds[i - 1] * 1000 + t.startMs,
              confidence: 1,
              timestampMs: t.timestamps.characterStartTimesSeconds[wordStartIndex] * 1000 + t.startMs,
            });
            currentWord = "";
          }
          words.push({
            text: " ",
            startMs: t.timestamps.characterStartTimesSeconds[i] * 1000 + t.startMs,
            endMs: t.timestamps.characterEndTimesSeconds[i] * 1000 + t.startMs,
            confidence: 1,
            timestampMs: t.timestamps.characterStartTimesSeconds[i] * 1000 + t.startMs,
          });
        } else {
          if (currentWord === "") {
            wordStartIndex = i;
          }
          currentWord += char;
        }
      });

      if (currentWord) {
        words.push({
          text: currentWord,
          startMs: t.timestamps.characterStartTimesSeconds[wordStartIndex] * 1000 + t.startMs,
          endMs: t.timestamps.characterEndTimesSeconds[t.timestamps.characters.length - 1] * 1000 + t.startMs,
          confidence: 1,
          timestampMs: t.timestamps.characterStartTimesSeconds[wordStartIndex] * 1000 + t.startMs,
        });
      }

      return words;
    }).flat();

    return convertedCaptions;
  }, [timeline.text]);

  useEffect(() => {
    if (!initialized) {
      continueRender(handle);
      setInitialized(true);
    }
  }, [handle, initialized]);

  const { pages } = useMemo(() => {
    if (!subtitles || subtitles.length === 0) {
      return { pages: [] };
    }
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: subtitles,
    });
  }, [subtitles]);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {timeline.elements?.map((element: any, index: number) => {
        const startFrame = (element.startMs / 1000) * fps;
        const durationInFrames = ((element.endMs - element.startMs) / 1000) * fps;
        return (
          <Sequence key={`media-${index}`} from={startFrame} durationInFrames={durationInFrames}>
            <MediaElement element={element} durationInFrames={durationInFrames} fps={fps} />
          </Sequence>
        );
      })}
      {timeline.audio?.map((audio: any, index: number) => {
        const startFrame = (audio.startMs / 1000) * fps;
        // Use staticFile for relative paths, keep full URLs as-is
        const audioSrc = audio.audioUrl.startsWith('http') ? audio.audioUrl : staticFile(audio.audioUrl);
        return (
          <Sequence key={`audio-${index}`} from={startFrame}>
            <Audio src={audioSrc} />
          </Sequence>
        );
      })}
      {showCaptions && pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const lastToken = page.tokens[page.tokens.length - 1];
        const subtitleEndFrame = nextPage
          ? (nextPage.startMs / 1000) * fps
          : ((lastToken.toMs / 1000) * fps) + 15;
        const durationInFrames = subtitleEndFrame - subtitleStartFrame;
        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={`caption-${index}`}
            from={subtitleStartFrame}
            durationInFrames={durationInFrames}
          >
            <SubtitlePage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
