import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

const CyberBackground: React.FC = () => {
  const { darkMode } = useApp();
  const [particles, setParticles] = useState<Array<{ id: number; left: string; top: string; size: number; duration: number; delay: number }>>([]);
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; startX: number; startY: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Pink balls for light mode
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 10, // 10px to 30px
      duration: Math.random() * 10 + 10, // 10s to 20s
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);

    // Shooting stars for dark mode
    const newShootingStars = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      startX: Math.random() * 50 + 50, // Start from right side (50-100%)
      startY: Math.random() * 30, // Start from top (0-30%)
      duration: Math.random() * 2 + 2, // 2-4s duration (medium speed)
      delay: Math.random() * 8, // Random delay up to 8s
    }));
    setShootingStars(newShootingStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* 3D Shiny Pink Balls Animation (Light Mode Only) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full block"
          style={{
            left: p.left,
            top: '100%',
            width: p.size,
            height: p.size,
            background: darkMode
              ? 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(192, 192, 192, 0.8), rgba(169, 169, 169, 0.6))'
              : 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(219, 39, 119, 0.9), rgba(157, 23, 77, 1))',
            boxShadow: darkMode
              ? '0 0 15px rgba(192, 192, 192, 0.6), 0 0 30px rgba(169, 169, 169, 0.4)'
              : '0 0 15px rgba(219, 39, 119, 0.6), 0 0 30px rgba(157, 23, 77, 0.4)',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '-120vh',
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Shooting Stars Animation (Dark Mode Only) */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute hidden dark:block"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: '200px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), rgba(0, 255, 255, 0.7))',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6)',
            rotate: '45deg',
          }}
          animate={{
            x: [0, -1000],
            y: [0, 1000],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Subtle overlay to blend */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 dark:to-black/20 pointer-events-none" />
    </div>
  );
};

export default CyberBackground;