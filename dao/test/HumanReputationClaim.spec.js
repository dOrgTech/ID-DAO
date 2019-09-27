const {signMessage} = require('./SigningUtils');
const {SolAssert} = require('./SolAssert');
const chai = require('chai');
const assert = chai.assert;
const asciiToHex = web3.utils.asciiToHex;

const IdentityRegistry = artifacts.require('./IdentityRegistry.sol');
const HumanReputationClaim = artifacts.require('./HumanReputationClaim.sol');
const Avatar = artifacts.require('@daostack/arc/contracts/controller/Avatar.sol');
const Controller = artifacts.require('@daostack/arc/contracts/controller/Controller.sol');
const DAOToken = artifacts.require('@daostack/arc/contracts/controller/DAOToken.sol');
const Reputation = artifacts.require('@daostack/infra/contracts/Reputation.sol');

contract('HumanReputationClaim', async (accounts) => {
  const owner = accounts[0];

  const humanA = {
    address: accounts[1],
    metadata: 'QmV51fPiTNn2ZcgV5hNVUV7AjhgdVRJ6DXim9zaALpWFYK',
    signature: ''
  };
  humanA.signature = await signMessage(
    web3, humanA.metadata, humanA.address
  );

  const humanB = {
    address: accounts[2],
    metadata: 'QmNUXzJHtjSbqN59jH3TusBHry1FqeegJLYUtfnaY3AXFJ',
    signature: ''
  };
  humanB.signature = await signMessage(
    web3, humanB.metadata, humanB.address
  );

  let registry;
  let claimScheme;
  let avatar;
  let controller;
  let reputation;
  let daoToken;
  const reputationClaim = 500;

  beforeEach(async () => {
    // Deploy IdentityRegistry
    registry = await IdentityRegistry.new({from: owner});

    // Add test humans
    await registry.add(humanA.address, asciiToHex(humanA.metadata), humanA.signature, {from: owner})
    await registry.add(humanB.address, asciiToHex(humanB.metadata), humanB.signature, {from: owner})

    // Deploy HumanReputationClaim UScheme
    claimScheme = await HumanReputationClaim.new(registry.address, {from: owner});

    // Deploy our DAO
    daoToken = await DAOToken.new('ID', 'ID', 0, {from: owner});
    reputation = await Reputation.new({from: owner});
    avatar = await Avatar.new('ID-DAO', daoToken.address, reputation.address, {from: owner});
    controller = await Controller.new(avatar.address, {from: owner});

    // Transfer IdentityRegistry, DAOToken, & Reputation Ownership
    await registry.transferOwnership(avatar.address, {from: owner});
    await reputation.transferOwnership(avatar.address, {from: owner});
    await daoToken.transferOwnership(avatar.address, {from: owner});

    // Transfer Avatar Ownership
    await avatar.transferOwnership(controller.address, {from: owner});

    // Add the HumanReputationClaim Scheme
    await controller.registerScheme(claimScheme.address, reputationClaim, '0', avatar.address);
  });

  it('Sanity', async () => {
    const resA = await claimScheme.claim(avatar.address, humanA.address, {from: owner});
    const resB = await claimScheme.claim(avatar.address, humanB.address, {from: owner});
  });

  it('Non-Human Fails', async () => {
    // TODO: accounts[3]
  });

  it('No Reputation Fails', async () => {
    // TODO:
  });

  it('Negative Reputation Fails', async () => {
    // TODO:
  });

  it('Cannot Claim Twice', async () => {
    // TODO:
  });

  it('Unregistered Avatar Fails', async () => {
    // TODO:
  });
});
