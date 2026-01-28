import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface CursorPoint {
  x: number;
  y: number;
  /** Frame when cursor should be at this point */
  frame: number;
  /** Optional: trigger click at this point */
  click?: boolean;
}

interface SmartCursorProps {
  /** Array of points defining cursor path with timing */
  path: CursorPoint[];
  /** Cursor size in pixels */
  size?: number;
  /** Cursor color */
  color?: string;
  /** Arc height for bezier curves (0 = straight line) */
  arcHeight?: number;
  /** Show click ripple effect */
  showClickRipple?: boolean;
  style?: React.CSSProperties;
}

/**
 * Smart cursor with bezier curves and click physics
 * Cursor moves in arcs (never straight lines) and has natural click animations
 */
export const SmartCursor: React.FC<SmartCursorProps> = ({
  path,
  size = 20,
  color = "#ffffff",
  arcHeight = 50,
  showClickRipple = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (path.length === 0) return null;

  // Find current segment
  let currentSegmentIndex = 0;
  for (let i = 0; i < path.length - 1; i++) {
    if (frame >= path[i].frame && frame < path[i + 1].frame) {
      currentSegmentIndex = i;
      break;
    }
    if (frame >= path[path.length - 1].frame) {
      currentSegmentIndex = path.length - 2;
    }
  }

  const start = path[currentSegmentIndex];
  const end = path[Math.min(currentSegmentIndex + 1, path.length - 1)];

  // Spring-based progress for natural deceleration
  const segmentDuration = end.frame - start.frame;
  const segmentFrame = Math.max(0, frame - start.frame);

  const progress = spring({
    fps,
    frame: segmentFrame,
    config: {
      damping: 20,
      stiffness: 80,
    },
    durationInFrames: segmentDuration,
  });

  // Linear interpolation for X and Y
  const linearX = interpolate(progress, [0, 1], [start.x, end.x]);
  const linearY = interpolate(progress, [0, 1], [start.y, end.y]);

  // THE ARC: Parabola that peaks mid-travel
  const arcOffset = Math.sin(progress * Math.PI) * arcHeight;
  const cursorY = linearY - arcOffset;
  const cursorX = linearX;

  // Click detection
  const isClicking = path.some(
    (point) => point.click && frame >= point.frame && frame < point.frame + 10
  );

  // Click ripple
  const clickPoint = path.find(
    (point) => point.click && frame >= point.frame && frame < point.frame + 30
  );

  // Cursor scale on click
  const clickScale = spring({
    fps,
    frame: isClicking ? 0 : 10,
    config: {
      damping: 15,
      stiffness: 300,
    },
  });
  const cursorScale = interpolate(clickScale, [0, 1], [0.85, 1]);

  return (
    <>
      {/* Click ripple */}
      {showClickRipple && clickPoint && (
        <ClickRipple
          x={clickPoint.x}
          y={clickPoint.y}
          startFrame={clickPoint.frame}
          color={color}
        />
      )}

      {/* Cursor */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          transform: `scale(${cursorScale})`,
          transformOrigin: "top left",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          pointerEvents: "none",
          zIndex: 9999,
          ...style,
        }}
      >
        {/* macOS-style cursor */}
        <path
          d="M5.5 3.21V20.79L11.01 14.55H19.25L5.5 3.21Z"
          fill={color}
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
};

// Click ripple sub-component
interface ClickRippleProps {
  x: number;
  y: number;
  startFrame: number;
  color: string;
}

const ClickRipple: React.FC<ClickRippleProps> = ({ x, y, startFrame, color }) => {
  const frame = useCurrentFrame();
  const progress = (frame - startFrame) / 30;

  if (progress < 0 || progress > 1) return null;

  const size = 100 * progress;
  const opacity = 1 - progress;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        opacity: opacity * 0.5,
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
};
