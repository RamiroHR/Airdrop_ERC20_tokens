import { ConnectWallet } from '@/components/ConnectWallet';
import { TokenBalance } from '@/components/TokenBalance';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-500 p-4">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-gray-900 p-6 shadow-lg">
        <h1 className="mb-8 text-center text-2xl font-bold text-gray-300">ERC20 DEV Token Airdrop</h1>

        <div className="space-y-4">
          <ConnectWallet />
          <TokenBalance />
        </div>
      </div>
    </div>
  );
}
