"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { FullVideo, FULL_VIDEO_DURATION } from "../remotion/FullVideo";

const Home: NextPage = () => {
  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <h1 className="text-2xl font-bold mt-16 mb-4">Video Preview</h1>
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10">
          <Player
            component={FullVideo}
            durationInFrames={FULL_VIDEO_DURATION}
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
