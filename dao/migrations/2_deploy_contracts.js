const IdentityRegistry = artifacts.require("IdentityRegistry");
const Utils = require("./utils");

module.exports = function(deployer, network) {

  deployer.deploy(IdentityRegistry)
    .then((registry) => {
      const dao = Utils.daoAddress(network);
      if (dao) {
        return registry.setOwner(dao);
      }
    })
    .then(() => {
      Utils.registryDeployed(
        network, IdentityRegistry.address
      );
    });
};
