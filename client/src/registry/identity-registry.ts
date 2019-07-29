import web3 = require('web3');
import Config = require('../config/Config');

class IdentityRegistry {

  web3: web3;
  config: Config;
  contract: Contract;

  constructor(web3: web3, config: Config){
    this.web3 = web3;
    this.config = config;
    this.contract = new web3.eth.Contract(config.IdentityRegistry.address);
  }

  

}
