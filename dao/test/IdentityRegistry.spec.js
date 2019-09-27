const {signMessage} = require('./SigningUtils');
const {SolAssert} = require('./SolAssert');
const chai = require('chai');

const assert = chai.assert;
const IdentityRegistry = artifacts.require('./IdentityRegistry.sol');

contract('IdentityRegistry', (accounts) => {
  const owner = accounts[0];
  const user = {
    address: accounts[1],
    metadata: web3.utils.asciiToHex('QmV51fPiTNn2ZcgV5hNVUV7AjhgdVRJ6DXim9zaALpWFYK'),
    rawMetadata: 'QmV51fPiTNn2ZcgV5hNVUV7AjhgdVRJ6DXim9zaALpWFYK',
  };

  const updated = {
    metadata: web3.utils.asciiToHex('QmNUXzJHtjSbqN59jH3TusBHry1FqeegJLYUtfnaY3AXFJ'),
    rawMetadata: 'QmNUXzJHtjSbqN59jH3TusBHry1FqeegJLYUtfnaY3AXFJ',
  };

  let validSignature;
  let updatedSignature;

  before(async () => {
    validSignature = await signMessage(
      web3,
      user.rawMetadata,
      user.address
    );

    updatedSignature = await signMessage(
      web3,
      updated.rawMetadata,
      user.address
    );
  });

  describe('Only owner can...', async () => {
    let instance;

    before(async () => {
      instance = await IdentityRegistry.new({from: owner});
    });

    it('add', async () => {
      await SolAssert.revert(
        async () =>
          await instance.add(user.address, '0x0', '0x0', {from: user.address}),
        'Ownable: caller is not the owner'
      );
    });

    it('remove', async () => {
      await SolAssert.revert(
        async () =>
          await instance.remove(user.address, {from: user.address}),
        'Ownable: caller is not the owner'
      );
    });

    it('update', async () => {
      await SolAssert.revert(
        async () =>
          await instance.update(user.address, '0x0', '0x0', {from: user.address}),
        'Ownable: caller is not the owner'
      );
    });

    it('removeSelf', async () => {
      await SolAssert.revert(
        async () =>
          await instance.removeSelf({from: user.address}),
        'Sender is not a human'
      );
    });
  });

  describe('removeSelf', async () => {
    let instance;

    before(async () => {
      instance = await IdentityRegistry.new({from: owner});
    });

    it('user is not initially registered', async () => {
      const res = await instance.isHuman.call(user.address);
      assert.isFalse(res);
    });

    it('add ID to registry', async () => {
      // Add an ID to the Registry
      const res = await instance.add(user.address, user.metadata, validSignature, {from: owner});
      assert.ok(res);

      // Check if added
      const metadata = await instance.registry.call(user.address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, user.metadata, 'metadata returned not expected');
    });

    it('user attempts to remove self', async () => {
      // User calls removeSelf()
      const res = await instance.removeSelf({from: user.address});
      assert.ok(res);

      // Ensure removed
      const metadata = await instance.registry.call(user.address);
      assert.equal(metadata, null);
    });
  });

  describe('isHuman', async () => {
    let instance;

    before(async () => {
      instance = await IdentityRegistry.new({from: owner});
    });

    it('user is not human before registration', async () => {
      const res = await instance.isHuman.call(user.address);
      assert.isFalse(res);
    });

    it('add ID to registry', async () => {
      // Add an ID to the Registry
      const res = await instance.add(user.address, user.metadata, validSignature, {from: owner});
      assert.ok(res);

      // Check if added
      const metadata = await instance.registry.call(user.address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, user.metadata, 'metadata returned not expected');
    });

    it('isHuman passing post-registry', async () => {
      const res = await instance.isHuman.call(user.address);
      assert.isTrue(res);
    });
  });

  describe('e2e', async () => {
    let instance;

    before(async () => {
      instance = await IdentityRegistry.new({from: owner});
    });

    it('add ID to registry', async () => {
      // Add an ID to the Registry
      const res = await instance.add(user.address, user.metadata, validSignature, {from: owner});
      assert.ok(res);

      // Check if added
      const metadata = await instance.registry.call(user.address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, user.metadata, 'metadata returned not expected');
    });

    it('update ID in registry', async () => {
      const res = await instance.update(user.address, updated.metadata, updatedSignature, {from: owner});
      assert.ok(res);

      const metadata = await instance.registry.call(user.address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, updated.metadata, 'metadata returned not expected');
    });

    it('remove ID from registry', async () => {
      const res0 = await instance.remove(user.address, {from: owner});
      assert.ok(res0);

      const res1 = await instance.isHuman.call(user.address);
      assert.isFalse(res1);
    });
  });
});
