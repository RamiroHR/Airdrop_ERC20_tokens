/* eslint-disable node/no-unpublished-require */
/* eslint-disable @typescript-eslint/no-require-imports */
require('@nomicfoundation/hardhat-toolbox');
require('@nomicfoundation/hardhat-ignition-ethers');
require('dotenv/config');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
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
      chainId: 31337 // hardhat standard id
    },
    // local development
    localhost: {
      url: process.env.LOCALHOST_URL || 'http://127.0.0.1:8545'
    },
    // tesnet deployment (real word testing scenario)
    sepolia: {
      url: process.env.SEPOLIA_URL || '', // should fail if missing
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    },
    // mainnet deployment (placeholder only - learning purpose)
    mainnet: {
      url: process.env.MAINNET_URL || '', // should fail if missing
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  },
  // // To verify the contact in eteherscan automatically
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY
  // },
  // Display gas cost of each function during the tests
  gasReporter: {
    enabled: process.env.REPORT_GAS,
    currency: 'USD'
  }
};
