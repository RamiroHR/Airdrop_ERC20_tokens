'use client';

import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';
import { useState, useEffect } from 'react';

export function TokenBalance() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
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
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address]
          },
          {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'decimals'
          },
          {
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'symbol'
          }
        ]
      : []
  });

  const formatBalance = (value: bigint, decimals: number, symbol: string) => {
    return `${formatUnits(value, decimals)} ${symbol}`;
  };

  if (!isConnected) {
    return null;
  }

  if (!mounted) {
    return <div className="h-10 w-32 animate-pulse rounded bg-gray-700"></div>;
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
              Token: {formatBalance(tokenResult.data[0] ?? 0n, tokenResult.data[1] ?? 18, tokenResult.data[2] ?? 'DEV')}
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
