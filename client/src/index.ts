export * from "./IdentityDefinition";

export { setWeb3Provider } from "./utils/web3Utils";

export { setIdDaoProxy } from "./utils/validatorUtils";

export { setIpfsEndpoint } from "./utils/ipfsUtils";

export * from "./registry";
export * from "./dao";
export * from "./genericActions";

/*
// Optionally define what provider to use
setWeb3Provider("web3_provider");

// Fetch the web3 instance
// uses the set provider above, if set
// uses window context by default
let web3 = getWeb3();

// Same as above, but it enables web3 for you.
web3 = await getEnabledWeb3();

// Get the Registry contract instance
await getRegistry();

// Check if the address is human (in the registry)
await isHuman("0x2342342342342");

// Remove yourself from the registry
await removeSelf();

// Fetch the Identity from IPFS and return an IdentityDefinition instance
await getIdentity("0x2134124124124");

// generic actions to be used within Alchemy
genericActions;

const { hash, signature } = signAndUploadIdentity(id: IdentityDefinition);

TODO:
// TODO: document all functions
await proposeAdd(address, hash, signature);
await proposeRemove("0x2134124124124");
await proposeUpdate(address, hash, signature);

const humans = getIdentities();
humans.pipe(...);
*/
