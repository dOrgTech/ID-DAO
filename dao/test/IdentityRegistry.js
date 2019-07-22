/**

  Testing IdentityRegistry.sol

*/
'use strict';

const contracts = require('./contracts');
const solAssert = require('./solAssert');
const util = require('util');

let instances = {};

contract('Testing IdentityRegistry', (accounts) => {

  const owner = accounts[0];
  const users = accounts.slice(1);

  it('Deploy IdentityRegistry', async () => {
    instances.IdentityRegistry = await contracts.IdentityRegistry.new({ from: owner });
  })

  describe('Only owner can...', async () => {
    it('add', async () => {
      await solAssert.revert(
        async () => {
          await instances.IdentityRegistry.add(users[0], '0x0', { from: users[0] });
        }
      , 'Ownable: caller is not the owner');
    })

    it('remove', async () => {
      await solAssert.revert(
        async () => {
          await instances.IdentityRegistry.remove(users[0], { from: users[0] });
        }
      , 'Ownable: caller is not the owner');
    })

    it('update', async () => {
      await solAssert.revert(
        async () => {
          await instances.IdentityRegistry.update(users[0], '0x0', { from: users[0] });
        }
      , 'Ownable: caller is not the owner');
    })
  })

})














