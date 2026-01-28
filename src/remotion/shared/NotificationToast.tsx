import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ReactNode } from "react";

interface NotificationToastProps {
  children: ReactNode;
  /** Frame when toast should appear */
  enterFrame?: number;
  /** How long toast stays visible (in frames) */
  holdDuration?: number;
  /** Frame when toast should exit (auto-calculated if not provided) */
  exitFrame?: number;
  /** Direction to slide from */
  direction?: "top" | "bottom" | "left" | "right";
  /** Distance to slide */
  distance?: number;
  /** Position on screen */
  position?: { x: number; y: number };
  style?: React.CSSProperties;
}

/**
 * Notification toast with slide in, wait, slide out animation
 * Perfect for showing notifications, alerts, tooltips
 */
export const NotificationToast: React.FC<NotificationToastProps> = ({
  children,
  enterFrame = 0,
  holdDuration = 90, // 1.5 seconds at 60fps
  exitFrame,
  direction = "right",
  distance = 100,
  position = { x: 0, y: 0 },
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const calculatedExitFrame = exitFrame ?? enterFrame + holdDuration;

  // Entry animation
  const entryProgress = spring({
    fps,
    frame: Math.max(0, frame - enterFrame),
    config: {
      mass: 0.6,
      damping: 12,
      stiffness: 180,
    },
  });

  // Exit animation
  const exitProgress = spring({
    fps,
    frame: Math.max(0, frame - calculatedExitFrame),
    config: {
      mass: 0.6,
      damping: 15,
      stiffness: 200,
    },
  });

  // Calculate transform based on direction
  const getTransform = () => {
    // Before entry
    if (frame < enterFrame) {
      return getDirectionTransform(direction, distance);
    }

    // During entry
    if (frame < calculatedExitFrame) {
      const currentDistance = interpolate(entryProgress, [0, 1], [distance, 0]);
      return getDirectionTransform(direction, currentDistance);
    }

    // During exit
    const currentDistance = interpolate(exitProgress, [0, 1], [0, distance]);
    return getDirectionTransform(direction, currentDistance);
  };

  // Opacity
  const getOpacity = () => {
    if (frame < enterFrame) return 0;
    if (frame < calculatedExitFrame) return entryProgress;
    return 1 - exitProgress;
  };

  // Don't render if fully hidden
  if (frame < enterFrame - 10 || getOpacity() <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        transform: getTransform(),
        opacity: getOpacity(),
        pointerEvents: "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Helper function for direction-based transform
function getDirectionTransform(direction: string, distance: number): string {
  switch (direction) {
    case "top":
      return `translateY(${-distance}px)`;
    case "bottom":
      return `translateY(${distance}px)`;
    case "left":
      return `translateX(${-distance}px)`;
    case "right":
      return `translateX(${distance}px)`;
    default:
      return "none";
  }
}

/**
 * Pre-styled toast component for common use cases
 */
interface StyledToastProps {
  message: string;
  icon?: ReactNode;
  enterFrame?: number;
  holdDuration?: number;
  exitFrame?: number;
  variant?: "success" | "error" | "info" | "warning";
  position?: { x: number; y: number };
}

export const StyledToast: React.FC<StyledToastProps> = ({
  message,
  icon,
  enterFrame = 0,
  holdDuration = 90,
  exitFrame,
  variant = "info",
  position = { x: 1920 - 350, y: 50 },
}) => {
  const variantColors = {
    success: { bg: "#10b981", icon: "✓" },
    error: { bg: "#ef4444", icon: "✕" },
    info: { bg: "#3b82f6", icon: "ℹ" },
    warning: { bg: "#f59e0b", icon: "⚠" },
  };

  const { bg, icon: defaultIcon } = variantColors[variant];

  return (
    <NotificationToast
      enterFrame={enterFrame}
      holdDuration={holdDuration}
      exitFrame={exitFrame}
      direction="right"
      position={position}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          backgroundColor: "#1a1a1a",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
          minWidth: 280,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          {icon ?? defaultIcon}
        </div>

        {/* Message */}
        <span
          style={{
            color: "#ffffff",
            fontSize: 14,
            fontWeight: 500,
            fontFamily: "Inter, -apple-system, sans-serif",
          }}
        >
          {message}
        </span>
      </div>
    </NotificationToast>
  );
};
