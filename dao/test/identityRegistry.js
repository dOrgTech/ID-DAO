/**

  Testing IdentityRegistry.sol

*/
'use strict';

const common = require('./common');
const util = require('util');

let instances = {};

contract('Testing IdentityRegistry', (accounts) => {

  const owner = accounts[0];

  it('Sample test', () => {
    assert.ok(1==1);
  })

  it('Deploy IdentityRegistry', async () => {
    instances.IdentityRegistry = await common.IdentityRegistry.new({ from: owner });
  })


})
