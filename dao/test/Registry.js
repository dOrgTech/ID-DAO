/**

  Testing Registry.sol

*/
'use strict';

const contracts = require('./contracts');
const solAssert = require('./solAssert');
const util = require('util');

let instances = {};

contract('Testing Registry', (accounts) => {

  it('Deploy Registry', async () => {
    instances.Registry = await contracts.Registry.new({ from: accounts[0] });
  })
/*
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
*/
})














