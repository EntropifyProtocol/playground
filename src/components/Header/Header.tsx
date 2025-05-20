"use client";

import React from 'react';
import NetworkSelector from '../NetworkSelector/NetworkSelector';
import WalletConnect from '../WalletConnect/WalletConnect';

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center p-4 text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="text-2xl font-bold font-[var(--font-space-grotesk)]">Entropify Playground</div>
      <div className="flex gap-4">
        <NetworkSelector />
        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;
