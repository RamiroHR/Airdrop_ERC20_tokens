// Type definitions for contract ABIs
import type { Abi } from 'viem';

declare module '*/abis/Token.json' {
  const abi: Abi;
  export default abi;
}

declare module '*/abis/Airdrop.json' {
  const abi: Abi;
  export default abi;
}
