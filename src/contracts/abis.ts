// ABIs for Starknet contracts

// Reservoir Contract ABI
export const RESERVOIR_ABI = [
  {
    name: 'get_count',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'count', type: 'u64' }],
    stateMutability: 'view'
  },
  {
    name: 'get',
    type: 'function',
    inputs: [],
    outputs: [{ name: 'entropy', type: 'u256' }],
    stateMutability: 'view'
  },
  {
    name: 'put',
    type: 'function',
    inputs: [{ name: 'entropy', type: 'u256' }],
    outputs: [],
    stateMutability: 'external'
  }
];

// Random Provider Contract ABI
export const RANDOM_PROVIDER_ABI = [
  {
    name: 'rand',
    type: 'function',
    inputs: [{ name: 'amount', type: 'u256' }],
    outputs: [{ name: 'value', type: 'u256' }],
    stateMutability: 'external'
  }
];

// Event definitions
export const RANDOM_PROVIDER_EVENTS = {
  Rand: {
    name: 'Rand',
    type: 'event',
    inputs: [{ name: 'value', type: 'u256' }]
  }
};
