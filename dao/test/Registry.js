/**

  Testing Registry.sol

*/
'use strict';

const contracts = require('./contracts');
const solAssert = require('./solAssert');
const util = require('util');

let instances = {};

contract('Testing Registry', (accounts) => {

  const deployer = accounts[0];

  const users = [
    {
       address: accounts[1],
       metadata: '0xb5689b817f4d6dc4d28676ea1a0af6bdeac27ceaf5381cfe'
    },
    {   
       address: accounts[2],
       metadata: '0x0589a7eda839a6d2e0af0d7a4af3c3e69b2b2473b69daf77'
    },
    { 
       address: accounts[3],
       metadata: '0x2964d850f3c1249264908cf530b787a5bd83229a57948233'
    }
  ];


  it('Deploy Registry', async () => {
    instances.Registry = await contracts.Registry.new({ from: deployer });
  })

  describe('Functions', async () => {

    it('add', async () => {
      //Add an ID to the Registry
      let res = await instances.Registry.add(users[0].address, users[0].metadata, { from: users[0].address })
      assert.ok(res);

      //Check if existing
      let metadata = await instances.Registry.registry.call(users[0].address);
      assert.ok(metadata, 'no bytes attached to identity');
      assert.equal(metadata, users[0].metadata, 'metadata returned not expected');

    })
/*
    it('remove', async () => {
      await solAssert.revert(
        async () => {
          await instances.Registry.remove(users[0], { from: users[0] });
        }
      , 'Ownable: caller is not the owner');
    })

    it('update', async () => {
      await solAssert.revert(
        async () => {
          await instances.IdentityRegistry.update(users[0], '0x0', { from: users[0] });
        }
      , 'Ownable: caller is not the owner');
    })*/
  })

})














