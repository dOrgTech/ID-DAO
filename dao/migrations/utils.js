const fs = require("fs");
const daos = require("./dao-addresses.json");
const registries = __dirname + "/registries.json";

function registryDeployed(network, address) {
  const migrations = JSON.parse(
    fs.readFileSync(registries)
  );

  migrations[network] = address;

  fs.writeFileSync( 
    registries, JSON.stringify(migrations, null, 2)
  );
}

function daoAddress(network) {
  return daos[network] ? daos[network] : undefined;
}

module.exports = {
  registryDeployed,
  daoAddress
};
