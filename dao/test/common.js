/**
 
  General file to use across all test-cases, allows for modular use of artifacts.require()

*/

'use strict';

const HumanIdentityRegistry = artifacts.require('./HumanIdentityRegistry.sol');


module.exports = {
  'HumanIdentityRegistry': HumanIdentityRegistry
}
