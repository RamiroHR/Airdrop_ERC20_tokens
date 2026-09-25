/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable node/no-missing-require */
/* eslint-disable node/no-unpublished-require */
const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');
const { ethers } = require('hardhat');

module.exports = buildModule('AirdropModule', m => {
  // deploy the token contract
  const token = m.contract('DevToken');

  // Deploy the Airdrop contract, passing the token address as constructor parameter
  // const airdrop = m.contract('Airdrop', ['0x5FbDB2315678afecb367f032d93F642f64180aa3']);
  const airdrop = m.contract('Airdrop', [token]);

  // Mint initial token distribution to airdrop
  m.call(token, 'mint', [airdrop, ethers.parseEther('1000000')]); // 1M token, 18 decimals

  return { token, airdrop };
});
