// Standard FPS for all video generation
export const DEFAULT_FPS = 30;

// Video configuration - Landscape (16:9)
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_FPS = DEFAULT_FPS;

// TikTok/Reels/Shorts configuration - Vertical (9:16)
export const TIKTOK_WIDTH = 1080;
export const TIKTOK_HEIGHT = 1920;
export const TIKTOK_FPS = DEFAULT_FPS;

// Default colors (can be overridden per scene)
export const COLORS = {
  background: {
    dark: "#0f0f23",
    light: "#ffffff",
    cream: "#f5f5f0",
  },
  text: {
    primary: "#1a1a2e",
    inverse: "#ffffff",
    muted: "rgba(255, 255, 255, 0.6)",
  },
  accent: {
    primary: "#6366f1",
    secondary: "#0EA5E9",
  },
};

// Default fonts
export const FONTS = {
  primary: "Inter, sans-serif",
  mono: "JetBrains Mono, monospace",
};
