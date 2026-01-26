import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { ReactNode } from "react";

interface SlideUpProps {
  children: ReactNode;
  delay?: number;
  distance?: number;
  useSpring?: boolean;
  style?: React.CSSProperties;
}

export const SlideUp: React.FC<SlideUpProps> = ({
  children,
  delay = 0,
  distance = 50,
  useSpring: useSpringAnimation = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const adjustedFrame = Math.max(0, frame - delay);

  let progress: number;

  if (useSpringAnimation) {
    progress = spring({
      fps,
      frame: adjustedFrame,
      config: {
        damping: 200,
        stiffness: 100,
      },
    });
  } else {
    progress = interpolate(adjustedFrame, [0, 20], [0, 1], {
      extrapolateRight: "clamp",
    });
  }

  const translateY = interpolate(progress, [0, 1], [distance, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
