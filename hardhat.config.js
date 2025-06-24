/* eslint-disable node/no-unpublished-import */
import '@nomicfoundation/hardhat-toolbox';
import 'dotenv/config';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.19',
    settings: {
      // to reduce gas cost by optimizing the contract bytecode
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    // local development
    localhost: {
      url: 'http://127.0.0.1:8545'
    },
    // tesnet deployment (real word testing scenario)
    sepolia: {
      url: process.env.SEPOLIA_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    // mainnet deployment (placeholder only - learning purpose)
    mainnet:  {
      url: process.env.MAINNET_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  // To verify the contact in eteherscan automatically
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  // Display gas cost of each function during the tests
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD'
  }
};
