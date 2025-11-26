'use client';

import { useEffect, useRef } from 'react';

interface AuroraProps {
    colorStops?: string[];
    blend?: number;
    amplitude?: number;
    speed?: number;
}

export default function Aurora({
    colorStops = ["#5D866C", "#C2A68C", "#E6D8C3"],
    blend = 0.5,
    amplitude = 1.0,
    speed = 0.5
}: AuroraProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const animate = () => {
            time += speed * 0.01;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gradient = ctx.createLinearGradient(
                0,
                0,
                canvas.width,
                canvas.height
            );

            colorStops.forEach((color, index) => {
                const offset = (index / (colorStops.length - 1)) +
                    Math.sin(time + index) * 0.1 * amplitude;
                gradient.addColorStop(Math.max(0, Math.min(1, offset)), color);
            });

            ctx.globalAlpha = blend;
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [colorStops, blend, amplitude, speed]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    );
}
