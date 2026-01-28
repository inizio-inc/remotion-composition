import { Img } from "remotion";
import { ReactNode } from "react";

interface PlaceholderProps {
  /** Path to image/SVG (use staticFile() for public folder assets) */
  src?: string;
  /** Width in pixels */
  width?: number;
  /** Height in pixels */
  height?: number;
  /** Alt text for image */
  alt?: string;
  /** Background color for placeholder box */
  backgroundColor?: string;
  /** Border radius */
  borderRadius?: number;
  /** Custom content instead of image */
  children?: ReactNode;
  /** Show placeholder box when no src provided */
  showPlaceholderBox?: boolean;
  style?: React.CSSProperties;
}

/**
 * Placeholder component for logos, icons, and images
 * Supports SVG, images, or shows a placeholder box
 */
export const Placeholder: React.FC<PlaceholderProps> = ({
  src,
  width = 100,
  height = 100,
  alt = "Placeholder",
  backgroundColor = "rgba(255,255,255,0.1)",
  borderRadius = 8,
  children,
  showPlaceholderBox = true,
  style,
}) => {
  // If custom children provided, render them
  if (children) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  // If src provided, render image
  if (src) {
    return (
      <Img
        src={src}
        width={width}
        height={height}
        alt={alt}
        style={{
          objectFit: "contain",
          ...style,
        }}
      />
    );
  }

  // Show placeholder box
  if (showPlaceholderBox) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor,
          borderRadius,
          border: "1px dashed rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        <svg
          width={Math.min(width, height) * 0.4}
          height={Math.min(width, height) * 0.4}
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }

  return null;
};

/**
 * Logo placeholder with common sizes
 */
interface LogoPlaceholderProps {
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "square" | "wide" | "tall";
  alt?: string;
  style?: React.CSSProperties;
}

export const LogoPlaceholder: React.FC<LogoPlaceholderProps> = ({
  src,
  size = "md",
  variant = "square",
  alt = "Logo",
  style,
}) => {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const baseSize = sizes[size];

  const dimensions = {
    square: { width: baseSize, height: baseSize },
    wide: { width: baseSize * 2, height: baseSize },
    tall: { width: baseSize, height: baseSize * 1.5 },
  };

  const { width, height } = dimensions[variant];

  return <Placeholder src={src} width={width} height={height} alt={alt} style={style} />;
};

/**
 * Icon placeholder - small, circular
 */
interface IconPlaceholderProps {
  src?: string;
  size?: number;
  backgroundColor?: string;
  children?: ReactNode;
  style?: React.CSSProperties;
}

export const IconPlaceholder: React.FC<IconPlaceholderProps> = ({
  src,
  size = 40,
  backgroundColor = "rgba(255,255,255,0.1)",
  children,
  style,
}) => {
  return (
    <Placeholder
      src={src}
      width={size}
      height={size}
      backgroundColor={backgroundColor}
      borderRadius={size / 2}
      style={style}
    >
      {children}
    </Placeholder>
  );
};

/**
 * Avatar placeholder - circular with initials support
 */
interface AvatarPlaceholderProps {
  src?: string;
  size?: number;
  initials?: string;
  backgroundColor?: string;
  style?: React.CSSProperties;
}

export const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  src,
  size = 40,
  initials,
  backgroundColor = "#6366f1",
  style,
}) => {
  if (src) {
    return (
      <Img
        src={src}
        width={size}
        height={size}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: size * 0.4,
        fontWeight: 600,
        fontFamily: "Inter, -apple-system, sans-serif",
        ...style,
      }}
    >
      {initials || "?"}
    </div>
  );
};
