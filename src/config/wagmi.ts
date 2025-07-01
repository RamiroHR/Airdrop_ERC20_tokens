/* eslint-disable node/no-unpublished-import */
import { http, createConfig } from 'wagmi';
import { hardhat, sepolia, mainnet } from 'wagmi/chains';
import dotenv from 'dotenv';

dotenv.config();

export const config = createConfig({
  chains: [hardhat, sepolia, mainnet],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(process.env.SEPOLIA_URL),
    [mainnet.id]: http(process.env.MAINNET_URL)
  }
});
