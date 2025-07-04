import tokenAbi from './abis/Token.json';
import airdropAbi from './abis/Airdrop.json';

export const CONTRACTS = {
  TOKEN: {
    address: (process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
    abi: tokenAbi
  },
  AIRDROP: {
    address: (process.env.NEXT_PUBLIC_AIRDROP_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
    abi: airdropAbi
  }
} as const;

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || '31337';
export const NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME || 'Hardhat Local';
