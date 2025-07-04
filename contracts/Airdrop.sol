// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

contract Airdrop is ReentrancyGuard, Ownable {
    // state variables decalarations
    IERC20 public immutable token; //of type Interface-ERC20 with methods: .transfer(), .balance(), .approuve(), etc
    mapping(address => uint256) public airdropAmounts; //to store address:airdrop_amount
    mapping(address => uint256) public claimedAmounts; //to track address:claimed_amounts

    // Events
    event AirdropSet(address user, uint256 amount);
    event TokensClaimed(address user, uint256 amount);

    // Constructor executes once at deploy
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token); // cast address to interface (with methods)
    }

    // set airdrop amount for a user - owner only
    function setAirdropAmount(address user, uint256 amount) public onlyOwner {
        require(user != address(0), "Invalid user address");
        airdropAmounts[user] = amount;
        emit AirdropSet(user, amount);
    }

    // for user to claim theiir airdrop
    function claimAll() public nonReentrant {
        address user = msg.sender;
        uint256 availableAmount = airdropAmounts[user] - claimedAmounts[user];

        require(availableAmount > 0, "No tokens available to claim");

        // Update claimed amount, then transfer (reversible if transfer fails)
        claimedAmounts[user] += availableAmount;
        require(token.transfer(user, availableAmount), "Token transfer failed");

        emit TokensClaimed(user, availableAmount);
    }

    function hasAirdrop(address user) public view returns (bool) {
        return airdropAmounts[user] > 0;
    }
}
