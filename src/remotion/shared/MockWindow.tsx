import { ReactNode } from "react";

interface MockWindowProps {
  children: ReactNode;
  title?: string;
  width?: number;
  height?: number;
  variant?: "dark" | "light";
  showTrafficLights?: boolean;
  style?: React.CSSProperties;
}

/**
 * macOS-style window container with traffic lights
 * Use for framing UI demos, app mockups, browser previews
 */
export const MockWindow: React.FC<MockWindowProps> = ({
  children,
  title = "",
  width = 800,
  height = 600,
  variant = "dark",
  showTrafficLights = true,
  style,
}) => {
  const isDark = variant === "dark";

  const colors = {
    bg: isDark ? "#1a1a1a" : "#ffffff",
    titleBar: isDark ? "#2d2d2d" : "#f0f0f0",
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    text: isDark ? "#a0a0a0" : "#666666",
  };

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: colors.bg,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        border: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 40,
          backgroundColor: colors.titleBar,
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 16,
          paddingRight: 16,
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        {showTrafficLights && (
          <div style={{ display: "flex", gap: 8 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#ff5f57",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#febc2e",
              }}
            />
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#28c840",
              }}
            />
          </div>
        )}

        {/* Title */}
        {title && (
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: colors.text,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "Inter, -apple-system, sans-serif",
            }}
          >
            {title}
          </div>
        )}

        {/* Spacer for centering when traffic lights shown */}
        {showTrafficLights && title && <div style={{ width: 52 }} />}
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
