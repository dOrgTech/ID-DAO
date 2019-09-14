import Web3 from "web3";
import { Address } from "./IdentityDefinition/types";

let web3: Web3 = undefined;
let provider: string | undefined = undefined;

export const setProvider = (web3Provider: string) => {
  provider = web3Provider;
}

export const getWeb3 = (): Web3 => {
  if (!web3) {
    if (provider) {
      web3 = new Web3(provider);
    } else {
      web3 = (window as any).web3;

      if (!web3) {
        web3 = new Web3((window as any).ethereum);
      }

      if (!web3) {
        return;
      }
    }
  }

  return web3;
}

export const getEnabledWeb3 = async (): Promise<Web3> => {
  const web3 = getWeb3();

  if (!web3) {
    throw Error("Identity DAO: Missing Web3 Provider.");
  }

  await web3.currentProvider.enable();
  return web3;
}
