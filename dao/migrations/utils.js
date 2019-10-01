const fs = require("fs");
const addressesPath = __dirname + "/addresses.json";

function contractDeployed(network, contract, address) {
  let json = fs.readFileSync(addressesPath).toString();

  if (json.length === 0) {
    json = "{}";
  }

  let addresses = JSON.parse(json);

  if (!addresses) {
    addresses = { };
  }

  if (!addresses[network]) {
    addresses[network] = { };
  }

  addresses[network][contract] = address;

  fs.writeFileSync( 
    addressesPath, JSON.stringify(addresses, null, 2)
  );
}

module.exports = {
  contractDeployed
};
