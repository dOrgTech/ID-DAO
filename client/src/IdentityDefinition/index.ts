import {
  Address,
  Uploads,
  SocialPosts
} from "./types";
import {
  Form,
  StringField,
  UploadsForm,
  SocialPostsForm
} from "./forms";

import {
  requiredText,
  validAddress
} from "./validators";

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
        .validators(requiredText)
        .setDisplayName("Human Name")
        .setDescription("Your human readable name."),

      address: new StringField(form ? form.$.address.value : "")
        .validators(requiredText, validAddress)
        .setDisplayName("Ethereum Address")
        .setDescription("Your public Ethereum address."),

      uploads: new UploadsForm(form ? form.$.uploads : undefined)
        .validators(atleastOneUpload)
        .setDisplayName("Uploaded Proof")
        .setDescription("Upload something to prove you're human."),

      socialPosts: new SocialPostsForm(() => this.$.address.value, form ? form.$.socialPosts : undefined)
        .validators(atleastOnePost)
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
