const fs = require('fs');
const path = require('path');

// Define the contracts to copy ABIs for
const contracts = [
  {
    name: 'Token',
    artifactPath: 'artifacts/contracts/Token.sol/DevToken.json',
    outputPath: 'src/config/abis/Token.json'
  },
  {
    name: 'Airdrop',
    artifactPath: 'artifacts/contracts/Airdrop.sol/Airdrop.json',
    outputPath: 'src/config/abis/Airdrop.json'
  }
];

// Create the abis directory if it doesn't exist
const abisDir = path.join(__dirname, '../src/config/abis');
if (!fs.existsSync(abisDir)) {
  fs.mkdirSync(abisDir, { recursive: true });
}

// Copy each contract ABI
contracts.forEach(contract => {
  const artifactPath = path.join(__dirname, '..', contract.artifactPath);
  const outputPath = path.join(__dirname, '..', contract.outputPath);

  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    fs.writeFileSync(outputPath, JSON.stringify(artifact.abi, null, 2));
    console.log(`Copied ABI for ${contract.name} to ${contract.outputPath}`);
  } else {
    console.warn(`Artifact not found: ${artifactPath}`);
    console.warn(`   Run 'npx hardhat compile' first to generate artifacts`);
  }
});

console.log('\n *** ABI copying complete! ***');
