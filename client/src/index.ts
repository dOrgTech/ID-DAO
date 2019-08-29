import Web3 = require('web3');

import IdentityDAO = require('./dao/identity-dao');
import IdentityRegistry = require('./registry/identity-registry');

// @ts-ignore
import Config = require('./config/config');
import defaultConfig = require('./config/default-config')

class Module {
  web3: Web3;
  config: Config;

  //Classes we're exporting
  dao: object; //IdentityDAO;
  registry: object; //IdentityRegistry;

  constructor(web3: Web3, config: object = {}){
    this.web3 = web3;
    //TODO: This is a repeated assignment in the case of nothing passed; consider fixing
    this.config = Object.assign(defaultConfig, config);
 
    //Exporting classes
    this.dao = IdentityDAO;
    this.registry = IdentityRegistry;
  }

  createIdentityRegistry(web3: Web3=this.web3, config: Config=this.config){
    return new IdentityRegistry(web3, config);
  }

}

export = Module;

