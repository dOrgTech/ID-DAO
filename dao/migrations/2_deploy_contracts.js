const IdentityRegistry = artifacts.require("IdentityRegistry");
const Utils = require("./utils");

module.exports = function(deployer, network) {

  deployer.deploy(IdentityRegistry)
    .then((registry) => {
      
      // TODO: uncomment me when DAO deployment is added
      /*if (dao) {
        return registry.setOwner(dao);
      }*/
    })
    .then(() => {
      Utils.contractDeployed(
        network, "IdentityRegistry", IdentityRegistry.address
      );
    });
};
