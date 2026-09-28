import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface QuantumBackgroundProps {
  variant?: 'subtle' | 'hero' | 'minimal';
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  phase: number;
  label?: string;
}

export const QuantumBackground: React.FC<QuantumBackgroundProps> = ({
  variant = 'subtle',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId: number;
    let width = 0;
    let height = 0;
    const mouse = { x: -1000, y: -1000, active: false };

    const particleCount = variant === 'hero' ? 45 : variant === 'subtle' ? 28 : 16;
    const maxDistance = variant === 'hero' ? 140 : 110;

    const labels = ['|0⟩', '|1⟩', '|ψ⟩', '|+⟩', '|−⟩', 'H', 'CNOT', 'θ', 'φ'];
    let particles: Particle[] = [];

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;

      // Re-initialize particles based on new dimensions
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.35,
          vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.35,
          size: Math.random() * 2 + 1.2,
          baseAlpha: Math.random() * 0.35 + 0.15,
          alpha: Math.random() * 0.35 + 0.15,
          phase: Math.random() * Math.PI * 2,
          label: i % 7 === 0 ? labels[(i / 7) % labels.length] : undefined
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    let lastTime = performance.now();

    const draw = (currentTime: number) => {
      if (!ctx || !canvas) return;
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';
      const isHighContrast = theme === 'high-contrast';

      // Colors based on current theme
      const nodeColor = isHighContrast
        ? 'rgba(0, 0, 0, 0.45)'
        : isDark
        ? 'rgba(45, 212, 191, ' // sciteal-400
        : 'rgba(13, 148, 136, '; // sciteal-600

      const lineColor = isHighContrast
        ? 'rgba(0, 0, 0, 0.15)'
        : isDark
        ? 'rgba(34, 48, 67, ' // border-card
        : 'rgba(203, 213, 225, '; // slate-300

      const textColor = isHighContrast
        ? 'rgba(0, 0, 0, 0.4)'
        : isDark
        ? 'rgba(94, 234, 212, 0.4)'
        : 'rgba(15, 118, 110, 0.4)';

      // Draw subtle connections between particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Update position if motion is allowed
        if (!prefersReducedMotion) {
          p1.x += p1.vx;
          p1.y += p1.vy;

          // Wrap edges smoothly
          if (p1.x < -20) p1.x = width + 20;
          if (p1.x > width + 20) p1.x = -20;
          if (p1.y < -20) p1.y = height + 20;
          if (p1.y > height + 20) p1.y = -20;

          // Gentle sinusoidal breathing
          p1.phase += dt * 0.8;
          p1.alpha = p1.baseAlpha + Math.sin(p1.phase) * 0.1;

          // Subtle cursor interaction on a responsive subset of particles (Prompt Section 5)
          if (mouse.active && i % 3 === 0) {
            const dx = mouse.x - p1.x;
            const dy = mouse.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 1) {
              const pull = (180 - dist) / 180;
              p1.x += (dx / dist) * pull * 0.9;
              p1.y += (dy / dist) * pull * 0.9;

              // Draw subtle connection filament to pointer when close
              if (dist < 110 && !isHighContrast) {
                const filamentAlpha = (1 - dist / 110) * (isDark ? 0.35 : 0.25);
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `${nodeColor}${filamentAlpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
              }
            }
          }
        }

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (isHighContrast ? 0.25 : isDark ? 0.35 : 0.45);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isHighContrast ? lineColor : `${lineColor}${lineAlpha})`;
            ctx.lineWidth = isHighContrast ? 1 : 0.8;
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
        ctx.fillStyle = isHighContrast ? nodeColor : `${nodeColor}${Math.max(0.1, p1.alpha)})`;
        ctx.fill();

        // Optional tiny concept label
        if (p1.label && !isHighContrast && (variant === 'hero' || variant === 'subtle')) {
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillStyle = textColor;
          ctx.fillText(p1.label, p1.x + 6, p1.y - 4);
        }
      }

      // Continue animation loop unless prefers-reduced-motion
      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    if (prefersReducedMotion) {
      draw(performance.now());
    } else {
      animId = requestAnimationFrame(draw);
    }

    // Page visibility listener to stop loop when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else if (!prefersReducedMotion) {
        lastTime = performance.now();
        animId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animId);
    };
  }, [variant, theme]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none z-0 ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
