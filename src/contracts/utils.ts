import { RAND_EVENT_KEY, EXPLORER_TX_URL } from './constants';

/**
 * Extracts a random number from a transaction receipt
 * @param receipt The transaction receipt
 * @returns The random number as a string, or null if not found
 */
export const getRandomNumberFromReceipt = (receipt: any): string | null => {
  if (!receipt || !receipt.events) return null;
  
  // Find the Rand event using the key selector
  const randEvent = receipt.events.find((event: any) => 
    event.keys && event.keys[0] === RAND_EVENT_KEY
  );
  
  if (!randEvent || !randEvent.data || randEvent.data.length === 0) {
    return null;
  }
  
  // The random number value should be in the data field as a uint256 (low, high)
  // In Cairo, uint256 is represented as [low, high]
  try {
    if (randEvent.data.length >= 2) {
      // Extract low and high parts of uint256
      const lowPart = BigInt(randEvent.data[0]);
      const highPart = BigInt(randEvent.data[1]);
      
      // Combine them to get the full uint256 value
      // high << 128 + low
      const fullValue = (highPart << BigInt(128)) + lowPart;
      
      console.log('Random number from event:', { lowPart, highPart, fullValue: fullValue.toString() });
      return fullValue.toString();
    } else if (randEvent.data.length === 1) {
      // Fallback for single value
      return BigInt(randEvent.data[0]).toString();
    }
    return null;
  } catch (error) {
    console.error('Error parsing random number from event:', error);
    return null;
  }
};

/**
 * Creates an explorer URL for a transaction
 * @param txHash The transaction hash
 * @returns The explorer URL
 */
export const getExplorerUrl = (txHash: string): string => {
  return `${EXPLORER_TX_URL}${txHash}`;
};

/**
 * Formats a transaction hash for display
 * @param txHash The transaction hash
 * @returns The formatted transaction hash
 */
export const formatTxHash = (txHash: string): string => {
  if (!txHash || txHash.length < 18) return txHash;
  return `${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 8)}`;
};
