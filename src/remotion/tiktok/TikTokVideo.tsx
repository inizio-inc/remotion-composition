import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  getStaticFiles,
  OffthreadVideo,
  Sequence,
  useDelayRender,
  useVideoConfig,
  watchStaticFile,
} from "remotion";
import { z } from "zod";
import { SubtitlePage } from "./SubtitlePage";
import { loadTikTokFont } from "./load-font";
import { SafeZoneGuide } from "../shared/SafeZoneGuide";
import { Caption, createTikTokStyleCaptions } from "@remotion/captions";

export const tikTokVideoSchema = z.object({
  src: z.string(),
  showSafeZone: z.boolean().optional().default(false),
  highlightColor: z.string().optional().default("#39E508"),
});

// How many captions should be displayed at a time?
// - 200-400: one word at a time
// - 1000-1500: phrase-based (2-4 words)
// - 3000+: full sentences
const SWITCH_CAPTIONS_EVERY_MS = 1200;

const getFileExists = (file: string) => {
  const files = getStaticFiles();
  return files.some((f) => f.src === file);
};

export const TikTokVideo: React.FC<z.infer<typeof tikTokVideoSchema>> = ({
  src,
  showSafeZone = false,
  highlightColor = "#39E508",
}) => {
  const [subtitles, setSubtitles] = useState<Caption[]>([]);
  const { delayRender, continueRender } = useDelayRender();
  const [handle] = useState(() => delayRender());
  const { fps } = useVideoConfig();

  // Look for JSON caption file next to video
  const subtitlesFile = src
    .replace(/.mp4$/, ".json")
    .replace(/.mkv$/, ".json")
    .replace(/.mov$/, ".json")
    .replace(/.webm$/, ".json");

  const fetchSubtitles = useCallback(async () => {
    try {
      await loadTikTokFont();

      if (getFileExists(subtitlesFile)) {
        const res = await fetch(subtitlesFile);
        const data = (await res.json()) as Caption[];
        setSubtitles(data);
      }

      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [continueRender, handle, subtitlesFile]);

  useEffect(() => {
    fetchSubtitles();

    const c = watchStaticFile(subtitlesFile, () => {
      fetchSubtitles();
    });

    return () => {
      c.cancel();
    };
  }, [fetchSubtitles, subtitlesFile]);

  const { pages } = useMemo(() => {
    return createTikTokStyleCaptions({
      combineTokensWithinMilliseconds: SWITCH_CAPTIONS_EVERY_MS,
      captions: subtitles ?? [],
    });
  }, [subtitles]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Background video */}
      <AbsoluteFill>
        <OffthreadVideo
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          src={src}
        />
      </AbsoluteFill>

      {/* Captions */}
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const subtitleStartFrame = (page.startMs / 1000) * fps;
        const subtitleEndFrame = Math.min(
          nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
          subtitleStartFrame + SWITCH_CAPTIONS_EVERY_MS,
        );
        const durationInFrames = subtitleEndFrame - subtitleStartFrame;

        if (durationInFrames <= 0) {
          return null;
        }

        return (
          <Sequence
            key={index}
            from={subtitleStartFrame}
            durationInFrames={durationInFrames}
          >
            <SubtitlePage page={page} highlightColor={highlightColor} />
          </Sequence>
        );
      })}

      {/* Safe zone guide (dev only) */}
      <SafeZoneGuide enabled={showSafeZone} />
    </AbsoluteFill>
  );
};
