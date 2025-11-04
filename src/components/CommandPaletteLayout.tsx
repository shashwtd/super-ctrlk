'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  currentPage: 'main' | 'create' | 'view';
}

export default function CommandPaletteLayout({ isOpen, onClose, children, currentPage }: CommandPaletteLayoutProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-neutral-950/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="modal"
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full px-4"
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              maxWidth: currentPage === 'create' ? '720px' : '640px'
            }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
