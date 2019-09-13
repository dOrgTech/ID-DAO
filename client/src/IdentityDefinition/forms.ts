import {
  FieldState,
  FormState,
  ValidatableMapOrArray
} from "formstate";
import {
  ContentSource,
  Uploads,
  SocialPosts,
  ContentHost
} from "./types";
import {
  requiredText,
  validUrl,
  validHash,
  validContentHost,
  validTwitterSIVP,
  validGitHubSIVP,
  validFacebookSIVP
} from "./validators";

abstract class Field<
  ValueType,
  DerivedType extends Field<ValueType, DerivedType>
> extends FieldState<ValueType> {
  private _description: string = "";
  private _displayName: string = "";

  constructor(init: ValueType) {
    super(init);
  }

  setDescription(description: string): DerivedType {
    this._description = description;
    return (this as any) as DerivedType;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): DerivedType {
    this._displayName = displayName;
    return (this as any) as DerivedType;
  }

  get displayName(): string {
    return this._displayName;
  }
}

export class StringField extends Field<string, StringField> {
  constructor(init: string) {
    super(init);
  }
}

export abstract class Form<
  DataType,
  T extends ValidatableMapOrArray
> extends FormState<T> {
  private _description: string = "";
  private _displayName: string = "";

  public abstract get data(): DataType;
  public abstract set data(data: DataType);

  setDescription(description: string): Form<DataType, T> {
    this._description = description;
    return this;
  }

  get description(): string {
    return this._description;
  }

  setDisplayName(displayName: string): Form<DataType, T> {
    this._displayName = displayName;
    return this;
  }

  get displayName(): string {
    return this._displayName;
  }
}

export class ContentSourceForm extends Form<
  ContentSource,
  {
    host: StringField;
    hash: StringField;
  }
> {
  constructor(form?: ContentSourceForm) {
    super({
      host: new StringField(form ? form.$.host.value : "")
        .validators(requiredText, validContentHost)
        .setDisplayName("Host Type")
        .setDescription("Type of content hosting service."),

      hash: new StringField(form ? form.$.hash.value : "")
        .validators(requiredText, validHash)
        .setDisplayName("Content Hash")
        .setDescription("Hash of the content, used for lookup.")
    });
  }

  public get data(): ContentSource {
    const hostValue = this.$.host.value;
    let type: ContentHost;

    if (!(hostValue in ContentHost)) {
      type = ContentHost.Unknown;
    } else {
      type = (<any>ContentHost)[hostValue];
    }

    return {
      host: type,
      hash: this.$.hash.value
    };
  }

  public set data(data: ContentSource) {
    this.$.host.value = data.host;
    this.$.hash.value = data.hash;
  }
}

export class UploadsForm extends Form<
  Uploads,
  {
    selfie: ContentSourceForm;
    video: ContentSourceForm;
  }
> {
  constructor(form?: UploadsForm) {
    super({
      selfie: new ContentSourceForm(form ? form.$.selfie : undefined)
        .setDisplayName("Selfie")
        .setDescription(
          "Take a selfie holding a piece of paper with your public key written on it."
        ),

      video: new ContentSourceForm(form ? form.$.video : undefined)
        .setDisplayName("Video")
        .setDescription(
          "Take a selfie video of yourself holding a piece of paper with your public key written on it."
        )
    });
  }

  public get data(): Uploads {
    return {
      selfie: this.$.selfie.data,
      video: this.$.video.data
    };
  }

  public set data(data: Uploads) {
    this.$.selfie.data = data.selfie;
    this.$.video.data = data.video;
  }
}

export class SocialPostsForm extends Form<
  SocialPosts,
  {
    // TODO: make all these optional
    twitter: StringField;
    github: StringField;
  }
> {
  constructor(getAddress: ()=>string, form?: SocialPostsForm) {
    super({
      twitter: new StringField(form ? form.$.twitter.value : "")
        .validators(
          async value => await validTwitterSIVP(value, getAddress),
          validUrl
        ),
      github: new StringField(form ? form.$.github.value : "")
        .validators(
          async value => await validGitHubSIVP(value, getAddress),
          validUrl
        )
    });
  }

  public get data(): SocialPosts {
    const { twitter, github } = this.$;

    return {
      twitter: twitter.value === "" ? undefined : twitter.value,
      github: github.value === "" ? undefined : github.value
    };
  }

  public set data(data: SocialPosts) {
    this.$.twitter.value = data.twitter ? data.twitter : "";
    this.$.github.value = data.github ? data.github : "";
  }
}
