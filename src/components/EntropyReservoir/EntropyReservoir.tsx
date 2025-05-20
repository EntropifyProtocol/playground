"use client";

import React, { useState, useEffect } from 'react';
import { connect } from 'get-starknet';
import { useContract, useContractRead, useAccount, useContractWrite, useConnect } from '@starknet-react/core';
import Button from '../Button/Button';
import TransactionStatus from '../TransactionStatus/TransactionStatus';
import { RESERVOIR_CONTRACT_ADDRESS, RANDOM_PROVIDER_CONTRACT_ADDRESS } from '../../contracts/constants';
import { RESERVOIR_ABI, RANDOM_PROVIDER_ABI } from '../../contracts/abis';

interface EntropyReservoirProps {
  initialValue?: number;
}

const EntropyReservoir: React.FC<EntropyReservoirProps> = ({ 
  initialValue = 1000 
}) => {
  const [reservoirValue, setReservoirValue] = useState<number>(initialValue);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [randomNumber, setRandomNumber] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { connect: connectWallet, connectors } = useConnect();
  
  // Additional check for wallet connection using get-starknet
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  
  // Check if wallet is connected via get-starknet
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // @ts-ignore - The typings for get-starknet are not up to date
        const starknet = await connect({ showList: false });
        if (starknet?.isConnected && starknet?.account) {
          setIsWalletConnected(true);
        } else {
          setIsWalletConnected(false);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
        setIsWalletConnected(false);
      }
    };

    checkConnection();
    
    // Check connection status every 3 seconds
    const intervalId = setInterval(checkConnection, 3000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Set up contract for reservoir count
  const { contract: reservoirContract } = useContract({
    address: RESERVOIR_CONTRACT_ADDRESS,
    abi: RESERVOIR_ABI,
  });

  // Set up contract for random number generation
  const { contract: randomProviderContract } = useContract({
    address: RANDOM_PROVIDER_CONTRACT_ADDRESS,
    abi: RANDOM_PROVIDER_ABI,
  });

  // Read reservoir count from contract
  const { data: countData, isLoading: isCountLoading, error: countError, refetch } = useContractRead({
    functionName: 'get_count',
    args: [],
    watch: true,
    address: RESERVOIR_CONTRACT_ADDRESS,
    abi: RESERVOIR_ABI,
  });
  
  // Log the received data to help debug
  useEffect(() => {
    if (countData !== undefined) {
      console.log('Raw count data:', countData);
    }
    if (countError) {
      console.error('Error fetching count:', countError);
    }
  }, [countData, countError]);

  // We'll use a direct approach with get-starknet instead of useContractWrite
  const [isPending, setIsPending] = useState(false);

  // Auto-refresh the count every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refetch]);

  // Update reservoir value when count data changes
  useEffect(() => {
    if (countData) {
      console.log('Raw count data:', countData);
      try {
        // Handle the specific format {count: 25n} where 25n is a BigInt
        if (typeof countData === 'object' && countData !== null && 'count' in countData) {
          // Extract the count property which is a BigInt
          const countValue = (countData as { count: bigint }).count;
          console.log('Extracted count value:', countValue);
          
          // Convert BigInt to number
          const numValue = Number(countValue);
          console.log('Converted count to number:', numValue);
          
          if (!isNaN(numValue)) {
            setReservoirValue(numValue);
          } else {
            console.error('Failed to convert BigInt to number');
            setReservoirValue(initialValue);
          }
        } 
        // Fallback to other formats if the specific format isn't matched
        else {
          // Convert to a string representation as a fallback
          const stringValue = String(countData);
          console.log('String representation:', stringValue);
          
          // Try to parse as a number
          const numValue = parseInt(stringValue, 10);
          console.log('Parsed number value:', numValue);
          
          if (!isNaN(numValue)) {
            setReservoirValue(numValue);
          } else {
            console.error('Failed to convert to a number:', stringValue);
            // Other fallback conversion methods
            if (typeof countData === 'object' && countData !== null) {
              // Try array format
              if (Array.isArray(countData) && countData.length > 0) {
                const firstValue = countData[0];
                console.log('Array first value:', firstValue);
                setReservoirValue(Number(firstValue) || initialValue);
              }
              // Try toString method
              else if ('toString' in countData) {
                const extractedValue = countData.toString();
                console.log('toString value:', extractedValue);
                setReservoirValue(Number(extractedValue) || initialValue);
              }
              else {
                console.log('Unknown object format, using default');
                setReservoirValue(initialValue);
              }
            } else {
              setReservoirValue(initialValue);
            }
          }
        }
      } catch (error) {
        console.error('Error processing count data:', error);
        setReservoirValue(initialValue);
      }
    }
  }, [countData, initialValue]);

  // Function to generate a random number
  const handleGenerateRandom = async () => {
    // Check wallet connection using both methods for better reliability
    if (!isConnected && !isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    // Reset previous state
    setError(null);
    setRandomNumber(null);
    setTxHash(null); // Clear previous transaction status
    setIsGenerating(true);
    setIsPending(true);
    
    try {
      console.log('Attempting to generate random number...');
      
      // Get the starknet instance with the connected account
      // @ts-ignore - The typings for get-starknet are not up to date
      const starknet = await connect({ showList: false });
      
      if (!starknet?.isConnected || !starknet?.account) {
        throw new Error('Wallet is not connected or account is not available');
      }
      
      console.log('Using account:', starknet.account);
      
      // Call the contract directly using the starknet account with uint256 format
      // uint256 is represented as [low, high] in Cairo
      const response = await starknet.account.execute({
        contractAddress: RANDOM_PROVIDER_CONTRACT_ADDRESS,
        entrypoint: 'rand',
        calldata: ['0', '0'] // uint256(0) = [low=0, high=0]
      });
      
      console.log('Transaction submitted:', response);
      setTxHash(response.transaction_hash);
    } catch (err: any) {
      console.error('Error generating random number:', err);
      
      // Provide more user-friendly error messages
      if (err.message?.includes('User abort') || err.message?.includes('canceled')) {
        setError('Transaction was rejected by the user');
      } else if (err.message?.includes('insufficient funds')) {
        setError('Insufficient funds to complete this transaction');
      } else if (err.message?.includes('account is required')) {
        setError('Account is required. Please ensure your wallet is properly connected');
      } else {
        setError(err.message || 'Failed to generate random number');
      }
    } finally {
      setIsGenerating(false);
      setIsPending(false);
    }
  };

  // No reservoir visualization

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg border border-gray-200 p-8 flex flex-col items-center gap-8 transition-all duration-500 hover:shadow-xl">
      {/* Header with title and count */}
      <div className="w-full flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Entropy Reservoir
        </h2>
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg px-6 py-2 text-black flex items-center shadow-sm">
          {isCountLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
              <span>Loading...</span>
            </div>
          ) : (
            <span 
              data-component-name="EntropyReservoir"
              className="transition-all duration-500 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {!isNaN(reservoirValue) ? reservoirValue.toLocaleString() : initialValue.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      
      {/* Spacer for better layout */}
      <div className="h-6"></div>
      
      {/* Action buttons and status */}
      <div className="flex flex-col items-center justify-center w-full">
        <Button 
          onClick={handleGenerateRandom}
          variant="gradient"
          size="lg"
          className="px-8 py-4 text-lg font-bold w-full max-w-md"
          disabled={isPending || isGenerating || (!isConnected && !isWalletConnected)}
        >
          {isPending || isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span>Get Random Number</span>
            </div>
          )}
        </Button>
        
        {(!isConnected && !isWalletConnected) && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-600 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Please connect your wallet to generate random numbers</span>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {/* Transaction status */}
        {txHash && (
          <div className="mt-6 w-full">
            <TransactionStatus 
              txHash={txHash} 
              onComplete={(generatedNumber) => {
                setRandomNumber(generatedNumber);
                // We don't clear txHash automatically anymore
                // It will be cleared when the user clicks Get Random Number again
              }}
            />
          </div>
        )}
        
        {/* Display random number with animation if available */}
        {randomNumber && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg w-full text-center animate-fadeIn shadow-md">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Generated Random Number</h3>
            <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 break-all overflow-hidden">
              {randomNumber}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntropyReservoir;
