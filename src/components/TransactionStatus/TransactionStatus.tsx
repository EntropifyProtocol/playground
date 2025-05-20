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
  
  // Track progress steps
  const [steps, setSteps] = useState({
    submitted: true,
    processing: false,
    confirmed: false,
    completed: false
  });
  
  // Update steps based on transaction status
  useEffect(() => {
    if (isLoading && !error) {
      setSteps(prev => ({ ...prev, processing: true }));
    }
    
    if (receipt) {
      setSteps(prev => ({ ...prev, processing: true, confirmed: true }));
      setIsConfirmed(true);
      const extractedNumber = getRandomNumberFromReceipt(receipt);
      
      if (extractedNumber) {
        setSteps(prev => ({ ...prev, completed: true }));
        setRandomNumber(extractedNumber);
        
        // Call the callback if provided and we have a random number
        if (onComplete) {
          onComplete(extractedNumber);
        }
      }
    }
  }, [receipt, isLoading, error, onComplete]);
  
  return (
    <div className="mt-4 p-6 border border-gray-200 rounded-lg bg-white shadow-md w-full transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Transaction Status
        </h3>
        <div>
          {isConfirmed && (
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full animate-pulse">Confirmed</span>
          )}
          {isLoading && !error && !isConfirmed && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">Processing</span>
          )}
          {error && (
            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">Failed</span>
          )}
        </div>
      </div>
      
      {/* Transaction hash with explorer link */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="flex items-center flex-wrap gap-2 text-gray-700">
          <span className="font-medium">Transaction Hash:</span>
          <a 
            href={explorerLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center group transition-colors duration-200"
          >
            <span className="font-mono">{formatTxHash(txHash)}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </p>
      </div>
      
      {/* Visual timeline */}
      <div className="relative mb-8">
        {/* Timeline track */}
        <div className="absolute left-0 top-0 ml-3.5 h-full w-0.5 bg-gray-200"></div>
        
        {/* Step 1: Submitted */}
        <div className="relative flex items-start mb-6">
          <div className={`absolute flex items-center justify-center w-8 h-8 rounded-full ${steps.submitted ? 'bg-blue-500' : 'bg-gray-200'} -left-0 z-10`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div className="ml-12">
            <h4 className={`text-lg font-medium ${steps.submitted ? 'text-blue-600' : 'text-gray-500'}`}>Transaction Submitted</h4>
            <p className="text-gray-500 text-sm">Your transaction has been sent to the Starknet network</p>
          </div>
        </div>
        
        {/* Step 2: Processing */}
        <div className="relative flex items-start mb-6">
          <div className={`absolute flex items-center justify-center w-8 h-8 rounded-full ${steps.processing ? 'bg-blue-500' : 'bg-gray-200'} -left-0 z-10`}>
            {steps.processing ? (
              isConfirmed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              )
            ) : (
              <span className="text-white text-xs">2</span>
            )}
          </div>
          <div className="ml-12">
            <h4 className={`text-lg font-medium ${steps.processing ? (isConfirmed ? 'text-blue-600' : 'text-yellow-600') : 'text-gray-500'}`}>
              {isConfirmed ? 'Processing Complete' : 'Processing'}
            </h4>
            <p className="text-gray-500 text-sm">
              {isConfirmed ? 'Transaction has been processed by the network' : 'Waiting for network confirmation...'}
            </p>
          </div>
        </div>
        
        {/* Step 3: Confirmed */}
        <div className="relative flex items-start mb-6">
          <div className={`absolute flex items-center justify-center w-8 h-8 rounded-full ${steps.confirmed ? 'bg-green-500' : 'bg-gray-200'} -left-0 z-10`}>
            {steps.confirmed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-white text-xs">3</span>
            )}
          </div>
          <div className="ml-12">
            <h4 className={`text-lg font-medium ${steps.confirmed ? 'text-green-600' : 'text-gray-500'}`}>Transaction Confirmed</h4>
            <p className="text-gray-500 text-sm">
              {steps.confirmed ? 'Transaction has been confirmed and included in a block' : 'Waiting for confirmation...'}
            </p>
          </div>
        </div>
        
        {/* Step 4: Random Number Generated */}
        <div className="relative flex items-start">
          <div className={`absolute flex items-center justify-center w-8 h-8 rounded-full ${steps.completed ? 'bg-purple-500' : 'bg-gray-200'} -left-0 z-10`}>
            {steps.completed ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            ) : (
              <span className="text-white text-xs">4</span>
            )}
          </div>
          <div className="ml-12">
            <h4 className={`text-lg font-medium ${steps.completed ? 'text-purple-600' : 'text-gray-500'}`}>Random Number Generated</h4>
            <p className="text-gray-500 text-sm">
              {steps.completed ? 'Random number has been successfully generated' : 'Waiting for random number generation...'}
            </p>
            
            {/* Random number is now displayed in the parent component */}
          </div>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mt-4">
          <p className="text-red-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Transaction failed:</span> {error.message || 'Unknown error'}
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
