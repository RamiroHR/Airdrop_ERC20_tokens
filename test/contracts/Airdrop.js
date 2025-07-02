/* eslint-disable node/no-unpublished-require */
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Airdrop', function () {
  let token, airdrop, owner, user1, user2;

  beforeEach(async function () {
    // get accounts
    [owner, user1, user2] = await ethers.getSigners();

    // deploy token contract
    const Token = await ethers.getContractFactory('DevToken');
    token = await Token.deploy();

    // deploy airdrop
    const Airdrop = await ethers.getContractFactory('Airdrop');
    airdrop = await Airdrop.deploy(await token.getAddress());

    // Mint some tokens to he airdrop contract
    await token.mint(await airdrop.getAddress(), ethers.parseEther('1000000'));
  });

  // TODO:
  // describe('Test deployment and Ownability') {
  //   it('Should set the right owner for Token') {}
  //   it('Should set the right owner for Airdrop') {}
  //   it('Should mint initial tokens (1M) to the owner - Token.sol contract') {}
  //   it('Should not assign tokens to another user during token.sol deployment') {}
  //   it('Should have minted some tokens to the airdrop address - custom amount for tests') {}
  //   it('Should fai to deploy airdrop with custom message if token address is address(0)')
  // }

  // describe('Owner functionalitites') {
  //   it('Should assign the expected airdrop amount to user') {}
  //   it('Should fail to assign airdrop to adress(0) with custom message') {}
  //   it('Should not allow non-owner to asing airdropt to anothe user' {} //Move here
  // }

  describe('Basic Functionality', function () {
    it('Should allow users to claim  their airdrop', async function () {
      // owner asign airdrop to user
      const airdropAmount = ethers.parseEther('100');
      await airdrop.connect(owner).setAirdropAmount(user1.address, airdropAmount);

      // user claim their token
      await airdrop.connect(user1).claimAll();

      // verify receives the tokens claimed
      expect(await token.balanceOf(user1.address)).to.equal(airdropAmount);

      // verify the token amount is tracked correctly
      expect(await airdrop.claimedAmounts(user1.address)).to.equal(airdropAmount);
    });

    it('Should prevent claiming when no airdrop is asigned', async function () {
      // logic without any previous token asignement by the owner
      await expect(airdrop.connect(user1).claimAll()).to.be.revertedWith('No tokens available to claim');
    });

    it('Should prevent claiming twice', async function () {
      // asing airdrop
      const airdropAmount = ethers.parseEther('50');
      await airdrop.connect(owner).setAirdropAmount(user1.address, airdropAmount);

      // user1 claim once
      await airdrop.connect(user1).claimAll();

      // verify second claim try fails
      await expect(airdrop.connect(user1).claimAll()).to.be.revertedWith('No tokens available to claim');
    });

    // it('Should prevent claiming more than what it was assigned') {}
    // it('Should test reentrancy') {} // ?? check how to do this ?
    // it('Should verify user with airdrop return true for hasAirdrop function') {}
    // it('Should verify user with NO airdrop return false for hasAirdrop function') {}

    it('Should not allow non-owner to asing airdropt to anothe user', async function () {
      // verify non-owner asignement fails
      await expect(
        airdrop.connect(user1).setAirdropAmount(user2.address, ethers.parseEther('200'))
      ).to.be.revertedWithCustomError(airdrop, 'OwnableUnauthorizedAccount');
    });
  });
});
