/**

  Testing IdentityRegistry.sol

*/

import contracts = require('./contracts');
import solAssert = require('./solAssert');

import chai = require('chai');
const assert = chai.assert;
// const util = require('util');

const instances: any = {};

contract('IdentityRegistry', (accounts) => {
  const owner: string = accounts[0];
  const users: object = [
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
      const res: boolean = await instances.IdentityRegistry.isHuman.call(users[0].address);
      assert.isFalse(res);
    });

    it('add ID to registry', async () => {
      // Add an ID to the Registry
      const res: object = await instances.IdentityRegistry.add(users[0].address, users[0].metadata, {from: owner});
      assert.ok(res);

      // Check if added
      const metadata: string = await instances.IdentityRegistry.registry.call(users[0].address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, users[0].metadata, 'metadata returned not expected');
    });

    it('user attempts to remove self', async () => {
      // User calls removeSelf()
      const res: object = await instances.IdentityRegistry.removeSelf({from: users[0].address});
      assert.ok(res);

      // Ensure removed
      const metadata: string | null = await instances.IdentityRegistry.registry.call(users[0].address);
      assert.equal(metadata, null);
    });
  });

  describe('isHuman', async () => {
    before(async () => {
      instances.IdentityRegistry = await contracts.IdentityRegistry.new({from: owner});
    });

    it('user is not human before registration', async () => {
      const res: boolean = await instances.IdentityRegistry.isHuman.call(users[0].address);
      assert.isFalse(res);
    });

    it('add ID to registry', async () => {
      // Add an ID to the Registry
      const res: object = await instances.IdentityRegistry.add(users[0].address, users[0].metadata, {from: owner});
      assert.ok(res);

      // Check if added
      const metadata: string = await instances.IdentityRegistry.registry.call(users[0].address);
      assert.ok(metadata, 'error, metadata is: ' + metadata);
      assert.equal(metadata, users[0].metadata, 'metadata returned not expected');
    });

    it('isHuman passing post-registry', async () => {
      const res: boolean = await instances.IdentityRegistry.isHuman.call(users[0].address);
      assert.isTrue(res);
    });
  });
});


