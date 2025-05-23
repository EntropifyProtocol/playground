"use client";

import React, { useState, useEffect } from 'react';
import { connect, disconnect } from 'get-starknet';
import Button from '../Button/Button';

const WalletConnect: React.FC = () => {
  const [account, setAccount] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // @ts-ignore - The typings for get-starknet are not up to date
        const starknet = await connect({ showList: false });
        if (starknet?.isConnected && starknet?.account) {
          setAccount(starknet.account);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    };

    checkConnection();
  }, []);

  // Handle wallet connection
  const handleConnect = async () => {
    console.log('Connect button clicked');
    
    if (account) {
      console.log('Already connected, disconnecting...');
      await handleDisconnect();
      return;
    }

    setIsConnecting(true);
    
    try {
      console.log('Opening wallet selector...');
      // @ts-ignore - The typings for get-starknet are not up to date
      const starknet = await connect({ modalMode: 'alwaysAsk' });
      console.log('Wallet connection result:', starknet);
      
      if (starknet?.isConnected && starknet?.account) {
        console.log('Connected successfully:', starknet.account);
        setAccount(starknet.account);
      } else {
        console.error('Connection failed or user rejected');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setAccount(null);
      console.log('Disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <div>
      {account ? (
        <Button 
          onClick={handleDisconnect} 
          variant="secondary"
          className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-lg flex items-center gap-2 group"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span className="font-medium">{formatAddress(account.address)}</span>
          </div>
          <span className="text-xs">Disconnect</span>
        </Button>
      ) : (
        <Button 
          onClick={handleConnect} 
          variant="primary"
          disabled={isConnecting}
          className="bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          {isConnecting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Connect Wallet</span>
            </div>
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
