require("dotenv").config();
import { Validator } from "formstate";
import * as Web3Utils from "web3-utils";
import * as IsIPFS from "is-ipfs";
import * as Twitter from "twitter";
import * as request from "request";
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

  // application auth keys
  const {
    TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET,
    TWITTER_BEARER_TOKEN
  } = process.env;

  // early out if we're missing our API keys
  if (!TWITTER_BEARER_TOKEN || !TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET) {
    return null;
  }

  const client = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    bearer_token: TWITTER_BEARER_TOKEN
  });

  const params = {
    tweet_mode: "extended",
    id: status
  };

  return new Promise<StringOrNull>(resolve => {
    client.get("statuses/show.json", params, (error: any, tweet: any, response: any) => {
      if (error) {
        resolve(invalidStatusError);
      }

      const post = tweet.full_text;

      if (post === undefined) {
        resolve(invalidStatusError);
        return;
      }

      // Check for the presence of the address
      if (post.indexOf(getAddress()) === -1) {
        resolve(missingAddrError);
        return;
      }

      resolve(null);
    });
  });
}

// TODO: test with github app token, and fallback to basic URL validation
// if one isn't present & we've been rate limited.
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
    return new Promise<string>(resolve => {
      request.get({ url: rawUrl }, (error, response, body) => {
        if (error) {
          resolve("")
        } else {
          resolve(body);
        }
      });
    });
  }

  const headers = {
    "User-Agent": "request"
  };

  return new Promise<StringOrNull>(resolve => {
    request.get({ url: api + gist, headers }, async (error, response, body) => {
      if (error) {
        resolve(invalidGistError + ` ${error}`);
      } else {
        const data = JSON.parse(body);
        const files = data.files;

        if (files === undefined) {
          // the application token wasn't provided,
          // and we're being reate limited, so succeed.
          if (data.message.indexOf("API rate limit") !== -1) {
            resolve(null);
            return;
          }

          resolve(invalidGistError);
          return;
        }

        for (const fileName of Object.keys(files)) {
          const file = files[fileName];
          const text = await fetchText(file.raw_url);

          if (text.indexOf(getAddress()) !== -1) {
            resolve(null);
            return;
          }
        }

        resolve(missingAddrError);
      }
    });
  });
}
