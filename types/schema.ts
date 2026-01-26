import { z } from "zod";

// Video render request schema
export const RenderRequest = z.object({
  id: z.string(),
  compositionId: z.string().default("FullVideo"),
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };
