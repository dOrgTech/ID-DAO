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

//Initialize web3
const web3 = new Web3(provider);


describe('IDDAO', () => {

  let accounts: string[];
  let master: string;
  let users: any[];
  
  let idDAO: IDDAO;
 
  before(async () => {
    accounts = await web3.eth.getAccounts();
    master = accounts[0];
    users = [
      {
        address: accounts[1],
        metadata: '0xb5689b817f4d6dc4d28676ea1a0af6bdeac27ceaf5381cfe'
      },
      {
        address: accounts[2],
        metadata: '0x0589a7eda839a6d2e0af0d7a4af3c3e69b2b2473b69daf77'
      },
      {
        address: accounts[3],
        metadata: '0x2964d850f3c1249264908cf530b787a5bd83229a57948233'
      }
    ];


    //Set defaultAccount
    web3.eth.defaultAccount = master;
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
   
    it('add', async () => {
      //Ensure user is not human (i.e. not added yet)
      let isUnregistered = await IdentityRegistry.isHuman(users[0].address);
      let isUnregisteredWeb3 = await IdentityRegistryWeb3.methods.isHuman(users[0].address).send({ from: master });
      assert.isNotTrue(isUnregistered && isUnregisteredWeb3);

      //Add
      let add = await (await IdentityRegistry.add(users[0].address, users[0].metadata));
      assert.ok(add);
  
      //Ensure existing
      //let isHuman = await IdentityRegistry.isHuman(users[0].address);
      //let isHumanWeb3 = await IdentityRegistryWeb3.methods.isHuman(users[0].address).send({ from: master });
      //assert.isTrue(isHuman && isHumanWeb3);

    })

    it('remove', async () => {


    })

    it('update', async () => {


    })

    it('removeSelf', async () => {


    })

    it('isHuman', async () => {


    })



  })
  
  after(async () => {
    //Close connection
    provider.engine.stop();
  })

})
