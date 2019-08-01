// TODO: Complete tests

import chai = require('chai');
const assert = chai.assert;

import fs = require('fs');
import path = require('path');

import Web3 = require('web3');
// @ts-ignore
import HDWalletProvider = require('truffle-hdwallet-provider');
const config = JSON.parse(fs.readFileSync(path.resolve('../dao/config.json'), 'utf8'));

const provider = new HDWalletProvider(config.seed, 'http://localhost:8545', 0, 10);
const web3 = new Web3(provider);


describe('IdentityDAO', () => {

  it('test thing', async () => {
    const idRegBuild = JSON.parse(fs.readFileSync(path.resolve('../dao/build/contracts/IdentityRegistry.json'), 'utf8'));
    //const IdentityRegistry = new web3.eth.Contract(idRegBuild.abi, address);
    assert.ok(1==1);
  })

})
