import {
  getIPFS
} from "./utils/ipfsUtils";
import {
  getWeb3,
  getEnabledWeb3,
  getNetworkName,
} from "./utils/web3Utils";
import {
  sendTransaction,
  toIOperationObservable,
  Web3Receipt
} from "./utils/transactionUtils";
import {
  IdentityDefinition,
  deserialize
} from "./IdentityDefinition";
import {
  Address
} from "./IdentityDefinition/types";

const abi = require("@dorgtech/id-dao-contracts/build/contracts/IdentityRegistry.json");
const addresses = require("@dorgtech/id-dao-contracts/migrations/addresses.json");

let registry: any = undefined;

export const getRegistry = async (): Promise<any> => {
  if (!registry) {
    const web3 = await getEnabledWeb3();
    registry = new web3.eth.Contract(
      abi.abi, addresses[await getNetworkName()]["IdentityRegistry"]
    );
  }

  return registry;
}

export const isHuman = async (address: Address): Promise<boolean> => {
  await getRegistry();
  return await registry.methods.isHuman(address).call();
}

export const removeSelf = async (): Promise<boolean> => {
  await getRegistry();
  const map = (receipt: Web3Receipt) => {
    const event = receipt.events.Remove;

    if (!event) {
      throw new Error("Error Removing Self: No Remove event found.");
    }

    return true;
  };

  const observable = sendTransaction(registry.methods.removeSelf(), map);
  return (await toIOperationObservable(observable).send()).result;
}

export const getIdentity = async (opts: { address?: Address, hash?: string }): Promise<IdentityDefinition> => {
  if (opts.address === undefined && opts.hash === undefined) {
    throw Error("address or hash must be present in order to fetch the identity.");
  }

  const address = opts.address;
  let hash = opts.hash;

  if (address) {
    const web3 = getWeb3();
    const registry = await getRegistry();
    hash = web3.utils.hexToAscii(
      await registry.methods.registry(address).call()
    );
  }

  const ipfs = getIPFS();
  const resp = await ipfs.get(hash);

  if (resp.length === 0) {
    throw Error(`Error Getting Identity: IPFS index not found ${hash}`);
  }

  return deserialize(resp[0].content.toString());
}
