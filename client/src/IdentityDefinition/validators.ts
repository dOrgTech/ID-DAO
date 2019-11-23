import { Validator } from "formstate";
import * as Web3Utils from "web3-utils";
import * as IsIPFS from "is-ipfs";
import fetch, {
  Response
} from "node-fetch";
import {
  Address,
  ContentHost
} from "./types";

type StringOrNull = string | null | undefined;

export const requiredText: Validator<StringOrNull> = value => {
  const error = "This is required.";

  if (value == null || value.trim().length === 0) {
    return error;
  }

  return null;
}

export const optionalText = (...validators: Validator<string>[]): Validator<string> => {
  return (value: string) => {
    if (value !== "") {
      for (let fn of validators) {
        const result = fn(value);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }
}

const isAddress = (address: Address): boolean => {
  const addr = address.toLowerCase();
  return addr[0] === "0" && addr[1] === "x" && Web3Utils.isAddress(addr);
};

export const validAddress: Validator<string> = value => {
  const error = "Please enter a valid address.";
  value = value.trim();

  if (!isAddress(value)) {
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
  const error = "Invalid mutihash.";
  value = value.trim();

  if (IsIPFS.multihash(value)) {
    return null;
  } else {
    return error;
  }
}

export const validContentHost: Validator<string> = value => {
  const error = "Invalid content host.";

  if (!Object.values(ContentHost).includes(value as ContentHost) || value === ContentHost.Unknown) {
    return error;
  }

  return null;
}

export const validTwitterSIVP = async (value: string, getAddress: ()=>string) => {
  // Example Twitter SIVP
  // https://twitter.com/user_name/status/1171073473527250944

  // Errors
  const invalidStatusError = "Invalid Tweet URL, please use the 'twitter.com/user/status/#' format.";
  const missingAddrError = "Tweet is missing the public address.";

  // Validate the URL is formed correctly
  if (value.indexOf("https://twitter.com/") === -1) {
    return invalidStatusError;
  }

  if (value.indexOf("/status/") === -1) {
    return invalidStatusError;
  }

  return new Promise<StringOrNull>(resolve => {
    fetch(value, {
      headers: { "Content-Type": "text/html" }
    })
      .then(async (res: Response) => {
        if (!res.ok) {
          resolve(invalidStatusError);
          return;
        }

        const body = await res.text();
        if (body.indexOf(getAddress()) === -1) {
          resolve(missingAddrError);
          return;
        }

        resolve(null);
      })
      .catch((err: Error) => {
        console.error(
          "Failed to fetch the post's HTML, this is most likely" +
          " related to CORS policy, please solve this with a proxy server."
        );
        console.error(err);
        resolve(null);
      });
  });
}

export const validGitHubSIVP = async (value: string, getAddress: ()=>string) => {
  // Example GitHub Gist
  // https://gist.github.com/user_name/883534236ed2f0e0ffc700b96bd092cd

  // Errors
  const invalidGistError = "Invalid Gist URL, please use the 'gist.github.com/user/#' format.";
  const missingAddrError = "Gist is missing the public address.";

  // Ensure the URL contains the correct domain
  const beginning = "https://gist.github.com/";

  if (value.indexOf(beginning) === -1) {
    return invalidGistError;
  }

  // Trim trailing "/"
  if (value.endsWith("/")) {
    value = value.substr(0, value.length - 1);
  }

  // Remove the user_name
  if (value.split("/").length - 1 === 4) {
    const nameStart = beginning.length;
    const nameEnd = value.indexOf("/", nameStart);
    value = value.substr(0, nameStart) + value.substr(nameEnd + 1);
  }

  return new Promise<StringOrNull>(resolve => {
    fetch(value)
      .then(async (res: Response) => {
        if (!res.ok) {
          resolve(invalidGistError);
          return;
        }

        const body = await res.text();
        if (body.indexOf(getAddress()) === -1) {
          resolve(missingAddrError);
          return;
        }

        resolve(null);
      })
      .catch((err: Error) => {
        console.error(
          "Failed to fetch the post's HTML, this is most likely" +
          " related to CORS policy, please solve this with a proxy server."
        );
        console.error(err);
        resolve(null);
      });
  });
}
