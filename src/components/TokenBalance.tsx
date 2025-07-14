'use client';

import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { formatUnits } from 'viem';
import { useState, useEffect } from 'react';
import { CONTRACTS } from '@/config/contracts';

export function TokenBalance() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tokenAddress = CONTRACTS.TOKEN.address;
  const { address, isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // native currency (ETH) balance
  const ethResult = useBalance({ address });

  // token (DEV) balance
  const tokenResult = useReadContracts({
    allowFailure: false,
    contracts: address
      ? [
          {
            address: tokenAddress,
            abi: CONTRACTS.TOKEN.abi,
            functionName: 'balanceOf',
            args: [address]
          },
          {
            address: tokenAddress,
            abi: CONTRACTS.TOKEN.abi,
            functionName: 'decimals'
          },
          {
            address: tokenAddress,
            abi: CONTRACTS.TOKEN.abi,
            functionName: 'symbol'
          }
        ]
      : []
  });

  const formatBalance = (value: bigint, decimals: number, symbol: string) => {
    return `${formatUnits(value, decimals)} ${symbol}`;
  };

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return null;
  }

  if (!visible) {
    return (
      <div className="flex flex-col gap-2 rounded border p-2">
        <button onClick={() => setVisible(!visible)} className="rounded border p-1">
          Show Balance
        </button>
      </div>
    );
  }

  return (
    <div className="align-center flex items-center justify-between rounded border p-2">
      <button onClick={() => setVisible(!visible)} className="rounded border p-1">
        Hide Balance
      </button>

      <div>
        <div className="flex gap-1">
          {tokenResult.isLoading && <p>Loading...</p>}
          {tokenResult.error && <p>Error: {tokenResult.error.message}</p>}
          {tokenResult.data && (
            <p>
              Token:{' '}
              {formatBalance(
                (tokenResult.data[0] as bigint) ?? 0n,
                (tokenResult.data[1] as number) ?? 18,
                (tokenResult.data[2] as string) ?? 'DEV'
              )}
            </p>
          )}
        </div>

        <div>
          {ethResult.isLoading && <p>Loading...</p>}
          {ethResult.error && <p>Error: {ethResult.error.message}</p>}
          {ethResult.data && (
            <p>Coin: {formatBalance(ethResult.data.value, ethResult.data.decimals, ethResult.data.symbol)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
