require("dotenv").config();
import {
  setWeb3Provider,
  setIpfsEndpoint,
  deserialize,
  IdentityDefinition,
  proposeAddIdentity,
  proposeUpdateIdentity,
  proposeRemove
} from "../dist";
import {
  getAccount,
  getWeb3
} from "../dist/utils/web3Utils";
import { expect } from "chai";

const json = JSON.stringify(require("./valid-identity.json"));

setWeb3Provider(`http://127.0.0.1:${process.env.ID_DAO_WEB3_PORT}`);
setIpfsEndpoint("http://127.0.0.1", process.env.ID_DAO_IPFS_PORT);

describe("DAO", async () => {
  let address: string;
  let identity: IdentityDefinition;

  before(async () => {
    address = await getAccount();
    identity = deserialize(json);

    // switch the identity's address to the test account's
    identity.address = address;
  });

  it("Propose Add Identity", async () => {
    expect(await proposeAddIdentity(identity, {})).to.not.be.null;
  });

  it("Propose Update Identity", async () => {
    expect(await proposeUpdateIdentity(identity, {})).to.not.be.null;
  });

  it("Propose Remove Identity", async () => {
    expect(await proposeRemove(identity.address, {})).to.not.be.null;
  });
});
