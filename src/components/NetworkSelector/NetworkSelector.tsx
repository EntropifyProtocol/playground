"use client";

import React from 'react';

const NetworkSelector: React.FC = () => {
  // Since we're only supporting Starknet Sepolia, this is just informational
  return (
    <div className="bg-zinc-800 text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-400/50"></div>
      <span className="font-medium">Starknet Sepolia</span>
    </div>
  );
};

export default NetworkSelector;
