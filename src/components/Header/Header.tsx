"use client";

import React, { useEffect, useState } from 'react';
import NetworkSelector from '../NetworkSelector/NetworkSelector';
import WalletConnect from '../WalletConnect/WalletConnect';

const Header = () => {
  const [mounted, setMounted] = useState(false);

  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header 
      className="w-full flex justify-between items-center p-4 text-white shadow-lg relative overflow-hidden sticky top-0 z-50"
      style={{ 
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary-1) 100%)',
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-white opacity-5 blur-xl animate-float-slow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-white opacity-5 blur-xl animate-float-medium"></div>
        <div className="absolute top-10 right-1/4 w-16 h-16 rounded-full bg-white opacity-5 blur-xl animate-float-fast"></div>
      </div>

      {/* Logo with animation */}
      <div 
        className={`text-2xl font-bold font-[var(--font-space-grotesk)] relative z-10 transition-all duration-1000 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80 hover:from-white/90 hover:to-white transition-all duration-300">
          Entropify Playground
        </span>
      </div>

      {/* Buttons with improved styling */}
      <div className={`flex gap-4 relative z-10 transition-all duration-1000 delay-300 ease-out ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <NetworkSelector />
        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;
