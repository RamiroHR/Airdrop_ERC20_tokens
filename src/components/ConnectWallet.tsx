'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div>Connected: {address}</div>
        <button onClick={() => disconnect()} className="btn rounded border bg-gray-700 p-2">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => connect({ connector: injected() })} className="btn">
      Connect Wallet
    </button>
  );
}
