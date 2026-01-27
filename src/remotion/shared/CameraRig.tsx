import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const CameraRig: React.FC<{
    children: React.ReactNode;
    zoomLevel?: number; // e.g., 0.05 for a 5% zoom over the scene
    driftX?: number; // e.g., 20 for a 20px horizontal drift
    rotateIntensity?: number; // e.g., 0.5 for subtle handheld feel
}> = ({ children, zoomLevel = 0.05, driftX = 20, rotateIntensity = 0.5 }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();

    // 1. Continuous Slow Zoom (Breathing)
    const scale = interpolate(
        frame,
        [0, durationInFrames],
        [1, 1 + zoomLevel],
        { extrapolateRight: 'clamp' }
    );

    // 2. Subtle Rotation (Handheld feel) - Sine wave for organic movement
    const rotate = interpolate(
        Math.sin(frame / 150),
        [-1, 1],
        [-rotateIntensity, rotateIntensity]
    );

    // 3. Horizontal Drift (Parallax)
    const x = interpolate(
        frame,
        [0, durationInFrames],
        [-driftX, driftX]
    );

    return (
        <AbsoluteFill
            style={{
                transform: `scale(${scale}) rotate(${rotate}deg) translateX(${x}px)`,
                transformOrigin: 'center center',
                width: '100%',
                height: '100%',
            }}
        >
            {children}
        </AbsoluteFill>
    );
};
