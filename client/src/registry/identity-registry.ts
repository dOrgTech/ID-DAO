import Web3 = require('web3');
// @ts-ignore
import Config = require('../config/config');

class IdentityRegistry {

  web3: Web3;
  config: Config;
  // @ts-ignore
  contract: Contract;

  constructor(web3: Web3, config: any /*Config*/) {
    this.web3 = web3;
    this.config = config;
    this.contract = new web3.eth.Contract(config.IdentityRegistry.abi, config.IdentityRegistry.address);
  }

  //TODO: Add function to read Identities as well

  async add(id: string, metadata: string, sender: string=""): Promise<any> {
    //NOTE: Assumption is defaultAccount for now
    //return await this.contract.methods.add(id, metadata).send({ from: sender || this.web3.eth.defaultAccount });
    let meme = this.contract.methods.add(id, metadata);
    console.log('mmm');
    console.log(meme);
    let memeSend = meme.send({ from: sender || this.web3.eth.defaultAccount });
    console.log(`1, from: ${sender || this.web3.eth.defaultAccount}`);
    console.log(memeSend);
    let memeVov = await memeSend;
    console.log('2');
    console.log(memeSend);
    return memeVov;
  }

  async remove(id: string, sender: string=""): Promise<object> {
    return await this.contract.method.remove(id).send({ from: sender || this.web3.eth.defaultAccount });    
  }
  
  async update(id: string, metadata: string, sender: string=""): Promise<object> {
    return await this.contract.method.update(id, metadata).send({ from: sender || this.web3.eth.defaultAccount });
  }

  async removeSelf(sender: string=""): Promise<object> {
    return await this.contract.method.removeSelf().send({ from: sender || this.web3.eth.defaultAccount });

  }

  async isHuman(id: string): Promise<boolean> {
    return await this.contract.methods.isHuman(id).call();
  }
  

}

export = IdentityRegistry;
