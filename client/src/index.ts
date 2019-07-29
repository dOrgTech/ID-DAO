import IdentityDAO = require('./dao/identity-DAO');
import IdentityRegistry = require(/'registry/identity-registry');

import Config = require('./config/config');
import defaultConfig = require('./config/default-config')

class Module {
  web3: web3;
  config: Config;

  constructor(web3: web3, config: Config=this.config){
    this.config = Object.assign(defaultConfig, config);
  }

  createIdentityRegistry(config: Config=this.config)

}

export = Module;

export.dao = IdentityDAO; 
export.registry = IdentityRegistry;
