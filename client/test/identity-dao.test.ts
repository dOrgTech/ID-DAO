// TODO: Complete tests

import chai from 'chai';
import fs from 'fs';
import path from 'path';
import IDDAO from '../src';
import Web3 from 'web3';
import * as config from '../../dao/config.json';

const HDWalletProvider = require('truffle-hdwallet-provider');
const assert = chai.assert;
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

    beforeEach(async () => {
      //Read info on IdentityRegistry build, including ABI
      const build: any = JSON.parse(fs.readFileSync(path.resolve('../dao/build/contracts/IdentityRegistry.json'), 'utf8'));

      //TODO: Switch this to different, less hacky solution (export address on migration, or...)
      const createTx: any = (await web3.eth.getBlock(2)).transactions[0];
      const receipt: any = await web3.eth.getTransactionReceipt(createTx);

      //Create a config object with this info
      let config: any = {
        IdentityRegistry: {
          address: receipt.contractAddress,
          abi: build.abi
        }
      };

      //Create web3 Contract instance (our "control" in our tests) 
      IdentityRegistryWeb3 = new web3.eth.Contract(build.abi, receipt.contractAddress);
      assert.ok(IdentityRegistryWeb3);

      //Finally, create our instance of IDDAO TODO: Switch to IdentityDAO
      idDAO = new IDDAO(web3, config);
      IdentityRegistry = idDAO.createIdentityRegistry();
    })

    it('add', async () => {
      //Ensure user is not human (i.e. not added yet)
      let isReg = await IdentityRegistryWeb3.methods.isHuman(users[0].address).call({from: master});
      assert.isNotTrue(isReg, `isReg: ${isReg}`);
      //Add
      let add = await IdentityRegistry.add(users[0].address, users[0].metadata);
      assert.ok(add);
      //Ensure existing
      assert.isTrue(await IdentityRegistryWeb3.methods.isHuman(users[0].address).call());
    })

    it.skip('remove', async () => {
      //Ensure user is not human (i.e. not added yet)
      let isReg = await IdentityRegistryWeb3.methods.isHuman(users[0].address).call();
      assert.isNotTrue(isReg, `isReg: ${isReg}`);

      //Add
      let add = await IdentityRegistryWeb3.methods.add(users[0].address, users[0].metadata).send({ from: master });
      assert.ok(add);
  
      //Ensure existing
      assert.isTrue(await IdentityRegistryWeb3.methods.isHuman(users[0].address).call());
      
      //Remove
      let remove = await IdentityRegistry.remove(users[0].address);
      assert.ok(remove);

      //Ensure removed
      assert.isFalse(await IdentityRegistryWeb3.methods.isHuman(users[0].address).call({ from: master }));
    })

    it.skip('update', async () => {
      //Ensure user is not human (i.e. not added yet)
      let isReg = await IdentityRegistryWeb3.methods.isHuman(users[0].address).call();
      assert.isNotTrue(isReg, `isReg: ${isReg}`);

      //Add
      let add = await IdentityRegistryWeb3.methods.add(users[0].address, users[0].metadata).send({ from: master });
      assert.ok(add);
  
      //Ensure existing
      assert.isTrue(await IdentityRegistryWeb3.methods.isHuman(users[0].address).call());

      //Update
      let update = await IdentityRegistry.update(users[0].address, users[1].metadata);
      assert.ok(update);

      //Ensure updated
      let currentMetadata = await IdentityRegistryWeb3.methods.registry(users[0].address).call();
      assert.equal(currentMetadata, users[1].metadata);
    })

    it.skip('removeSelf', async () => {
      //Ensure user is not human (i.e. not added yet)
      let isReg = await IdentityRegistryWeb3.methods.isHuman(users[0].address).call();
      assert.isNotTrue(isReg, `isReg: ${isReg}`);

      //Add
      let add = await IdentityRegistryWeb3.methods.add(users[0].address, users[0].metadata).send({ from: master });
      assert.ok(add);
  
      //Ensure existing
      assert.isTrue(await IdentityRegistryWeb3.methods.isHuman(users[0].address).call());

      //Remove
      let remove = await IdentityRegistry.removeSelf(users[0].address);
      assert.ok(remove);

      //Ensure removed
      assert.isFalse(await IdentityRegistryWeb3.methods.isHuman(users[0].address).call()); 
      //TODO: Add check testing for 0 metadata on call as well
    })

    it.skip('isHuman', async () => {
      //Ensure user is not human (i.e. not added yet), as expected by isHuman() call
      let isReg = await IdentityRegistry.isHuman(users[0].address);
      assert.isNotTrue(isReg, `isReg: ${isReg}`);

      //Add
      let add = await IdentityRegistryWeb3.methods.add(users[0].address, users[0].metadata).send({ from: master });
      assert.ok(add);
      IDDAO
      //Ensure isHuman now returns existing
      assert.isTrue(await IdentityRegistry.isHuman(users[0].address));
    })
  })

  after(async () => {
    //Close connection
    provider.engine.stop();
  })
})