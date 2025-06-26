// Setup script - load on the hardhat console, then call the functions
const tokenName = 'DevToken';

console.log(`Loading ${tokenName} console helpers...`);

// Get contract instance
// const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const tokenAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

const DevToken = await ethers.getContractFactory(tokenName);
const token = DevToken.attach(tokenAddress);

// Get accounts from local node
const [owner, user1, user2, user3] = await ethers.getSigners();

// Helper functions
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

/// Quick access functions
global.token = token;
global.owner = owner;
global.user1 = user1;
global.user2 = user2;
global.user3 = user3;
global.logBalance = logBalance;
global.logContractInfo = logContractInfo;
global.testMint = testMint;

console.log('Console Helpers loadded');
console.log('Available functions: logContractInfo, tesMint(address, amount), logBalance(address)');
console.log('Available aacounts: owner, user1, user2, user3');
