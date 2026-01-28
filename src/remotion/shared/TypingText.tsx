import { useCurrentFrame } from "remotion";

interface TypingTextProps {
  text: string;
  /** Frame when typing starts */
  startFrame?: number;
  /** Average frames per character (will vary for natural feel) */
  framesPerChar?: number;
  /** Show blinking cursor */
  showCursor?: boolean;
  /** Cursor blink interval in frames */
  cursorBlinkInterval?: number;
  /** Cursor character */
  cursorChar?: string;
  /** Text styles */
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  fontFamily?: string;
  style?: React.CSSProperties;
}

/**
 * Typewriter effect with blinking cursor
 * Non-uniform typing speed mimics human behavior
 */
export const TypingText: React.FC<TypingTextProps> = ({
  text,
  startFrame = 0,
  framesPerChar = 3,
  showCursor = true,
  cursorBlinkInterval = 30,
  cursorChar = "|",
  fontSize = 16,
  color = "#ffffff",
  fontWeight = 400,
  fontFamily = "Inter, -apple-system, sans-serif",
  style,
}) => {
  const frame = useCurrentFrame();

  // Generate pseudo-random delays for each character
  // Uses deterministic seed based on text for consistency across renders
  const charDelays = generateCharDelays(text, framesPerChar);

  // Calculate how many characters to show
  const adjustedFrame = Math.max(0, frame - startFrame);
  let charIndex = 0;
  let frameCount = 0;

  for (let i = 0; i < charDelays.length; i++) {
    if (frameCount + charDelays[i] > adjustedFrame) break;
    frameCount += charDelays[i];
    charIndex = i + 1;
  }

  // Cursor visibility (blinks after typing completes)
  const typingComplete = charIndex >= text.length;
  const cursorVisible = typingComplete
    ? Math.floor(frame / cursorBlinkInterval) % 2 === 0
    : true;

  // Text to display
  const displayText = text.slice(0, charIndex);

  return (
    <span
      style={{
        fontSize,
        color,
        fontWeight,
        fontFamily,
        whiteSpace: "pre-wrap",
        ...style,
      }}
    >
      {displayText}
      {showCursor && (
        <span
          style={{
            opacity: cursorVisible ? 0.8 : 0,
            color,
            marginLeft: 1,
          }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  );
};

/**
 * Generate non-uniform delays for natural typing feel
 * Deterministic based on character position for consistency
 */
function generateCharDelays(text: string, avgFramesPerChar: number): number[] {
  const delays: number[] = [];
  const minDelay = Math.max(1, avgFramesPerChar - 2);
  const maxDelay = avgFramesPerChar + 2;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Longer pauses after punctuation
    if ([",", ".", "!", "?", ";", ":"].includes(char)) {
      delays.push(avgFramesPerChar + 4);
      continue;
    }

    // Space has slight pause
    if (char === " ") {
      delays.push(avgFramesPerChar + 1);
      continue;
    }

    // Pseudo-random delay based on char code and position
    const seed = (char.charCodeAt(0) * (i + 1)) % 7;
    const delay = minDelay + (seed % (maxDelay - minDelay + 1));
    delays.push(delay);
  }

  return delays;
}

/**
 * Multi-line typing text with line-by-line reveal
 */
interface MultiLineTypingProps {
  lines: string[];
  startFrame?: number;
  framesPerChar?: number;
  lineGap?: number; // Frames between lines
  showCursor?: boolean;
  fontSize?: number;
  lineHeight?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const MultiLineTyping: React.FC<MultiLineTypingProps> = ({
  lines,
  startFrame = 0,
  framesPerChar = 3,
  lineGap = 15,
  showCursor = true,
  fontSize = 16,
  lineHeight = 1.5,
  color = "#ffffff",
  style,
}) => {
  const frame = useCurrentFrame();

  // Calculate start frame for each line
  let currentFrame = startFrame;
  const lineStartFrames: number[] = [];

  for (const line of lines) {
    lineStartFrames.push(currentFrame);
    const lineTypingDuration = line.length * framesPerChar + lineGap;
    currentFrame += lineTypingDuration;
  }

  // Find which line cursor should be on
  let activeLine = 0;
  for (let i = 0; i < lineStartFrames.length; i++) {
    if (frame >= lineStartFrames[i]) {
      activeLine = i;
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: fontSize * (lineHeight - 1),
        ...style,
      }}
    >
      {lines.map((line, index) => {
        const lineStart = lineStartFrames[index];
        const isActive = index === activeLine;

        // If line hasn't started, don't show it
        if (frame < lineStart) return null;

        return (
          <TypingText
            key={index}
            text={line}
            startFrame={lineStart}
            framesPerChar={framesPerChar}
            showCursor={showCursor && isActive}
            fontSize={fontSize}
            color={color}
          />
        );
      })}
    </div>
  );
};
