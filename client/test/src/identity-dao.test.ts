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

  let accounts: string[];
  
  before(async () => {
    accounts = await web3.eth.getAccounts();
  })

  it('test thing', async () => {
    const idRegBuild = JSON.parse(fs.readFileSync(path.resolve('../dao/build/contracts/IdentityRegistry.json'), 'utf8'));

    //How to get address...? Hmmm... we know that our first account (master) will have deployed it, so web3 to look for the thing
    //Check out: https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#getpastlogs
    const idRegLog = await web3.eth.getTransactionFromBlock(3, 0);
    console.log(idRegLog);

    const IdentityRegistry = new web3.eth.Contract(idRegBuild.abi, idRegLog.to);
    console.log(await IdentityRegistry.methods.isHuman(accounts[0]).call());
    assert.ok(1==1);
  })

})
