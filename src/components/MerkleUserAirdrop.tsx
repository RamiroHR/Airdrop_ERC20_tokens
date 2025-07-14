'use client';

import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CheckCircle, XCircle, Loader2, ExternalLink, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useState, useEffect, useCallback } from 'react';
import { CONTRACTS } from '@/config/contracts';

export function MerkleUserAirdrop() {
  const [mounted, setMounted] = useState(false);

  // Context providers
  const queryClient = useQueryClient();
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { isLoading, isSuccess, error } = useWaitForTransactionReceipt({ hash });

  // state variables
  const [visible, setVisible] = useState(false);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [isLoadingEligibility, setIsLoadingEligibility] = useState(false);

  const [successHash, setSuccessHash] = useState<`0x${string}` | undefined>();
  const [merkleData, setMerkleData] = useState<{
    proof: string[];
    amount: [string, string];
  } | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // fetch data from airdrop contract (blockchain)
  const airdropData = useReadContracts({
    allowFailure: false,
    contracts: address
      ? [
          {
            address: CONTRACTS.AIRDROP.address,
            abi: CONTRACTS.AIRDROP.abi,
            functionName: 'claimedAmounts',
            args: [address]
          },
          {
            address: CONTRACTS.TOKEN.address,
            abi: CONTRACTS.TOKEN.abi,
            functionName: 'decimals'
          },
          {
            address: CONTRACTS.TOKEN.address,
            abi: CONTRACTS.TOKEN.abi,
            functionName: 'symbol'
          }
        ]
      : []
  });

  // Get merkle proof and airdrop amount asigned from backend server
  const fetchMerkleProof = useCallback(async () => {
    if (!address) return;

    setIsLoadingEligibility(true);
    try {
      const response = await fetch(`/api/merkle/generate-proof?address=${address}`);
      const data = await response.json();

      if (response.ok) {
        setMerkleData(data.data);
        setIsEligible(true);
      } else {
        setIsEligible(false);
        setMerkleData(null);
      }
    } catch (apiError) {
      setIsEligible(false);
      setMerkleData(null);
      console.error('Error fetching proof: ', apiError);
    } finally {
      setIsLoadingEligibility(false);
    }
  }, [address]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      fetchMerkleProof();
    }
  }, [isConnected, address, fetchMerkleProof]);

  // net values calculations
  const totalAmount: bigint = merkleData ? BigInt(merkleData.amount[1]) : 0n;
  const claimedAmount: bigint = (airdropData.data?.[0] as bigint) ?? 0n;
  const availableAmount: bigint = totalAmount - claimedAmount;
  const decimals = (airdropData.data?.[1] as number) ?? 18;
  const symbol = (airdropData.data?.[2] as string) ?? 'DEV';

  // create a readable string representation with units. Ex: '100 DEV'
  const formatBalance = (value: bigint, decimals: number, symbol: string) => {
    return `${formatUnits(value, decimals)} ${symbol}`;
  };

  // Claim button action
  const handleClaim = () => {
    if (!merkleData) return;

    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setSuccessHash(undefined);

    // call smart contract
    writeContract(
      {
        address: CONTRACTS.AIRDROP.address,
        abi: CONTRACTS.AIRDROP.abi,
        functionName: 'claimAll',
        args: [merkleData.proof, merkleData.amount[1]] // proof and amount
      },
      {
        // get transation has for confirmation in etherscan
        onSuccess: data => {
          setHash(data);
        }
      }
    );
  };

  // Update/reload FE when ClaimAll transaction completes sucessfully:
  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries();
      setShowSuccessMessage(true); // permanent sucess message
      setSuccessHash(hash); // store the successfull hash before reseting it
      setHash(undefined); // reset hash, ready for next transaction
    }
  }, [isSuccess, queryClient, hash]);

  // Update/reload FE when ClaimAll transaction fails into an error
  useEffect(() => {
    if (error) {
      setShowErrorMessage(true); //permanent error message
      setHash(undefined);
    }
  }, [error]);

  // refresh button action
  const handleRefresh = () => {
    queryClient.invalidateQueries();
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setSuccessHash(undefined);
    if (isConnected && address) {
      fetchMerkleProof();
    }
  };

  // X-button function to clear messages manually
  const clearMessages = () => {
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setSuccessHash(undefined);
  };

  // Transaction status message + link + X-button action
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

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return null;
  }

  return (
    <div className="align-center flex-col items-center gap-8 rounded border p-2">
      {/* Verify Airdrop Eligibility */}
      <div className="align-center mb-2 flex items-center justify-between">
        <div className="align-center flex items-center gap-4">
          <button onClick={() => setVisible(!visible)} className="rounded border p-1">
            has Airdrop ? :
          </button>
          {visible ? (
            <>
              {/* Loading states */}
              {(airdropData.isLoading || isLoadingEligibility) && <p>Loading...</p>}

              {/* Error states */}
              {airdropData.error && <p>Error: {airdropData.error.message}</p>}

              {/* Eligibility status */}
              {!isLoadingEligibility && !isEligible && <p>Not eligible for airdrop</p>}

              {/* Success state */}
              {isEligible && airdropData.data && merkleData && !airdropData.isLoading && !isLoadingEligibility && (
                <p>{formatBalance(totalAmount, decimals, symbol)}</p>
              )}
            </>
          ) : (
            <p className="text-gray-400">---</p>
          )}
        </div>

        {/* Available amount to claim */}
        <div className="align-center flex items-center gap-2">
          <p className="mr-1">to claim: </p>
          <div className="flex min-w-[100px] gap-1">
            {visible ? (
              <>
                {airdropData.isLoading && <p>Loading...</p>}
                {airdropData.error && <p>Error: {airdropData.error.message}</p>}
                {airdropData.data && merkleData && <p>{formatBalance(availableAmount, decimals, symbol)}</p>}
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
            disabled={!isEligible || !merkleData || isPending || airdropData.isLoading || isLoadingEligibility}
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
