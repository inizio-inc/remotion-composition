import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const KineticText: React.FC<{
    text: string;
    style?: React.CSSProperties;
    delay?: number; // Start delay in frames
    staggerPerWord?: number; // Delay between each word appearing
}> = ({ text, style, delay = 0, staggerPerWord = 5 }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const words = text.split(' ');

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4em', ...style }}>
            {words.map((word, i) => {
                const wordDelay = delay + (i * staggerPerWord);

                // Snappy spring configuration
                const entrance = spring({
                    frame: frame - wordDelay,
                    fps,
                    config: { damping: 12, stiffness: 200, mass: 0.8 },
                });

                // Drive the "Masked Slide" effect
                const translateY = interpolate(entrance, [0, 1], [100, 0]);
                const opacity = interpolate(entrance, [0, 0.5], [0, 1]);

                return (
                    <div
                        key={i}
                        style={{
                            overflow: 'hidden', // This creates the mask
                            display: 'inline-block',
                            paddingBottom: '0.2em'
                        }}
                    >
                        <span
                            style={{
                                display: 'inline-block',
                                transform: `translateY(${translateY}%)`,
                                opacity,
                            }}
                        >
                            {word}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
