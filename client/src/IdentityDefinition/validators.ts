// TODO: validTwitterSIVP, validGitHubSIVP, validFacebookSIVP,
//       atleastOneUpload, atleastOnePost

import { Validator } from "formstate";
import * as Web3Utils from "web3-utils";
import * as Multihashes from "multihashes";
import https from "https";
import { IncomingMessage } from "http";
import {
  Address,
  ContentHost
} from "./types";

type StringOrNull = string | null | undefined;

const isAddress = (address: Address): boolean => {
  const addr = address.toLowerCase();
  return addr[0] === "0" && addr[1] === "x" && Web3Utils.isAddress(addr);
};

export const requiredText: Validator<StringOrNull> = value => {
  const error = "This is required.";

  if (value == null || value.trim().length === 0) {
    return error;
  }

  return null;
}

export const validAddress: Validator<string> = value => {
  const error = "Please enter a valid address.";
  value = value.trim();

  if (isAddress(value)) {
    return error;
  }

  return null;
}

export const validUrl: Validator<string> = value => {
  const error = "Please enter a valid URL.";
  value = value.trim();

  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    if (!pattern.test(value)) {
    return error;
  }

  return null;
}

export const validHash: Validator<string> = value => {
  const error = "Invalid hash.";
  value = value.trim();

  try {
    Multihashes.validate(value);
    return null;
  } catch (e) {
    return error;
  }
}

export const validContentHost: Validator<string> = value => {
  const error = "Invalid content host.";

  if (!(value in ContentHost) || value === ContentHost.Unknown) {
    return error;
  }

  return null;
}

export const validTwitterSIVP = async (value: string, getAddress: ()=>string) => {
  // Example Twitter SIVP
  // https://twitter.com/user_name/status/1171073473527250944

  // The API to fetch the body of a tweet
  const api = "https://api.twitter.com/1.1/statuses/show.json?tweet_mode=extended&id=";

  // Errors
  const invalidStatusError = "Invalid Tweet URL, please use the 'twitter.com/user/status/#' format.";
  const missingAddrError = "Tweet is missing the public address.";

  // Extract the status ID from the URL we're being given
  const terminator = "status/";
  let index = value.indexOf(terminator);

  if (index === -1) {
    return invalidStatusError;
  }

  // Adjust the index
  index += terminator.length;

  // get the status ID
  const status = value.substr(index);

  return await new Promise<StringOrNull>(resolve => {
    https.get(api + status, (resp: IncomingMessage) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        const post = JSON.parse(data).full_text;

        // Check for the presence of the address
        if (post.indexOf(getAddress()) === -1) {
          resolve(missingAddrError);
          return;
        }

        resolve(null);
      });

    }).on("error", (err) => {
      resolve(invalidStatusError);
    });
  });
}

export const validGitHubSIVP = async (value: string, getAddress: ()=>string) => {
  // Example GitHub Gist
  // https://gist.github.com/user_name/883534236ed2f0e0ffc700b96bd092cd

  // API for fetching the gist
  const api = "https://api.github.com/gists/";

  // Errors
  const invalidGistError = "Invalid Gist URL, please use the 'gist.github.com/user/#' format.";
  const missingAddrError = "Gist is missing the public address.";

  // remove trailing '/'s
  if (value[value.length - 1] === '/') {
    value = value.substring(0, value.length - 1);
  }

  // Extract the gist ID from the URL we're being given
  const gist = value.substr(value.lastIndexOf("/") + 1);

  const fetchText = async (rawUrl: string) => {
    return await new Promise<string>(resolve => {
      https.get(rawUrl, (resp: IncomingMessage) => {
        let data = "";
  
        resp.on("data", (chunk) => {
          data += chunk;
        });
  
        resp.on("end", async () => {
          resolve(data);
        });
      }).on("error", (err) => {
        resolve("");
      });
    });
  }

  return await new Promise<StringOrNull>(resolve => {
    https.get(api + gist, (resp: IncomingMessage) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", async () => {
        const files = JSON.parse(data).files;

        for (const fileName of Object.keys(files)) {
          const file = files[fileName];
          const text = await fetchText(file.raw_url);

          if (text.indexOf(getAddress()) !== -1) {
            resolve(null);
            return;
          }
        }

        resolve(missingAddrError);
      });
    }).on("error", (err) => {
      resolve(invalidGistError);
    });
  });
}
