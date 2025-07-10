// Setup script - load on the hardhat console, then call the functions
console.log(`Loading token and Airdrop console helpers...`);

// Determine which env file to use & Load environment variables
const fs = require('fs');
const env = process.env.NODE_ENV || 'local';
const envFile = `.env.${env}`;
console.log(`\t Loading addresses from ${envFile}`);

// Read the env file
const envContent = fs.readFileSync(envFile, 'utf8');

// Parse the addresses
const tokenAddress = envContent.match(/NEXT_PUBLIC_TOKEN_ADDRESS=(.+)/)?.[1];
const airdropAddress = envContent.match(/NEXT_PUBLIC_AIRDROP_ADDRESS=(.+)/)?.[1];

// Get contract instance
// const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_ADDRESS;
const DevToken = await ethers.getContractFactory('DevToken');
const token = DevToken.attach(tokenAddress);

// contracts inatsnace
// const airdropAddress = process.env.NEXT_PUBLIC_AIRDROP_ADDRESS;
const Airdrop = await ethers.getContractFactory('Airdrop');
const airdrop = Airdrop.attach(airdropAddress);

// Get accounts from local node
const [owner, user1, user2, user3] = await ethers.getSigners();

// token Helper functions
const logBalance = async (address, label = 'Balance') => {
  const balance = await token.balanceOf(address);
  console.log(`${label}: ${ethers.formatEther(balance)} DEV`);
};

const logContractInfo = async () => {
  console.log('\n Contract Info:');
  console.log('Name: ', await token.name());
  console.log('Symbol :', await token.symbol());
  console.log('Owner: ', await token.owner());
  console.log('Total supply: ', await ethers.formatEther(await token.totalSupply()));
};

const testMint = async (toAddress, amount) => {
  console.log(`\n Minting ${ethers.formatEther(amount)} tokens to ${toAddress}...`);
  const balanceBefore = await token.balanceOf(toAddress);
  console.log(`Initial balance: ${ethers.formatEther(balanceBefore)} DEV`);

  const tx = await token.mint(toAddress, amount);
  await tx.wait();

  const balanceAfter = await token.balanceOf(toAddress);
  console.log(`Mint successfull! Final Balance: ${ethers.formatEther(balanceAfter)} DEV`);

  return tx;
};

// airdrop helper functions
const setupAirdrop = async (user, amount) => {
  console.log(`\n Setting up airdrop for ${user.address}...`);
  console.log(`Amount: ${ethers.formatEther(amount)} DEV`);

  const tx = await airdrop.setAirdropAmount(user.address, amount);
  await tx.wait();

  const hasAirdrop = await airdrop.hasAirdrop(user.address);
  const airdropAmount = await airdrop.airdropAmounts(user.address);

  console.log(`✅ Airdrop setup complete!`);
  console.log(`Has airdrop: ${hasAirdrop}`);
  console.log(`Amount: ${ethers.formatEther(airdropAmount)} DEV`);

  return tx;
};

const setupTestAirdrops = async () => {
  console.log('\n 🚀 Setting up test airdrops for all users...');

  await setupAirdrop(user1, ethers.parseEther('1000'));
  await setupAirdrop(user2, ethers.parseEther('500'));
  await setupAirdrop(user3, ethers.parseEther('2500'));

  console.log('\n All test airdrops setup complete!');
  console.log('Now test in the frontend app.');
};

/// Quick access functions
global.token = token;
global.owner = owner;
global.user1 = user1;
global.user2 = user2;
global.user3 = user3;
global.logBalance = logBalance;
global.logContractInfo = logContractInfo;
global.testMint = testMint;
global.airdrop = airdrop;
global.setupAirdrop = setupAirdrop;
global.setupTestAirdrops = setupTestAirdrops;

console.log('Console Helpers loadded \n');
console.log('Token functions: logContractInfo, tesMint(address, amount), logBalance(address)');
console.log('Airdrop functions: setupAirdrop(user, amount); setupTestAirdrops()');
console.log('Available aacounts: owner, user1, user2, user3');
