"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { Video } from "../remotion/video";

const Home: NextPage = () => {
  const [timeline, setTimeline] = useState<any>(null);

  useEffect(() => {
    fetch("/video-manifest.json")
      .then((res) => res.json())
      .then((data) => setTimeline(data.timeline))
      .catch(() => setTimeline({ elements: [], audio: [], text: [] }));
  }, []);

  if (!timeline) {
    return (
      <div className="max-w-screen-md m-auto mb-5">
        <h1 className="text-2xl font-bold mt-16 mb-4">Loading...</h1>
      </div>
    );
  }

  // Calculate duration from timeline
  let durationMs = 1000;
  if (timeline.audio?.length) {
    const lastAudio = timeline.audio[timeline.audio.length - 1];
    durationMs = Math.max(durationMs, lastAudio.endMs);
  }
  if (timeline.text?.length) {
    const lastText = timeline.text[timeline.text.length - 1];
    durationMs = Math.max(durationMs, lastText.endMs);
  }
  const durationInFrames = Math.ceil((durationMs / 1000) * VIDEO_FPS);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <h1 className="text-2xl font-bold mt-16 mb-4">Video Preview</h1>
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10">
          <Player
            component={Video}
            inputProps={{ timeline, showCaptions: false }}
            durationInFrames={durationInFrames}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{
              width: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>
        <p className="text-gray-500 text-sm">
          Run <code className="bg-gray-100 px-2 py-1 rounded">npx remotion studio</code> for the full editing experience.
        </p>
      </div>
    </div>
  );
};

export default Home;
