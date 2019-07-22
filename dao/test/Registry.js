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
       metadata: '0xB5689B817F4D6DC4D28676EA1A0AF6BDEAC27CEAF5381CFE'
    },
    {   
       address: accounts[2],
       metadata: '0x0589A7EDA839A6D2E0AF0D7A4AF3C3E69B2B2473B69DAF77'
    },
    { 
       address: accounts[3],
       metadata: '0x2964D850F3C1249264908CF530B787A5BD83229A57948233'
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
      assert.equal(metadata, users[0].metadata, 'metadata not expected, expecting: ' + users[0].metadata + '\nreturned: ' + metadata);

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














