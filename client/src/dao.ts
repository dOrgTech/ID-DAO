const multihashing = require("multihashing-async");
const CIDTool = require("cid-tool");
import { getRegistry } from "./registry";
import {
  IdentityDefinition,
  signAndUploadIdentity
} from "./IdentityDefinition";
import { getEnabledWeb3, getNetworkName } from "./utils/web3Utils";
// import { getIPFS } from "./utils/ipfsUtils";
import {
  sendTransaction,
  toIOperationObservable,
  Web3Receipt
} from "./utils/transactionUtils";

const abi = require("@daostack/arc/build/contracts/UGenericScheme.json");
const addresses = require("@dorgtech/id-dao-contracts/migrations/addresses.json");

let genericScheme: any = undefined;

export interface ProposalMetadata {
  title?: string;
  description?: string;
  url?: string;
}

export const getGenericScheme = async (): Promise<any> => {
  if (!genericScheme) {
    const web3 = await getEnabledWeb3();
    genericScheme = new web3.eth.Contract(
      abi.abi,
      addresses[await getNetworkName()]["UGenericScheme"]
    );
  }

  return genericScheme;
};

export async function proposeAdd(
  address: string,
  hash: string,
  signature: string,
  metadata: ProposalMetadata
): Promise<string> {
  await getGenericScheme();
  const registry = await getRegistry();
  const web3 = await getEnabledWeb3();
  // const ipfs = await getIPFS();

  const callData = await registry.methods
    .add(address, web3.utils.asciiToHex(hash), signature)
    .encodeABI();
  const metadataHash = CIDTool.format(
    await multihashing(Buffer.from(JSON.stringify(metadata)), "sha2-256")
  );
  // const metadataHash = await ipfs.add(
  //   Buffer.from(JSON.stringify(metadata))
  // );

  const tx = genericScheme.methods.proposeCall(
    addresses[await getNetworkName()]["Avatar"],
    callData,
    "0",
    web3.utils.asciiToHex(metadataHash[0].path)
  );

  const map = (receipt: Web3Receipt) => {
    const event = receipt.events.NewCallProposal;

    if (!event) {
      throw new Error(
        "Error Proposing Add Identity: No NewCallProposal event found."
      );
    }

    return event.returnValues._proposalId;
  };

  const observable = sendTransaction(tx, map);
  return (await toIOperationObservable(observable).send()).result;
}

export async function proposeAddIdentity(
  id: IdentityDefinition,
  metadata: ProposalMetadata
): Promise<string> {
  const address = id.address;
  const { hash, sig } = await signAndUploadIdentity(id);
  return proposeAdd(address, hash, sig, metadata);
}

export async function proposeUpdate(
  address: string,
  hash: string,
  signature: string,
  metadata: ProposalMetadata
): Promise<string> {
  await getGenericScheme();
  const registry = await getRegistry();
  const web3 = await getEnabledWeb3();
  // const ipfs = await getIPFS();

  const callData = await registry.methods
    .update(address, web3.utils.asciiToHex(hash), signature)
    .encodeABI();

  // const metadataHash = await ipfs.add(
  //   Buffer.from(JSON.stringify(metadata))
  // );
  const metadataHash = CIDTool.format(
    await multihashing(Buffer.from(JSON.stringify(metadata)), "sha2-256")
  );

  const tx = genericScheme.methods.proposeCall(
    addresses[await getNetworkName()]["Avatar"],
    callData,
    "0",
    web3.utils.asciiToHex(metadataHash[0].path)
  );

  const map = (receipt: Web3Receipt) => {
    const event = receipt.events.NewCallProposal;

    if (!event) {
      throw new Error(
        "Error Proposing Update Identity: No NewCallProposal event found."
      );
    }

    return event.returnValues._proposalId;
  };

  const observable = sendTransaction(tx, map);
  return (await toIOperationObservable(observable).send()).result;
}

export async function proposeUpdateIdentity(
  id: IdentityDefinition,
  metadata: ProposalMetadata
): Promise<string> {
  const address = id.address;
  const { hash, sig } = await signAndUploadIdentity(id);
  return proposeUpdate(address, hash, sig, metadata);
}

export async function proposeRemove(
  address: string,
  metadata: ProposalMetadata
): Promise<string> {
  await getGenericScheme();
  const registry = await getRegistry();
  const web3 = await getEnabledWeb3();
  // const ipfs = await getIPFS();

  const callData = await registry.methods.remove(address).encodeABI();

  // const metadataHash = await ipfs.add(
  //   Buffer.from(JSON.stringify(metadata))
  // );
  const metadataHash = CIDTool.format(
    await multihashing(Buffer.from(JSON.stringify(metadata)), "sha2-256")
  );

  const tx = genericScheme.methods.proposeCall(
    addresses[await getNetworkName()]["Avatar"],
    callData,
    "0",
    web3.utils.asciiToHex(metadataHash[0].path)
  );

  const map = (receipt: Web3Receipt) => {
    const event = receipt.events.NewCallProposal;

    if (!event) {
      throw new Error(
        "Error Proposing Remove Identity: No NewCallProposal event found."
      );
    }

    return event.returnValues._proposalId;
  };

  const observable = sendTransaction(tx, map);
  return (await toIOperationObservable(observable).send()).result;
}
