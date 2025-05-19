"use client";

import React, { ReactNode, useEffect } from 'react';
import { StarknetConfig, jsonRpcProvider, argent, braavos } from '@starknet-react/core';
import {sepolia} from '@starknet-react/chains';
import { STARKNET_SEPOLIA_RPC } from '../../contracts/constants';

interface StarknetProviderProps {
  children: ReactNode;
}

/**
 * A wrapper around the StarknetConfig from @starknet-react/core
 * This component provides the Starknet context to the application
 */
const StarknetProvider: React.FC<StarknetProviderProps> = ({ children }) => {
  // Log initialization for debugging
  useEffect(() => {
    console.log('StarknetProvider initialized');
    console.log('RPC URL:', STARKNET_SEPOLIA_RPC);
  }, []);

  // Configure connectors for Argent and Braavos wallets
  const connectors = [
    argent(),
    braavos()
  ];

  // Log connectors for debugging
  useEffect(() => {
    console.log('Available connectors:', connectors);
  }, [connectors]);

  // Create a JSON-RPC provider with our custom RPC URL
  const provider = jsonRpcProvider({
    rpc: (chain) => {
      console.log('Provider requested for chain:', chain);
      return {
        nodeUrl: STARKNET_SEPOLIA_RPC
      };
    }
  });

  return (
    <StarknetConfig
      autoConnect={true}
      chains={[sepolia]}
      connectors={connectors}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  );
};

export default StarknetProvider;
