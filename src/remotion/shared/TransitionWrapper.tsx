import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring } from 'remotion';

type TransitionType = 'slide' | 'zoom' | 'fade' | 'none';

export const TransitionWrapper: React.FC<{
    children: React.ReactNode;
    type?: TransitionType;
    enterFrom?: 'left' | 'right' | 'bottom';
}> = ({ children, type = 'slide', enterFrom = 'bottom' }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Calculate the Spring Entrance
    // We want the transition to be snappy (stiff) but smooth
    const progress = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120, mass: 0.8 },
    });

    let style: React.CSSProperties = {};

    // 1. SLIDE TRANSITION (The "Deck of Cards" feel)
    if (type === 'slide') {
        const startX = enterFrom === 'left' ? -width : enterFrom === 'right' ? width : 0;
        const startY = enterFrom === 'bottom' ? height : 0;

        const x = interpolate(progress, [0, 1], [startX, 0]);
        const y = interpolate(progress, [0, 1], [startY, 0]);

        style = {
            transform: `translate(${x}px, ${y}px)`,
            zIndex: 10, // Ensure it sits on top of the previous scene
            boxShadow: '0px 0px 50px rgba(0,0,0,0.5)', // Shadow separates it from layer below
        };
    }

    // 2. ZOOM TRANSITION (The "Fly Through" feel)
    if (type === 'zoom') {
        const scale = interpolate(progress, [0, 1], [0.5, 1]);
        const opacity = interpolate(progress, [0, 1], [0, 1]); // Fade in slightly to avoid hard edge

        style = {
            transform: `scale(${scale})`,
            opacity,
            transformOrigin: 'center center',
        };
    }

    // 3. FADE (Simple fallback)
    if (type === 'fade') {
        style = { opacity: interpolate(progress, [0, 1], [0, 1]) };
    }

    return (
        <AbsoluteFill style={{ ...style, backgroundColor: '#050505' }}>
            {children}
        </AbsoluteFill>
    );
};
