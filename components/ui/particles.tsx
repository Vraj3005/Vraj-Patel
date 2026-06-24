'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let active = true;
    let animationId: number;
    const particles: Particle[] = [];
    const maxParticles = 30;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const createParticle = (initY = false): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: initY ? Math.random() * canvas.height : canvas.height + 10,
        size: Math.random() * 1.2 + 0.3,
        speedY: -(Math.random() * 0.3 + 0.05),
        speedX: Math.random() * 0.15 - 0.075,
        opacity: Math.random() * 0.4 + 0.05,
      };
    };

    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    const drawParticles = () => {
      if (!active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.25})`;
        ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
          particles[idx] = createParticle(false);
        }
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      active = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-45 pointer-events-none opacity-30"
    />
  );
}
