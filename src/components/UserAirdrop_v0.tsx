'use client';

import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CheckCircle, XCircle, Loader2, ExternalLink, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useState, useEffect } from 'react';
import { CONTRACTS } from '@/config/contracts';

export function UserAirdrop_v0() {
  const [visible, setVisible] = useState(false);
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { isLoading, isSuccess, error } = useWaitForTransactionReceipt({ hash });
  const queryClient = useQueryClient();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [successHash, setSuccessHash] = useState<`0x${string}` | undefined>();

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
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setSuccessHash(undefined);

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
      setShowSuccessMessage(true); // permanent sucess message
      setSuccessHash(hash); // Store the successfull hash before reset
      setHash(undefined); // reset hash for next transaction
    }
  }, [isSuccess, queryClient, hash]);

  useEffect(() => {
    if (error) {
      setShowErrorMessage(true); //permanent error message
      setHash(undefined);
    }
  }, [error]);

  const handleRefresh = () => {
    queryClient.invalidateQueries();
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setSuccessHash(undefined);
  };

  // Add function to clear messages manually
  const clearMessages = () => {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setSuccessHash(undefined);
  };

  const renderTransactionStatus = () => {
    // Show permanent success message
    if (showSuccessMessage) {
      return (
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="size-4" />
          <span>Transaction successful!</span>
          {successHash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${successHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-500 underline hover:text-blue-700"
            >
              <ExternalLink className="size-3" />
              View on Etherscan
            </a>
          )}
          <button onClick={clearMessages} className="text-gray-500 transition-colors hover:text-gray-700">
            <X className="size-4" />
          </button>
        </div>
      );
    }

    // Show permanent error message
    if (showErrorMessage) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="size-4" />
          <span>Transaction failed: {error?.message}</span>
          <button onClick={clearMessages} className="text-gray-500 transition-colors hover:text-gray-700">
            <X className="size-4" />
          </button>
        </div>
      );
    }

    // Show transitory states
    if (isPending) {
      return (
        <div className="flex items-center gap-2 text-blue-600">
          <Loader2 className="size-4 animate-spin" />
          <span>Transaction pending...</span>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-yellow-600">
          <Loader2 className="size-4 animate-spin" />
          <span>Confirming transaction...</span>
        </div>
      );
    }

    return null;
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
          {/* Refresh info */}
          <button onClick={handleRefresh} className="align-center rounded border p-1">
            Refresh Data
          </button>

          {/* Claim all */}
          <button
            onClick={handleClaim}
            disabled={!airdropEligibility.data?.[0] || availableAmount === 0n || isPending}
            className="rounded border p-1"
          >
            {isPending ? 'Claiming...' : 'Claim All'}
          </button>
        </div>

        {/* Claimed information */}
        <div className="align-center flex items-center gap-2">
          <p className="mr-1">claimed: </p>
          <div className="flex min-w-[100px] gap-1">
            {error && <p>Error: {error.message}</p>}
            {airdropData.data && <p>{formatBalance(claimedAmount, decimals, symbol)}</p>}
          </div>
        </div>
      </div>

      {/* transaction status information */}
      <div className="mt-2">{renderTransactionStatus()}</div>
    </div>
  );
}
