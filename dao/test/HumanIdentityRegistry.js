/**

  Testing IdentityRegistry.sol

*/
'use strict';

const common = require('./common');
const solAssert = require('./solAssert');
const util = require('util');

let instances = {};

contract('Testing HumanIdentityRegistry', (accounts) => {

  const owner = accounts[0];
  const users = accounts.slice(1);

  it('Deploy HumanIdentityRegistry', async () => {
    instances.HumanIdentityRegistry = await common.HumanIdentityRegistry.new({ from: owner });
  })

  describe('Only owner can...', async () => {
    it('add', async () => {
      await solAssert.revert(
        async () => {
          await instances.HumanIdentityRegistry.add(users[0], '0x0', { from: users[0] });
        }
      , 'Ownable: caller is not the owner');
    })

    it('remove', async () => {
      await solAssert.revert(
        async () => {
          await instances.HumanIdentityRegistry.remove(users[0], { from: users[0] });
        }
      , 'Ownable: caller is not the owner');
    })

    it('update', async () => {
      await solAssert.revert(
        async () => {
          await instances.HumanIdentityRegistry.update(users[0], '0x0', { from: users[0] });
        }
      , 'Ownable: caller is not the owner');
    })
  })

})














