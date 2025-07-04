'use client';

import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useState, useEffect } from 'react';
import { CONTRACTS } from '@/config/contracts';

export function UserAirdrop() {
  const [visible, setVisible] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { isLoading, isSuccess, error } = useWaitForTransactionReceipt({ hash });
  const queryClient = useQueryClient();

  const tokenAddress = CONTRACTS.TOKEN.address;
  const airdropAddress = CONTRACTS.AIRDROP.address;

  const airdropEligibility = useReadContracts({
    allowFailure: false,
    contracts: address // if address exists
      ? [
          {
            address: airdropAddress,
            abi: CONTRACTS.AIRDROP.abi,
            functionName: 'hasAirdrop',
            args: [address]
          }
        ]
      : [] // if address not exists
  });

  const airdropData = useReadContracts({
    allowFailure: false,
    contracts: address
      ? [
          {
            address: airdropAddress,
            abi: CONTRACTS.AIRDROP.abi,
            functionName: 'airdropAmounts',
            args: [address]
          },
          {
            address: airdropAddress,
            abi: CONTRACTS.AIRDROP.abi,
            functionName: 'claimedAmounts',
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

  // Calculate available amount (total - claimed)
  const totalAmount = (airdropData.data?.[0] as bigint) ?? 0n;
  const claimedAmount = (airdropData.data?.[1] as bigint) ?? 0n;
  const availableAmount = totalAmount - claimedAmount;
  const decimals = (airdropData.data?.[2] as number) ?? 18;
  const symbol = (airdropData.data?.[3] as string) ?? 'DEV';

  const formatBalance = (value: bigint, decimals: number, symbol: string) => {
    return `${formatUnits(value, decimals)} ${symbol}`;
  };

  const handleClaim = () => {
    writeContract(
      {
        address: airdropAddress,
        abi: CONTRACTS.AIRDROP.abi,
        functionName: 'claimAll'
      },
      {
        onSuccess: data => {
          setHash(data);
        }
      }
    );
  };

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries();
      setHash(undefined); // reset hash for next transaction
    }
  }, [isSuccess, queryClient]);

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="align-center flex-col items-center gap-8 rounded border p-2">
      {/* hasAirdrop ? */}
      <div className="align-center mb-2 flex items-center justify-between">
        <div className="align-center flex items-center gap-4">
          <button onClick={() => setVisible(!visible)} className="rounded border p-1">
            has Airdrop ? :
          </button>
          {visible && (
            <p>
              {airdropEligibility.isLoading && 'Loading...'}
              {airdropEligibility.error && `Error: ${airdropEligibility.error.message}`}
              {airdropEligibility.data?.[0] ? 'Yes' : 'No'}
            </p>
          )}
        </div>

        <div className="align-center flex items-center gap-2">
          <p className="mr-1">to claim: </p>
          <div className="flex min-w-[100px] gap-1">
            {visible ? (
              <>
                {airdropData.isLoading && <p>Loading...</p>}
                {airdropData.error && <p>Error: {airdropData.error.message}</p>}
                {airdropData.data && <p>{formatBalance(availableAmount, decimals, symbol)}</p>}
              </>
            ) : (
              <p className="text-gray-400">---</p>
            )}
          </div>
        </div>
      </div>

      {/* Claim */}
      <div className="align-center mb-2 flex items-center justify-between gap-4">
        <div className="align-center flex items-center gap-4">
          <button
            onClick={handleClaim}
            disabled={!airdropEligibility.data?.[0] || availableAmount === 0n || isPending}
            className="rounded border p-1"
          >
            {isPending ? 'Claiming...' : 'Claim All'}
          </button>

          <div>
            {isLoading && <p>Loading transaction...</p>}
            {isSuccess && <p>Transaction Sucessfull!</p>}
          </div>
        </div>

        <div className="align-center flex items-center gap-2">
          <p className="mr-1">claimed: </p>
          <div className="flex min-w-[100px] gap-1">
            {error && <p>Error: {error.message}</p>}
            {airdropData.data && <p>{formatBalance(claimedAmount, decimals, symbol)}</p>}
          </div>
        </div>
      </div>

      {/* refreshing data */}
      <button onClick={handleRefresh} className="align-center rounded border p-1">
        Refresh Data
      </button>
    </div>
  );
}
