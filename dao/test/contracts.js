/**
 
  General file to use across all test-cases, allows for modular use of artifacts.require()

*/

'use strict';

const Registry = artifacts.require('./Registry.sol');
const IdentityRegistry = artifacts.require('./IdentityRegistry.sol');

module.exports = {
  'Registry': Registry,
  'IdentityRegistry': IdentityRegistry
}
