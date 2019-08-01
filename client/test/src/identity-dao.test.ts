// TODO: Complete tests

import chai = require('chai');
const assert = chai.assert;

import fs = require('fs');
import path = require('path');
// @ts-ignore
import IDDAO = require('../../dist/index');
// @ts-ignore
import IdentityRegsitry = require('../../dist/registry/identity-registry');
import Web3 = require('web3');
// @ts-ignore
import HDWalletProvider = require('truffle-hdwallet-provider');
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../dao/config.json'), 'utf8'));
const provider = new HDWalletProvider(config.seed, 'http://localhost:8545', 0, 10);
const web3 = new Web3(provider);

describe('IDDAO', () => {

  let accounts: string[];
  let master: string;
  
  let idDAO: IDDAO;
 
  before(async () => {
    accounts = await web3.eth.getAccounts();
    master = accounts[0];
  })

  it('initialize IDDAO', async () => {
    idDAO = new IDDAO(web3);
  })

  describe('IdentityRegistry', async () => {

    let IdentityRegistry: any; //TODO: Type this correctly
    let IdentityRegistryWeb3: any;

    it('create IdentityRegistry instance (web3)', async () => {
      const idRegBuild: any = JSON.parse(fs.readFileSync(path.resolve('../dao/build/contracts/IdentityRegistry.json'), 'utf8'));

      const idRegCreateTx: any = (await web3.eth.getBlock(2)).transactions[0];
      const idRegReceipt: any = await web3.eth.getTransactionReceipt(idRegCreateTx);
 
      IdentityRegistryWeb3 = new web3.eth.Contract(idRegBuild.abi, idRegReceipt.contractAddress);
      const res = await IdentityRegistryWeb3.methods.isHuman(master).call();
      assert.ok(res === false);
    })

    it('instantiate IdentityRegistry', async () => {
      let config = {
        IdentityRegistry: {
          address: IdentityRegistryWeb3.options.address,
          abi: IdentityRegistryWeb3.options.jsonInterface
        }
      };

      idDAO = new IDDAO(web3, config);
      IdentityRegistry = idDAO.createIdentityRegistry();
    })

  })
  
  after(async () => {
    //Close connection
    provider.engine.stop();
  })

})
