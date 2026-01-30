import { CalculateMetadataFunction } from "remotion";
import z from "zod";

// Schema for video composition props
export const videoCompositionSchema = z.object({
  timeline: z.any(),
  showCaptions: z.boolean(),
})

export const calculateCaptionedVideoMetadata: CalculateMetadataFunction<
  z.infer<typeof videoCompositionSchema>
> = async ({ props }) => {
  const fps = 30;

  // Handle completely empty timeline
  if (!props.timeline.audio?.length && !props.timeline.text?.length && !props.timeline.elements?.length) {
    return {
      fps,
      durationInFrames: 30, // 1 second default
    };
  }

  // Calculate duration from available data
  let totalDurationMs = 0;

  // Check audio tracks
  if (props.timeline.audio?.length) {
    const lastAudio = props.timeline.audio[props.timeline.audio.length - 1];
    totalDurationMs = Math.max(totalDurationMs, lastAudio.endMs);
  }

  // Check elements (images/videos)
  if (props.timeline.elements?.length) {
    const lastElement = props.timeline.elements[props.timeline.elements.length - 1];
    totalDurationMs = Math.max(totalDurationMs, lastElement.endMs);
  }

  // Check text with timestamps
  if (props.timeline.text?.length) {
    const lastText = props.timeline.text[props.timeline.text.length - 1];
    if (lastText.timestamps) {
      const lastCharEndTime = lastText.timestamps.characterEndTimesSeconds[lastText.timestamps.characterEndTimesSeconds.length - 1];
      totalDurationMs = Math.max(totalDurationMs, lastText.startMs + (lastCharEndTime * 1000) + 500);
    } else {
      totalDurationMs = Math.max(totalDurationMs, lastText.endMs);
    }
  }

  const durationInFrames = Math.ceil((totalDurationMs / 1000) * fps);

  return {
    fps,
    durationInFrames,
  };
};

// Export client components from separate files
export { CaptionedVideo } from './CaptionedVideo';
