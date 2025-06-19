# Airdrop ERC20 tokens

### Situation

A blockchain company is launching a new ERC20 token and has decided to conduct an airdrop to distribute these tokens to its community. Users must be able to partially withdraw their tokens at their convenience. The system must be secure, efficient, and scalable, using advanced monitoring and optimization techniques.

The current proyect aims to develop:

- A page that allows users to claim the tokens that correspond to them
- A page that allows project owners to know what is happening with their project
  - How many tokens have been claimed out of the total
  - Who were the last ones to withdraw their tokens.
  - Pause/resume the airdrop
- The smart contract to perform the airdrop
- The token smart contract

### Project requirements

**Frontend:**

- Apply all previously acquired frontend skills, ensuring an optimized and efficient user interface.
- Develop an interface that allows users to connect to their wallet, verify their eligibility for the airdrop, and select the amount of tokens they wish to withdraw.
- Ensure that the interface supports multiple devices and is optimized for fast performance and a smooth user experience.

**Smart Contracts:**

- Develop a smart contract in Solidity to manage the ERC20 token airdrop, using Merkle Trees to verify user eligibility and allow partial withdrawals.
- Implement thorough testing to ensure the reliability and security of the smart contract, using tools such as Foundry or Hardhat.

# Directory structure

```
airdrop-erc20-tokens/
│
├── README.md                 # Main project documentation
├── .husky/                   # husky pre-commit hook
│
├── contracts/                # Hardhat project (Solidity smart contracts)
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
├── public/                   # Static assets (images, etc.)
│   ├── token-logo.png
│   └── app-logo.png
│
├── .nvmrc                    # Node version manager config
├── .env                      # environmental variables and configurations
├── .gitignore                # Git ignore rules
├── .editorconfig             # Editor configuration
├── .eslintrc.json            # ESLint configuration
├── .prettierrc.json          # Prettier configuration
├── .prettierignore           # Files that do not need to be formatted (better performance, avoid conflicts)
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locked dependencies
├── next-env.d.ts             # Next.js boilerplate TypeScript declarations
├── next.config.mjs           # Next.js configuration
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── LICENSE                   # Project license
```

# License

This project is licensed under the terms of the license included in the repository.
