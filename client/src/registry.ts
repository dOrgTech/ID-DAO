import { Observable } from "rxjs";
import {
  getEnabledWeb3,
  getNetworkName,
  signPayload
} from "./web3Utils";
import {
  sendTransaction,
  toIOperationObservable,
  Web3Receipt
} from "./transactionUtils";
import {
  IdentityDefinition,
  serialize
} from "./IdentityDefinition";
import {
  Address
} from "./IdentityDefinition/types";

const abi = require("@dorgtech/id-dao-contracts/build/contracts/IdentityRegistry.json");
const addresses = require("@dorgtech/id-dao-contracts/migrations/registries.json");

let registry: any = undefined;

export const getRegistry = async (): Promise<any> => {
  if (!registry) {
    const web3 = await getEnabledWeb3();
    registry = new web3.eth.Contract(
      abi.abi, addresses[await getNetworkName()]
    );
  }

  return registry;
}

export const isHuman = async (address: Address): Promise<boolean> => {
  await getRegistry();
  return await registry.methods.isHuman(address).call();
}

export const removeSelf = async (): Promise<boolean | Error> => {
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

/*export const getIdentity = async (address: Address): Promise<IdentityDefinition> => {
  // TODO:
  // - get hash from registry
  // - get payload from IPFS
  // - get deserialize payload
}

export const getIdentities = (): Observable<IdentityDefinition[]> => {
  // TODO:
  // pull events, then call verifySignature & getIdentity for each
}
*/
