# Airdrop ERC20 tokens

A secure and efficient ERC20 token airdrop system with partial withdrawal capabilities, built with Next.js, Solidity, and Hardhat for seamless token distribution to communities.

#### Development Status Legend:

> ✅ Completed, ⬜ Not implemented, 🔄 In progress

## About This Project

This project implements a comprehensive airdrop solution that allows blockchain projects to distribute ERC20 tokens to their community members efficiently and securely. The system features partial withdrawal capabilities, ensuring users can claim their tokens at their convenience while maintaining security through smart contract best practices.

### Key Features

- **Smart Contracts**:
  - ✅ Token smart contract.
  - 🔄 The smart contract to perform the airdrop.
  - ⬜ Using Merkle Trees to verify user eligibility.
  - ✅ Secure Token Distribution: Smart contracts with reentrancy protection.
- **User Functionalities**:
  - ✅ Wallet Connection: users can connect their wallet
  - 🔄 Eligibility: users can verify if they have an airdrop asigned to them.
  - ⬜ Partial Withdrawals: Users can claim tokens in multiple transactions.
- **Admin Dashboard**:
  - ⬜ quasi-real-time monitoring of airdrop progress and user activity:
  - ⬜ How many tokens have been claimed out of the total.
  - ⬜ Who were the last ones to withdraw their tokens.
  - ⬜ Pause/resume the airdrop.
- **Frontend**:
  - 🔄 Efficient user interface optimized for fast performance.
  - 🔄 Supports multiple devices.
  - ⬜ Ensure a smooth user experience.
- **Gas Optimization**:
  - ⬜ Efficient contract design for cost-effective operations
- **Comprehensive Testing**:
  - 🔄 Thorough test coverage ensuring reliability and security

### Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin Contracts
- **Development**: Hardhat, Chai, Ethers.js
- **Database**: PostgreSQL with Prisma ORM
- **Web3 Integration**: Wagmi + Viem for wallet connectivity

# Directory structure

```
airdrop-erc20-tokens/
│
├── README.md                 # Main project documentation
├── .husky/                   # husky pre-commit hook
│
├── contracts/                # Solidity smart contracts
│
├── ignition/                 # Hardhat contract deployment scripts
│
├── prisma/                   # Prisma schema and migrations (PostgreSQL database)
│
├── src/                      # Next.js 14 app source
│   ├── app/                  # Next.js app directory (frontend + API routes)
│   │   ├── api/              # API routes (backend logic)
│   │   ├── claim/            # User claim page
│   │   ├── admin/            # Admin dashboard
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/           # React components
│   ├── hooks/                # Custom hooks
│   ├── store/                # Zustand state
│   ├── utils/                # Utility functions
│   ├── fonts/                # imported fonts
│   └── styles/               # Tailwind/global CSS
│
├── test/                     # Unified test folder
│   ├── contracts/            # Smart contract tests
│   └── api/                  # API route tests
│
├── scripts/                  # Hardhat utility functions
│
├── public/                   # Static assets (images, etc.)
│   ├── token-logo.png
│   └── app-logo.png
│
├── .nvmrc                    # Node version manager config
├── .env                      # default environmental variables and configurations
├── .env.local.example        # template for additional variables in local|tesnet|mainnet environment
├── .gitignore                # Git ignore rules
├── .editorconfig             # Editor configuration
├── .eslintrc.json            # ESLint configuration
├── .prettierrc.json          # Prettier configuration
├── .prettierignore           # For better prettier performance & avoid conflicts
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locked dependencies
├── next-env.d.ts             # Next.js boilerplate TypeScript declarations
├── next.config.mjs           # Next.js configuration
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── LICENSE                   # Project license
```

<br>

# Setup Environmental Variables

This project uses environment-specific configuration files. Follow the template to set up your environment.

## Quick Setup

1. **Choose your environment** and copy the template:

   ```bash
   # For local development
   cp .env.local.example .env.local

   # For testnet deployment
   cp .env.local.example .env.development

   # For mainnet deployment
   cp .env.local.example .env.production
   ```

2. **Edit your environment file** following the instructions in the template:
   - Keep only the sections you need for your environment
   - Delete or comment out unused sections
   - Fill in your actual values

3. **Deploy contracts** to get addresses:
   ```bash
   npx hardhat ignition deploy ignition/modules/Airdrop.js
   # Copy the addresses to your environment file
   ```

### **Environment-Specific Setup**:

#### Local Development (`.env.local`)

- ✅ Keep: Contract addresses, local network settings
- ❌ Delete: RPC URLs, private keys, API keys

#### Testnet Deployment (`.env.development`)

- ✅ Keep: Contract addresses, Sepolia RPC URL, private key, Etherscan API key
- ❌ Delete: Local network settings, mainnet settings

#### Mainnet Deployment (`.env.production`)

- ✅ Keep: Contract addresses, mainnet RPC URL, private key, Etherscan API key
- ❌ Delete: Local network settings, testnet settings

## Security Notes

- ⚠️ **Never commit** environment files with secrets
- ⚠️ **Keep private keys secure** - only use for deployment
- ✅ The base `.env` file is safe to commit

# Testing

## Running Tests

### Smart Contract Tests

```bash
# Run all smart contract tests (with gas reporting by default)
npx hardhat test

# Run specific test file
npx hardhat test test/contracts/Airdrop.js

# For debugging failed tests with detailed timing and console.logs outputs
npx hardhat test --verbose
```

### Current Test Results

**Test Coverage:**

- Basic airdrop claiming functionality
- Security and access control validation
- Partial withdrawal logic verification
- Gas cost analysis and optimization tracking

<br>

**Test Suite:** `test/contracts/Airdrop.js`

![Contract Tests Report](/public/contract-tests-gasReport.png)

**Test Summary:**

- **Status:** ✅ All tests passing
- **Framework:** Hardhat + Chai + Ethers.js
- **Network:** Local Hardhat network (free testing)
- **Solidity Version:** 0.8.20
- **OpenZeppelin Contracts:** 5.3.0

### Test Coverage

```bash
# Generate test coverage report
npx hardhat coverage
```

![Contract Tests Report](/public/contract-tests-coverage.png)

# License

This project is licensed under the terms of the license included in the repository.
