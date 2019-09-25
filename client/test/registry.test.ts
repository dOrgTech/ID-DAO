import {
  setWeb3Provider,
  getRegistry,
  isHuman,
  removeSelf,
  deserialize,
  serialize,
  IdentityDefinition,
  getIdentity,
  signAndUploadIdentity
} from "../dist";
import {
  getAccount,
  getWeb3
} from "../dist/utils/web3Utils";
import { expect } from "chai";

const json = JSON.stringify(require("./valid-identity.json"));

setWeb3Provider("http://127.0.0.1:8545");

describe("Registry", async () => {
  let web3: any;
  let address: string;
  let registry: any;
  let identity: IdentityDefinition;

  before(async () => {
    web3 = await getWeb3();
    address = await getAccount();
    registry = await getRegistry();
    identity = deserialize(json);

    // switch the identity's address to the test account's
    identity.address = address;
  });

  it("Adds Identity", async () => {
    // Upload identity to IPFS and get the signature
    const { hash, sig } = await signAndUploadIdentity(identity);

    // Add the identity to the registry
    const tx = await registry.methods.add(
      address,
      web3.utils.asciiToHex(hash),
      sig
    ).send({ gas: 1000000, from: address });

    const addEvent = tx.events.Add;
    expect(addEvent).to.not.be.undefined;
    expect(addEvent.returnValues._sig).to.be.equal(sig);
  });

  it("isHuman", async () => {
    expect(await isHuman(address)).to.be.true;
  });

  it("getIdentity", async () => {
    const fetched = await getIdentity(address);
    expect(fetched).to.eql(identity);
  });

  it("removeSelf", async () => {
    expect(await removeSelf()).to.be.true;
    expect(await isHuman(address)).to.be.false;
  });
});
