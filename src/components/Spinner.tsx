import { motion } from 'framer-motion';

export default function Spinner({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{
        width: size,
        height: size,
        border: '2px solid rgba(255, 255, 255, 0.15)',
        borderTopColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}