import {
  getEnabledWeb3,
  getNetworkName
} from "./web3Utils";
import {
  sendTransaction,
  toIOperationObservable,
  Web3Receipt
} from "./transactionUtils";

const abi = require("@dorgtech/id-dao-contracts/build/contracts/IdentityRegistry.json");
const addresses = require("@dorgtech/id-dao-contracts/migrations/registries.json");

let registry: any = undefined;

export const getRegistry = async (): Promise<any> => {
  if (!registry) {
    const web3 = await getEnabledWeb3();
    registry = new web3.eth.Contract(
      abi, addresses[await getNetworkName()]
    );
  }

  return registry;
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
  return await toIOperationObservable(observable).send();
}

// TODO:
// isHuman(Address)
// signIdentity(IdentityDefinition)
// getHuman(Address): IdentityDefinition
// getHumans(): Observable<IdentityDefinition[]>
