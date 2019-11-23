import {
  Address,
  Uploads,
  SocialPosts,
  ContentHost
} from "./types";
import {
  Form,
  StringField,
  UploadsForm,
  SocialPostsForm
} from "./forms";
import {
  requiredText,
  validAddress,
  validContentHost
} from "./validators";
import { getIPFS } from "../utils/ipfsUtils";
import { signPayload } from "../utils/web3Utils";

export interface IdentityDefinition {
  name: string;
  address: Address;
  uploads: Uploads;
  socialPosts: SocialPosts;
  // oracles
  version: "1"
}

export class IdentityDefinitionForm extends Form<
  IdentityDefinition,
  {
    name: StringField;
    address: StringField;
    uploads: UploadsForm;
    socialPosts: SocialPostsForm;
  }
> {
  constructor(form?: IdentityDefinitionForm) {
    super({
      name: new StringField(form ? form.$.name.value : "")
        .setDisplayName("Human Name")
        .setDescription("Your human readable name."),

      address: new StringField(form ? form.$.address.value : "")
        .validators(requiredText, validAddress)
        .setDisplayName("Ethereum Address")
        .setDescription("Your public Ethereum address."),

      uploads: new UploadsForm(form ? form.$.uploads : undefined)
        .setDisplayName("Uploaded Proof")
        .setDescription("Upload something to prove you're human."),

      socialPosts: new SocialPostsForm(() => this.$.address.value, form ? form.$.socialPosts : undefined)
        .setDisplayName("Identity Verification Posts")
        .setDescription("Post your Ethereum address publicly from one of your social accounts.")
    });
  }

  public get data(): IdentityDefinition {
    return {
      name: this.$.name.value,
      address: this.$.address.value,
      uploads: this.$.uploads.data,
      socialPosts: this.$.socialPosts.data,
      version: "1"
    };
  }

  public set data(data: IdentityDefinition) {
    this.$.name.value = data.name;
    this.$.address.value = data.address;
    this.$.uploads.data = data.uploads;
    this.$.socialPosts.data = data.socialPosts;
  }
}

export const serialize = (data: IdentityDefinition): string => {
  return JSON.stringify(data, null, 2);
};

export const deserialize = (json: string): IdentityDefinition => {
  return JSON.parse(json, (key: string, value: any) => {
    if (key === "host") {
      if (validContentHost(value) == null) {
        return value;
      } else {
        return ContentHost.Unknown;
      }
    }

    return value;
  }) as IdentityDefinition;
};

export const signAndUploadIdentity = async (id: IdentityDefinition): Promise<{
  hash: string;
  sig: string;
}> => {
  const ipfs = getIPFS();
  const resp = await ipfs.add(Buffer.from(serialize(id)));

  if (resp.length === 0) {
    throw Error("Error Uploading Identity: No response.");
  }

  const hash = resp[0].path;
  const sig = await signPayload(id.address, hash);

  return {
    hash,
    sig
  };
}
