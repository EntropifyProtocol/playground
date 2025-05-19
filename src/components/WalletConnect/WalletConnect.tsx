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
          className="flex items-center space-x-2"
        >
          <span className="font-medium">{formatAddress(account.address)}</span>
          <span className="text-xs opacity-80">Disconnect</span>
        </Button>
      ) : (
        <Button 
          onClick={handleConnect} 
          variant="primary"
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
