import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const CyberBackground: React.FC = () => {
  const { darkMode } = useApp();
  const [particles, setParticles] = useState<Array<{ id: number; left: string; size: number; duration: number; delay: number; sway: number }>>([]);

  useEffect(() => {
    // The balls only live in the left and right quarters of the page, so the reading area stays calm.
    let lastWidth = 0;
    const build = () => {
      const w = window.innerWidth;
      if (w === lastWidth) return;
      lastWidth = w;
      const band = w * 0.25;
      const sway = Math.min(60, w * 0.06);
      setParticles(Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 20 + 10;
        const start = i % 2 === 0 ? sway : w * 0.75 + sway;
        const range = Math.max(band - size - sway * 2, 0);
        return {
          id: i,
          left: `${start + Math.random() * range}px`,
          size,
          duration: Math.random() * 12 + 10,
          delay: Math.random() * 10,
          sway,
        };
      }));
    };
    build();
    window.addEventListener('resize', build);
    return () => window.removeEventListener('resize', build);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.left,
            bottom: '-5%',
            width: p.size,
            height: p.size,
            background: darkMode
              ? 'radial-gradient(circle at 30% 30%, #ffffff, #d0d0e0, #a0a0c0)'
              : 'radial-gradient(circle at 30% 30%, #ffffff, #db2777, #9d174d)',
            boxShadow: darkMode
              ? '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(200,200,220,0.5)'
              : '0 0 15px rgba(219,39,119,0.6), 0 0 30px rgba(157,23,77,0.4)',
          }}
          animate={{
            y: [0, -(window.innerHeight + 100)],
            x: [0, Math.sin(p.id * 1.5) * p.sway, Math.cos(p.id) * -p.sway * 0.67, 0],
            opacity: [0, 1, 1, 0.8, 0],
            scale: [0.5, 1.1, 0.9, 1, 0.7],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default CyberBackground;
