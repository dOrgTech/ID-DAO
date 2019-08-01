const IdentityRegistry = artifacts.require("IdentityRegistry");

const Migrations = artifacts.require("Migrations");

module.exports = function(deployer, network, accounts) {

  const master = accounts[0];

  //First, deploy Migrations contract
  deployer.deploy(Migrations);

  //Deploy IdentityRegistry contract
  deployer.deploy(IdentityRegistry, master);

};
