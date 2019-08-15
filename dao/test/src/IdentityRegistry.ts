/**

  Testing IdentityRegistry.sol

*/

const contracts = require('./contracts');
const solAssert = require('./solAssert');
// const util = require('util');

const instances = {};

contract('IdentityRegistry', (accounts) => {
  const owner = accounts[0];
  const users = [
    {
      address: accounts[1],
      metadata: '0xb5689b817f4d6dc4d28676ea1a0af6bdeac27ceaf5381cfe',
    },
    {
      address: accounts[2],
      metadata: '0x0589a7eda839a6d2e0af0d7a4af3c3e69b2b2473b69daf77',
    },
    {
      address: accounts[3],
      metadata: '0x2964d850f3c1249264908cf530b787a5bd83229a57948233',
    },
  ];


  it('Deploy IdentityRegistry', async () => {
    instances.IdentityRegistry = await contracts.IdentityRegistry.new({from: owner});
  });

  describe('Only owner can...', async () => {
    it('add', async () => {
      await solAssert.revert(
          async () => {
            await instances.IdentityRegistry.add(users[0].address, '0x0', {from: users[0].address});
          }
          , 'Ownable: caller is not the owner');
    });

    it('remove', async () => {
      await solAssert.revert(
          async () => {
            await instances.IdentityRegistry.remove(users[0].address, {from: users[0].address});
          }
          , 'Ownable: caller is not the owner');
    });

    it('update', async () => {
      await solAssert.revert(
          async () => {
            await instances.IdentityRegistry.update(users[0].address, '0x0', {from: users[0].address});
          }
          , 'Ownable: caller is not the owner');
    });
  });

  describe('removeSelf', async () => {
    before(async () => {
      instances.IdentityRegistry = await contracts.IdentityRegistry.new({from: owner});
    });

    it('user is not initially registered', async () => {
      const res = await instances.IdentityRegistry.isHuman.call(users[0].address);
      assert.isFalse(res);
    });

    it('add ID to registry', async () => {
      // Add an ID to the Registry
      const res = await instances.IdentityRegistry.add(users[0].address, users[0].metadata, {from: owner});
      assert.ok(res);

      // Check if added
      const metadata = await instances.IdentityRegistry.registry.call(users[0].address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, users[0].metadata, 'metadata returned not expected');
    });

    it('user attempts to remove self', async () => {
      // User calls removeSelf()
      const res = await instances.IdentityRegistry.removeSelf({from: users[0].address});
      assert.ok(res);

      // Ensure removed
      const metadata = await instances.IdentityRegistry.registry.call(users[0].address);
      assert.equal(metadata, null);
    });
  });

  describe('isHuman', async () => {
    before(async () => {
      instances.IdentityRegistry = await contracts.IdentityRegistry.new({from: owner});
    });

    it('user is not human before registration', async () => {
      const res = await instances.IdentityRegistry.isHuman.call(users[0].address);
      assert.isFalse(res);
    });

    it('add ID to registry', async () => {
      // Add an ID to the Registry
      const res = await instances.IdentityRegistry.add(users[0].address, users[0].metadata, {from: owner});
      assert.ok(res);

      // Check if added
      const metadata = await instances.IdentityRegistry.registry.call(users[0].address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, users[0].metadata, 'metadata returned not expected');
    });

    it('isHuman passing post-registry', async () => {
      const res = await instances.IdentityRegistry.isHuman.call(users[0].address);
      assert.isTrue(res);
    });
  });
});


