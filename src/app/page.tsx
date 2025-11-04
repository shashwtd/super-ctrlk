'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import CommandPalette from '@/components/CommandPalette';

export default function Home() {
  const [isMac] = useState(() => {
    if (typeof window !== 'undefined') {
      return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    }
    return false;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden" style={{ background: '#080808' }}>
      <CommandPalette isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {/* Background image */}
      <div className="absolute inset-0">
        <Image 
          src="/bg.jpg" 
          alt="" 
          fill
          className="object-cover opacity-30"
          priority
          unoptimized
        />
      </div>
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-5 mix-blend-difference">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
      </div>
      
      {/* Grain texture */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'2\' numOctaves=\'1\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
      }} />
      
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-6 z-20">
        <div className="text-xs uppercase tracking-widest font-mono" style={{ color: '#aaa' }}>
          Kairos
        </div>
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: '#666' }}>
          <span>Press</span>
          <kbd className="px-2 py-1 bg-black/40 border border-white/10 rounded" style={{ color: '#aaa' }}>
            {isMac ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="px-2 py-1 bg-black/40 border border-white/10 rounded" style={{ color: '#aaa' }}>
            K
          </kbd>
        </div>
      </div>
      
      {/* Center content */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl px-6">
        <div className="mb-8 text-center">
          <div className="text-4xl mb-3 font-sans font-medium tracking-tight" style={{ color: '#ddd', fontFamily: 'var(--font-geist-sans)' }}>
            Show it once. Automate it forever.
          </div>
          <div className="text-base" style={{ color: '#777', fontFamily: 'var(--font-geist-sans)' }}>
            Type a command or search to get started
          </div>
        </div>

        <button
          ref={buttonRef}
          onClick={() => setIsOpen(true)}
          onMouseMove={handleMouseMove}
          className="group relative w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:ring-offset-4 focus:ring-offset-transparent rounded-2xl transition-all"
        >
          
          {/* Subtle gradient border effect that follows mouse */}
          <div 
            className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
            }}
          />
          
          <div className="relative bg-black/70 backdrop-blur-2xl rounded-2xl overflow-hidden">
            <div className="flex items-center gap-4 px-6 py-5">
              <svg className="w-5 h-5 shrink-0" style={{ color: '#888' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div className="flex-1 text-left text-base" style={{ color: '#888', fontFamily: 'var(--font-geist-sans)' }}>
                Type a command or search...
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs font-mono" style={{ color: '#aaa' }}>
                  {isMac ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-md text-xs font-mono" style={{ color: '#aaa' }}>
                  K
                </kbd>
              </div>
            </div>
          </div>
        </button>
      </main>
      
      {/* Bottom hint */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
        <div className="text-xs font-mono" style={{ color: '#444' }}>
          Keyboard shortcuts • Quick actions • Instant automation
        </div>
      </div>
    </div>
  );
}
