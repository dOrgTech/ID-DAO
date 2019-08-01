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
  let master: string;
  
  before(async () => {
    accounts = await web3.eth.getAccounts();
    master = accounts[0];
  })

  it('test thing', async () => {
/*    const idRegBuild: any = JSON.parse(fs.readFileSync(path.resolve('../dao/build/contracts/IdentityRegistry.json'), 'utf8'));

    //How to get address...? Hmmm... we know that our first account (master) will have deployed it, so web3 to look for the thing
    //Check out: https://web3js.readthedocs.io/en/v1.2.0/web3-eth.html#getpastlogs
    const idRegLog: any = await web3.eth.getTransactionFromBlock(2, 0);
    console.log(idRegLog);
 
    const IdentityRegistry: any = new web3.eth.Contract(idRegBuild.abi, '0x39aeEe8C35e3BDF394D01e7a9Dab7406C385C61D');
    console.log(await IdentityRegistry.methods.removeSelf().send({ from: master }));
    assert.ok(1==1);*/
  })
  
  after(() => {
    //Close connection
    provider.engine.stop();
  })

})
