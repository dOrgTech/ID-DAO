/**
 
  General file to use across all test-cases, allows for modular use of artifacts.require()

*/

'use strict';

const IdentityRegistry = artifacts.require('./IdentityRegistry.sol');


module.exports = {
  'IdentityRegistry': IdentityRegistry
}
