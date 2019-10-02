require("dotenv").config();

const IdentityRegistry = artifacts.require("IdentityRegistry");
const HumanReputationClaim = artifacts.require("HumanReputationClaim");
const {contractDeployed} = require("../utils/DeployUtils");
const {signMessage} = require('../utils/SigningUtils');
const daoParams = require("./dao-template.json");
const migrateDAO = require("@daostack/migration/migrate-dao");
const migrationAddresses = require("@daostack/migration/migration.json");
const arcVersion = require("@daostack/migration/package.json").dependencies[
  "@daostack/arc"
];
const asciiToHex = web3.utils.asciiToHex;

module.exports = function(deployer, network, accounts) {

  console.log("Deploy the IdentityRegistry...");

  deployer.deploy(IdentityRegistry)
    // Save the address
    .then((registry) => {
      contractDeployed(
        network, "IdentityRegistry", registry.address
      );
      return registry;
    })
    .then(async (registry) => {
      console.log("Populate the registry with an initial set of identities...");

      // Used for testing
      if (process.env.ID_DAO_ADD_ACCOUNTS) {
        for (const account of accounts) {
          const metadata = 'QmNUXzJHtjSbqN59jH3TusBHry1FqeegJLYUtfnaY3AXFJ';
          const signature = await signMessage(web3, metadata, account);
          await registry.add(account, asciiToHex(metadata), signature);
          console.log(`Added ${account} to the IdentityRegistry`);
        }
      }

      // TODO: From the initial-set.json
      // 2. @dorgtech/id-dao-init/initial-set.json

      return registry;
    })
    .then(async (registry) => {
      console.log("Deploy the HumanReputationClaim UScheme...");

      const claimScheme = await deployer.deploy(
        HumanReputationClaim, registry.address
      );

      contractDeployed(
        network, "HumanReputationClaim", claimScheme.address
      );

      return { registry, claimScheme };
    })
    .then(async ({ registry, claimScheme}) => {
      console.log("Deploy the ID-DAO...");

      daoParams.UGenericScheme[0].targetContract = registry.address;
      daoParams.CustomSchemes[0].address = claimScheme.address;

      const logTx = async ({ transactionHash, gasUsed }, msg) => {
        const tx = await web3.eth.getTransaction(transactionHash);
    
        if (tx != null) {
          const gasPrice = tx.gasPrice;
          const txCost = web3.utils.fromWei(
            (gasUsed * gasPrice).toString(),
            "ether"
          );
          console.log(`${msg} | ${transactionHash} | ${txCost} ETH`);
        }
      };

      const block = await web3.eth.getBlock("latest");

      let networkName = network;

      if (networkName === "development") {
        networkName = "private";
      }

      web3.eth.defaultAccount = accounts[0];

      // TODO: option for deploying all of ARC

      const migration = await migrateDAO({
        migrationParams: daoParams,
        web3,
        spinner: {
          start: (msg) => console.log(msg),
          fail: (msg) => console.log(`Error: ${msg}`)
        },
        confirm: (msg) => true,
        logTx,
        opts: {
          from: web3.eth.defaultAccount,
          gas: block.gasLimit - 100000,
          gasLimit: undefined
        },
        previousMigration: { ...migrationAddresses[networkName] },
        customabislocation: `${__dirname}/../build/contracts/`
      });

      const {
        Avatar,
        DAOToken,
        Reputation,
        Controller
      } = migration.dao[arcVersion];

      console.log("DAO Successfully Deployed.");

      contractDeployed(network, "Avatar", Avatar);
      contractDeployed(network, "DAOToken", DAOToken);
      contractDeployed(network, "Reputation", Reputation);
      contractDeployed(network, "Controller", Controller);

      return {
        registry,
        claimScheme,
        Avatar
      };
    })
    // Give the DAO ownership of the IdentityRegistry
    .then(async ({ registry, claimScheme, Avatar }) => {
      await registry.transferOwnership(Avatar);
    });
};
