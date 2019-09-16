import {
  setWeb3Provider,
  getRegistry,
  isHuman,
  removeSelf,
  deserialize,
  serialize,
  IdentityDefinition,
  getIdentity
} from "../dist";
import {
  getAccount,
  getWeb3,
  signPayload
} from "../dist/utils/web3Utils";
import {
  getIPFS
} from "../dist/utils/ipfsUtils";
import { expect } from "chai";

const json = JSON.stringify(require("./valid-identity.json"));

setWeb3Provider("http://127.0.0.1:8545");

describe("Registry", async () => {
  let web3: any;
  let ipfs: any;
  let address: string;
  let registry: any;
  let identity: IdentityDefinition;
  
  before(async () => {
    web3 = await getWeb3();
    ipfs = getIPFS();
    address = await getAccount();
    registry = await getRegistry();
    identity = deserialize(json);

    // switch the identity's address to the test account's
    identity.address = address;
  });

  it("Adds Identity", async () => {
    // Upload identity to IPFS
    const ipfsRes = await ipfs.add(Buffer.from(serialize(identity)));
    const hash = ipfsRes[0].path;

    // Sign IPFS hash
    const signature = await signPayload(address, hash);

    // Add the identity to the registry
    const tx = await registry.methods.add(
      address,
      web3.utils.asciiToHex(hash),
      signature
    ).send({ gas: 1000000, from: address });

    const addEvent = tx.events.Add;
    expect(addEvent).to.not.be.undefined;
    expect(addEvent.returnValues._sig).to.be.equal(signature);
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
