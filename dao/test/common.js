/**
 
  General file to use across all test-cases, allows for modular use of artifacts.require()

*/

const IdentityRegistry = artifacts.require('./IdentityRegistry.sol');


module.exports = {
  'IdentityRegistry': IdentityRegistry
}
