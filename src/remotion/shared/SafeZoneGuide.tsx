import React from 'react';
import { AbsoluteFill } from 'remotion';

/**
 * TikTok/Reels/Shorts Safe Zone Guide
 * Shows danger zones where platform UI overlays content
 * Use during development, disable before rendering
 */

export const TIKTOK_SAFE_ZONE = {
  top: 150,      // Notch/status bar
  bottom: 384,   // 20% of 1920 - captions/username
  left: 60,      // Edge safety
  right: 120,    // Like/Comment/Share icons
};

export const SafeZoneGuide: React.FC<{ enabled?: boolean }> = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 9999 }}>
      {/* Top danger zone - notch/status bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: TIKTOK_SAFE_ZONE.top,
          backgroundColor: 'rgba(255,0,0,0.2)',
          borderBottom: '2px dashed red',
        }}
      />

      {/* Bottom danger zone - captions/username */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: TIKTOK_SAFE_ZONE.bottom,
          backgroundColor: 'rgba(255,0,0,0.2)',
          borderTop: '2px dashed red',
        }}
      />

      {/* Right icon strip - Like/Comment/Share */}
      <div
        style={{
          position: 'absolute',
          top: TIKTOK_SAFE_ZONE.top,
          right: 0,
          bottom: TIKTOK_SAFE_ZONE.bottom,
          width: TIKTOK_SAFE_ZONE.right,
          backgroundColor: 'rgba(255,165,0,0.2)',
          borderLeft: '2px dashed orange',
        }}
      />

      {/* Labels */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 20,
          color: 'red',
          fontSize: 14,
          fontFamily: 'sans-serif',
        }}
      >
        TOP SAFE ZONE (150px)
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: 20,
          color: 'red',
          fontSize: 14,
          fontFamily: 'sans-serif',
        }}
      >
        BOTTOM SAFE ZONE (384px / 20%)
      </div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: 10,
          color: 'orange',
          fontSize: 12,
          fontFamily: 'sans-serif',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}
      >
        ICONS (120px)
      </div>
    </AbsoluteFill>
  );
};
