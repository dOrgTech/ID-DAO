import Web3 from "web3";

let web3: Web3;
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
        throw Error("ID-DAO: No Web3 Provider Found");
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

  // @ts-ignore
  await web3.currentProvider.enable();
  return web3;
}

export const getNetworkName = async (): Promise<string> => {
  if (!web3) {
    await getEnabledWeb3();
  }

  return new Promise((resolve, reject) => {
    // @ts-ignore
    web3.version.getNetwork((err: Error, id: string) => {
      if (err) {
        reject(err);
        return;
      }

      switch (id) {
        case "1":
          resolve("mainnet");
          return;
        case "3":
          resolve("ropsten");
          return;
        case "42":
          resolve("kovan");
          return;
        case "4":
          resolve("rinkeby");
          return;
        case "5":
          resolve("goerli");
          return;
        default:
          resolve("development");
      }
    });
  });
}
