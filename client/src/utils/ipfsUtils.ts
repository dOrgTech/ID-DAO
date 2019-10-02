const IPFSClient = require("ipfs-http-client");

let ipfs: any;
let endpoint: string;
let port: string | undefined;

export const setIpfsEndpoint = (ipfsHttpHost: string, ipfsPort?: string) => {
  endpoint = ipfsHttpHost.replace("http://", "");
  port = ipfsPort;
}

export const getIPFS = (): any => {
  if (!ipfs) {
    if (!endpoint) {
      endpoint = "127.0.0.1";
    }

    ipfs = IPFSClient(endpoint, port);
  }

  return ipfs;
}
