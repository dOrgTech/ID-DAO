const IPFSClient = require("ipfs-http-client");

let ipfs: any;
let endpoint: string;

export const setIpfsEndpoint = (ipfsHttpEndpoint: string) => {
  endpoint = ipfsHttpEndpoint;
}

export const getIPFS = (): any => {
  if (!ipfs) {
    if (!endpoint) {
      endpoint = "127.0.0.1";
    }

    ipfs = IPFSClient(endpoint);
  }

  return ipfs;
}
