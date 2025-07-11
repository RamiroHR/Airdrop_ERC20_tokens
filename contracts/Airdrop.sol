// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

contract Airdrop is ReentrancyGuard, Ownable {
    // state variables decalarations
    IERC20 public immutable token; //of type Interface-ERC20 with methods: .transfer(), .balance(), .approuve(), etc
    bytes32 public merkleRoot;
    mapping(address => uint256) public claimedAmounts; //to track address:claimed_amounts

    // Events
    event RootSet(bytes32 merkleRoot);
    event TokensClaimed(address user, uint256 amount);

    // Constructor executes once at deploy
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token); // cast address to interface (with methods)
    }

    // set the merkle Root
    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
      merkleRoot = _merkleRoot;
      emit RootSet(_merkleRoot);
    }


    // for user to claim theiir airdrop
    function claimAll(bytes32[] memory proof, uint256 amount) public nonReentrant {
        address user = msg.sender;

        // verify if already claimed
        require(claimedAmounts[user] == 0, "Already claimed");

        // create leaf with double hash encoding for security (prevent lenght extension attacks)
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(user, amount))));

        // verify proof
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        // Update claimed amount, then transfer (reversible if transfer fails)
        claimedAmounts[user] = amount;
        require(token.transfer(user, amount), "Token transfer failed");

        // emit event;
        emit TokensClaimed(user, amount);
    }

}
