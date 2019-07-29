import IdentityDAO = require('./dao/identity-dao');
import IdentityRegistry = require(/'./registry/identity-registry');

import Config = require('./config/config');
import defaultConfig = require('./config/default-config')

class Module {
  web3: web3;
  config: Config;

  constructor(web3: web3, config: Config=this.config){
    this.web3 = web3;
    //TODO: This is a repeated assignment in the case of nothing passed; consider fixing
    this.config = Object.assign(defaultConfig, config);
  }

  createIdentityRegistry(web3: web3=this.web3, config: Config=this.config){
    return new IdentityRegistry(web3, config);
  }

}

export = Module;

export.dao = IdentityDAO; 
export.registry = IdentityRegistry;
