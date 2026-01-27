import { continueRender, delayRender, staticFile } from "remotion";

export const TikTokFont = "TikTokFont";

let loaded = false;

export const loadTikTokFont = async (): Promise<void> => {
  if (loaded) {
    return Promise.resolve();
  }

  const waitForFont = delayRender();
  loaded = true;

  // Use a bold sans-serif font - place your .ttf in public folder
  // Default fallback to system fonts if custom font not available
  try {
    const font = new FontFace(
      TikTokFont,
      `url('${staticFile("fonts/bold.ttf")}') format('truetype')`,
    );
    await font.load();
    document.fonts.add(font);
  } catch {
    // Fallback to system font
    console.warn("Custom TikTok font not found, using system fallback");
  }

  continueRender(waitForFont);
};

// System font fallback stack
export const TIKTOK_FONT_FAMILY = `${TikTokFont}, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
