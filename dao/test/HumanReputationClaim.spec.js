const {signMessage} = require('./SigningUtils');
const {SolAssert} = require('./SolAssert');
const chai = require('chai');
const assert = chai.assert;
const toHex = web3.utils.toHex;
const hexToBytes = web3.utils.hexToBytes;

const IdentityRegistry = artifacts.require('./IdentityRegistry.sol');
const HumanReputationClaim = artifacts.require('./HumanReputationClaim.sol');
const Avatar = artifacts.require('@daostack/arc/contracts/controller/Avatar.sol');
const Controller = artifacts.require('@daostack/arc/contracts/controller/Controller.sol');
const DAOToken = artifacts.require('@daostack/arc/contracts/controller/DAOToken.sol');
const Reputation = artifacts.require('@daostack/infra/contracts/Reputation.sol');

contract('HumanReputationClaim', (accounts) => {
  const owner = accounts[0];

  let registry;
  let claimScheme;
  let avatar;
  let controller;
  let reputation;
  let daoToken;
  const reputationClaim = 500;

  const humanA = {
    address: accounts[1],
    metadata: 'QmV51fPiTNn2ZcgV5hNVUV7AjhgdVRJ6DXim9zaALpWFYK',
    signature: '',
  };

  const humanB = {
    address: accounts[2],
    metadata: 'QmNUXzJHtjSbqN59jH3TusBHry1FqeegJLYUtfnaY3AXFJ',
    signature: '',
  };

  before(async () => {
    // Sign Metadata
    humanA.signature = await signMessage(
      web3, humanA.metadata, humanA.address
    );

    humanB.signature = await signMessage(
      web3, humanB.metadata, humanB.address
    );

    // Deploy IdentityRegistry
    registry = await IdentityRegistry.new({from: owner});

    // Add test humans
    await registry.add(humanA.address, toHex(humanA.metadata), humanA.signature, {from: owner});
    await registry.add(humanB.address, toHex(humanB.metadata), humanB.signature, {from: owner});

    // Deploy HumanReputationClaim UScheme
    claimScheme = await HumanReputationClaim.new(registry.address, {from: owner});

    // Deploy our DAO
    daoToken = await DAOToken.new('ID', 'ID', 0, {from: owner});
    reputation = await Reputation.new({from: owner});
    avatar = await Avatar.new('ID-DAO', daoToken.address, reputation.address, {from: owner});
    controller = await Controller.new(avatar.address, {from: owner});

    // Transfer IdentityRegistry Ownership
    await registry.transferOwnership(avatar.address, {from: owner});

    // Transfer Avatar,DAOToken, & Reputation Ownership
    await avatar.transferOwnership(controller.address, {from: owner});
    await reputation.transferOwnership(controller.address, {from: owner});
    await daoToken.transferOwnership(controller.address, {from: owner});

    // Add the HumanReputationClaim Scheme
    const paramsHash = await claimScheme.getParametersHash(reputationClaim);
    await claimScheme.setParameters(reputationClaim);
    await controller.registerScheme(claimScheme.address, paramsHash, toHex('0'), avatar.address);
  });

  it('Sanity', async () => {
    const resA = await claimScheme.claim(avatar.address, humanA.address, {from: owner});
    const resB = await claimScheme.claim(avatar.address, humanB.address, {from: owner});
    assert.ok(resA);
    assert.ok(resB);

    const verifyEvent = async (tx, human) => {
      // HumanReputationClaimed Event
      const claimEvent = tx.logs[0];
      expect(claimEvent).to.not.be.undefined;
      expect(claimEvent.event).to.be.equal('HumanReputationClaimed');
      {
        const {_avatar, _human, _amount} = claimEvent.args;
        expect(_avatar).to.be.equal(avatar.address);
        expect(_human).to.be.equal(human.address);
        expect(_amount.toNumber()).to.be.equal(reputationClaim);
      }

      // Ensure the claimed flag is set
      expect(
        await claimScheme.hasClaimed(avatar.address, human.address)
      ).to.be.equal(true);

      // And that the human now has a reputation balance
      expect(
        (await reputation.balanceOf(human.address)).toNumber()
      ).to.be.equal(reputationClaim);
    };

    await verifyEvent(resA, humanA);
    await verifyEvent(resB, humanB);
  });

  it('Non-Human Fails', async () => {
    await SolAssert.revert(
      async () =>
        await claimScheme.claim(avatar.address, accounts[3], {from: owner}),
      'human is not registered'
    );
  });

  it('Cannot Claim Twice', async () => {
    await SolAssert.revert(
      async () =>
        await claimScheme.claim(avatar.address, humanA.address, {from: owner}),
      'human has already claimed reputation'
    );
  });
});
