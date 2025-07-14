'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-2 rounded border p-2">
        <button onClick={() => disconnect()} className="btn rounded border bg-gray-700 p-2">
          Disconnect
        </button>
        <div className="text-center">Status: Connected</div>
        <div>{address}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 rounded border p-2">
      <button onClick={() => connect({ connector: injected() })} className="btn rounded border p-2">
        Connect Wallet
      </button>
    </div>
  );
}
