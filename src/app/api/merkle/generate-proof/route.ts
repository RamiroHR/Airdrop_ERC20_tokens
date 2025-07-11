import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { NextRequest, NextResponse } from 'next/server';
import testWhitelist from '@/config/whitelist.json';

export async function GET(request: NextRequest) {
  // Get address from query parameters
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  // Validate address
  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  // generate the merkle tree
  const tree = StandardMerkleTree.of(testWhitelist, ['address', 'uint']);

  // find user entry, generate proof, and return proof & amount
  let proof;
  let amount;
  for (const [i, v] of tree.entries()) {
    if (v[0] === address) {
      proof = tree.getProof(i);
      amount = v;
      return NextResponse.json({ data: { proof, amount } });
    }
  }

  // if address not in merkle tree
  return NextResponse.json({ error: 'Address not in merkle tree' }, { status: 404 });
}
