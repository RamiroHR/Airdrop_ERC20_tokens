// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract DevToken is ERC20, Ownable {
  constructor() ERC20("DevToken","DEV") Ownable(msg.sender) {
    _mint(msg.sender, 1000000 * 10**decimals());
  }

  function mint(address to, uint256 amount) external onlyOwner {
    require(to != address(0), "Cannot mint to zero address");
    require(amount > 0, "Amount must be greater than zero");
    _mint(to, amount);
  }
}
