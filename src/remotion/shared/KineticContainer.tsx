import React from 'react';
import { spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

export const KineticContainer: React.FC<{
    children: React.ReactNode;
    delay?: number;
    perspective?: number;
    direction?: 'up' | 'down'; // Direction the element enters from
}> = ({ children, delay = 0, perspective = 1000, direction = 'up' }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 1. The Entrance Spring
    const spr = spring({
        frame: frame - delay,
        fps,
        config: { damping: 14, stiffness: 100, mass: 1.5 },
    });

    // 2. Continuous Float (The "Alive" state)
    // We wait until the spring is mostly done (approx 30 frames) to start floating
    const floatStartFrame = delay + 30;
    const float = Math.sin((frame - floatStartFrame) / 40) * 8; // Bobs 8px up/down

    // Logic for direction
    const startRotate = direction === 'up' ? 20 : -20;
    const startY = direction === 'up' ? 100 : -100;

    const rotateX = interpolate(spr, [0, 1], [startRotate, 0]);
    const translateY = interpolate(spr, [0, 1], [startY, 0]);
    const scale = interpolate(spr, [0, 1], [0.8, 1]);
    const opacity = interpolate(spr, [0, 1], [0, 1]);

    return (
        <div style={{ perspective: `${perspective}px` }}>
            <div
                style={{
                    transform: `
                        rotateX(${rotateX}deg)
                        translateY(${translateY + (frame > floatStartFrame ? float : 0)}px)
                        scale(${scale})
                    `,
                    opacity,
                    transformStyle: 'preserve-3d',
                }}
            >
                {children}
            </div>
        </div>
    );
};
