import { ConnectWallet } from '@/components/ConnectWallet';
import { TokenBalance } from '@/components/TokenBalance';
// import { UserAirdrop_v0 } from '@/components/UserAirdrop_v0';
import { MerkleUserAirdrop } from '@/components/MerkleUserAirdrop';
import { Flame } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-500 p-4">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-gray-900 p-6 shadow-lg">
        <h1 className="font-italic text-center text-2xl text-gray-300">ERC20 Token Airdrop</h1>

        <div className="mb-8 flex items-center justify-center gap-2">
          <Flame className="flame-left size-6 text-orange-500" />
          <div className="flex">
            <h1 className="animate-bounce text-2xl font-bold text-orange-500">D</h1>
            <h1 className="animate-bounce text-2xl font-bold text-orange-500" style={{ animationDelay: '0.45s' }}>
              E
            </h1>
            <h1 className="animate-bounce text-2xl font-bold text-orange-500" style={{ animationDelay: '0.3s' }}>
              V
            </h1>
          </div>
          <Flame className="flame-right size-6 text-orange-500" />
        </div>

        <div className="space-y-4">
          <ConnectWallet />
          <TokenBalance />
          {/* <UserAirdrop_v0 /> */}
          <MerkleUserAirdrop />
        </div>
      </div>
    </div>
  );
}
