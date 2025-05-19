"use client";

import React from 'react';
import Button from '../Button/Button';

const NetworkSelector: React.FC = () => {
  // Since we're only supporting Starknet Sepolia, this is just informational
  return (
    <Button
      variant="secondary"
      className="bg-zinc-800 text-white hover:bg-zinc-700 border-none"
    >
      Starknet Sepolia
    </Button>
  );
};

export default NetworkSelector;
