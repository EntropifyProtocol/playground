"use client";

import React, { useEffect, useState } from 'react';
import { useWaitForTransaction } from '@starknet-react/core';
import { getRandomNumberFromReceipt, getExplorerUrl, formatTxHash } from '../../contracts/utils';

interface TransactionStatusProps {
  txHash: string;
  onComplete?: (randomNumber: string) => void;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ txHash, onComplete }) => {
  const { data: receipt, isLoading, error } = useWaitForTransaction({ 
    hash: txHash as `0x${string}`, 
    watch: true,
    refetchInterval: 2000 // Check for updates every 2 seconds
  });
  
  const [randomNumber, setRandomNumber] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const explorerLink = getExplorerUrl(txHash);
  
  useEffect(() => {
    if (receipt) {
      setIsConfirmed(true);
      const extractedNumber = getRandomNumberFromReceipt(receipt);
      setRandomNumber(extractedNumber);
      
      // Call the callback if provided and we have a random number
      if (onComplete && extractedNumber) {
        onComplete(extractedNumber);
      }
    }
  }, [receipt, onComplete]);
  
  return (
    <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 w-full">
      <h3 className="text-lg font-medium text-black flex items-center">
        <span>Transaction Status</span>
        {isConfirmed && (
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Confirmed</span>
        )}
        {isLoading && !error && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Pending</span>
        )}
        {error && (
          <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Failed</span>
        )}
      </h3>
      
      <div className="mt-2 text-black">
        <p className="flex items-center flex-wrap">
          <span className="mr-2">Hash:</span>
          <a 
            href={explorerLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline inline-flex items-center"
          >
            {formatTxHash(txHash)}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </p>
        
        <div className="mt-3">
          {isLoading && !receipt && !error ? (
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500 mr-2"></div>
              <span>Waiting for transaction confirmation...</span>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 border border-red-100 rounded">
              <p className="text-red-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Transaction failed: {error.message || 'Unknown error'}
              </p>
            </div>
          ) : receipt ? (
            <div className="p-3 bg-green-50 border border-green-100 rounded">
              <p className="text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Transaction confirmed!
              </p>
              {randomNumber ? (
                <div className="mt-3 p-2 bg-white border border-green-200 rounded">
                  <p className="text-gray-500 text-sm mb-1">Random Number:</p>
                  <p className="text-s font-bold text-black">{randomNumber}</p>
                </div>
              ) : (
                <p className="mt-2 text-yellow-600">No random number found in transaction receipt</p>
              )}
            </div>
          ) : (
            <p className="text-yellow-600">Waiting for transaction confirmation...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
