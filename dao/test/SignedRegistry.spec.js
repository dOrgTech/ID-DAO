const {signMessage} = require('./SigningUtils');
const {SolAssert} = require('./SolAssert');
const chai = require('chai');
const assert = chai.assert;
const SignedRegistry = artifacts.require('./registry/SignedRegistry.sol');

contract('SignedRegistry', (accounts) => {
  const deployer = accounts[0];
  const user = {
    address: accounts[1],
    metadata: web3.utils.asciiToHex('QmV51fPiTNn2ZcgV5hNVUV7AjhgdVRJ6DXim9zaALpWFYK'),
    rawMetadata: 'QmV51fPiTNn2ZcgV5hNVUV7AjhgdVRJ6DXim9zaALpWFYK',
  };

  const updated = {
    metadata: web3.utils.asciiToHex('QmNUXzJHtjSbqN59jH3TusBHry1FqeegJLYUtfnaY3AXFJ'),
    rawMetadata: 'QmNUXzJHtjSbqN59jH3TusBHry1FqeegJLYUtfnaY3AXFJ',
  };

  const invalidAddress = accounts[3];

  let validSignature0;
  let validSignature1;
  let invalidSignature;

  before(async () => {
    validSignature0 = await signMessage(
      web3,
      user.rawMetadata,
      user.address
    );

    validSignature1 = await signMessage(
      web3,
      updated.rawMetadata,
      user.address
    );

    invalidSignature = await signMessage(
      web3,
      user.rawMetadata,
      invalidAddress
    );
  });

  describe('Functions', async () => {
    let instance;

    beforeEach(async () => {
      instance = await SignedRegistry.new({from: deployer});
    });

    it('add', async () => {
      // Add an ID to the Registry
      const res = await instance.add(user.address, user.metadata, validSignature0, {from: user.address});
      assert.ok(res);

      // Check if added
      const metadata = await instance.registry.call(user.address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, user.metadata, 'metadata returned not expected');
    });

    it('remove', async () => {
      // Add an ID to the Registry
      let res = await instance.add(user.address, user.metadata, validSignature0, {from: user.address});
      assert.ok(res);

      // Check if existing
      let metadata = await instance.registry.call(user.address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);

      // Remove
      res = await instance.remove(user.address, {from: user.address});
      assert.ok(res);

      // Check if not existing
      metadata = await instance.registry.call(user.address);
      assert.equal(metadata, null);
    });

    it('update', async () => {
      // Add an ID to the Registry
      let res = await instance.add(user.address, user.metadata, validSignature0, {from: user.address});
      assert.ok(res);

      // Check if existing
      let metadata = await instance.registry.call(user.address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);

      // Update
      res = await instance.update(user.address, updated.metadata, validSignature1, {from: user.address});
      assert.ok(res);

      // Check if updated
      metadata = await instance.registry.call(user.address);
      assert.equal(metadata, updated.metadata);
    });
  });

  describe('Only signed metadata...', async () => {
    let instance;

    before(async () => {
      instance = await SignedRegistry.new({from: deployer});
    });

    it('add', async () => {
      await SolAssert.revert(
        async () =>
          await instance.add(user.address, user.metadata, invalidSignature, {from: user.address}),
        'Signature does not match'
      );
    });

    it('update', async () => {
      await SolAssert.revert(
        async () =>
          await instance.update(user.address, user.metadata, invalidSignature, {from: user.address}),
        'Signature does not match'
      );
    });

    describe('Only real addresses...', async () => {
      it('0 address', async () => {
        await SolAssert.revert(
          async () =>
            await instance.add("0x0000000000000000000000000000000000000000", user.metadata, validSignature0, {from: user.address}),
            'user must not be zero address'
        );
      });
    });
  });
});
