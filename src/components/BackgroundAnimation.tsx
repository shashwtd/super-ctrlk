'use client';

import { motion } from 'framer-motion';

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(120, 120, 130, 0.03) 0%, transparent 70%)',
          top: '20%',
          left: '10%',
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(100, 100, 110, 0.02) 0%, transparent 70%)',
          bottom: '20%',
          right: '15%',
        }}
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(140, 140, 150, 0.025) 0%, transparent 70%)',
          top: '60%',
          left: '50%',
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
