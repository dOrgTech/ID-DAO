/**

  General file to use across all test-cases, allows for modular use of artifacts.require()

*/

const Registry = artifacts.require('./Registry.sol');
const IdentityRegistry = artifacts.require('./IdentityRegistry.sol');

export = {
  'Registry': Registry,
  'IdentityRegistry': IdentityRegistry,
};
