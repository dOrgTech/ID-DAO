import {
  IdentityDefinition,
  signAndUploadIdentity
} from "IdentityDefinition";
import { getEnabledWeb3, getNetworkName } from "utils/web3Utils";
import { genericActions } from "genericActions";

const daos = require("@dorgtech/id-dao-contracts/migrations/dao-addresses.json");

// TODO:
// await proposeAdd(address, hash, signature);
// await proposeRemove("0x2134124124124");
// await proposeUpdate(id: IdentityDefinition);
// await proposeUpdate(address, hash, signature);

export async function proposeAdd(address: string, hash: string, signature: string): Promise<string> {
  const web3 = await getEnabledWeb3();
  const network = await getNetworkName();
  const { avatar, genericScheme } = daos[network];
  const addAbi = genericActions.actions[0].abi;
  const callData = web3.eth.abi.encodeFunctionCall(addAbi, [
    address, web3.utils.asciiToHex(hash), signature
  ]);

  // TODO: encode ABI call
  // TODO: createProposal
  // TODO: return proposalID
  return "foo";
}
