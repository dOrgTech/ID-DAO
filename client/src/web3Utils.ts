import { promisify } from "util";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import {
  Address
} from "./IdentityDefinition/types";

const Web3 = require("web3");

let web3: any;
let provider: string;
let enabled = false;

export const setWeb3Provider = (web3Provider: string) => {
  provider = web3Provider;
}

export const getWeb3 = (): any => {
  if (!web3) {
    if (provider) {
      web3 = new Web3(provider); 
    } else {
      web3 = (window as any).web3;

      if (!web3) {
        web3 = new Web3((window as any).ethereum);
      }

      if (!web3) {
        throw Error("ID-DAO: No Web3 Provider Found");
      }
    }
  }

  return web3;
}

export const getEnabledWeb3 = async (): Promise<any> => {
  const web3 = getWeb3();

  if (!web3) {
    throw Error("Identity DAO: Missing Web3 Provider.");
  }

  if (!enabled) {
    const provider = web3.currentProvider;
    if (typeof provider.enable === "function") {
      await provider.enable();
    }

    enabled = true;
  }

  return web3;
}

export const getNetworkName = async (): Promise<string> => {
  if (!web3) {
    await getEnabledWeb3();
  }

  const getNetworkId = async (): Promise<string> => {
    return (await (web3.eth.net ? web3.eth.net.getId() : promisify(web3.version.getNetwork)())).toString();
  };

  const id = await getNetworkId();

  switch (id) {
    case "1":
      return "mainnet";
    case "3":
      return "ropsten";
    case "42":
      return "kovan";
    case "4":
      return "rinkeby";
    case "5":
      return "goerli";
    default:
      return "development";
  }
}

export const getAccount = (): Promise<Address> => {
  // this complex logic is to get the correct account both from the Web3 as well as from the Metamaask provider
  // This polls for changes. But polling is Evil!
  // cf. https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
  return Observable.create(async (observer: any) => {
    const interval = 1000 /// poll once a second
    let account: any
    let prevAccount: any
    const web3 = await getEnabledWeb3()
    if (web3.eth.accounts[0]) {
      observer.next(web3.eth.accounts[0].address)
      prevAccount = web3.eth.accounts[0].address
    } else if (web3.eth.defaultAccount ) {
      observer.next(web3.eth.defaultAccount)
      prevAccount = web3.eth.defaultAccount
    }
    const timeout = setInterval(() => {
      web3.eth.getAccounts().then((accounts: any) => {
        if (accounts) {
          account = accounts[0]
        } else if (web3.eth.accounts) {
          account = web3.eth.accounts[0].address
        }
        if (prevAccount !== account && account) {
          web3.eth.defaultAccount = account
          observer.next(account)
          prevAccount = account
        }
      })
    }, interval)
    return() => clearTimeout(timeout)
  }).pipe(first()).toPromise();
}

const fixSignature = (signature: string): string => {
  // in geth its always 27/28, in ganache its 0/1. Change to 27/28 to prevent
  // signature malleability if version is 0/1
  // see https://github.com/ethereum/go-ethereum/blob/v1.8.23/internal/ethapi/api.go#L465
  let v = parseInt(signature.slice(130, 132), 16);
  if (v < 27) {
    v += 27;
  }
  const vHex = v.toString(16);
  return signature.slice(0, 130) + vHex;
}

export const signPayload = async (address: Address, payload: string): Promise<string> => {
  if (!web3) {
    await getEnabledWeb3();
  }

  return fixSignature(await web3.eth.sign(
    web3.utils.keccak256(payload),
    address
  ));
}
