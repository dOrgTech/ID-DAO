import {
  FieldState,
  FormState,
  ValidatableMapOrArray
} from "formstate";
import {
  ContentSource,
  Uploads,
  SocialPost,
  SocialPosts,
  ContentHost
} from "./types";

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
        .validators(requiredForm)
        .setDisplayName("Selfie")
        .setDescription(
          "Take a selfie holding a piece of paper with your public key written on it."
        ),

      video: new ContentSourceForm(form ? form.$.video : undefined)
        .validators(requiredForm)
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

export class SocialPostForm extends Form<
  SocialPost,
  {
    url: StringField;
  }
> {
  constructor(form?: SocialPostForm) {
    super({
      url: new StringField(form ? form.$.url.value : "")
        .validators(optionalText, validUrl)
        .setDisplayName("Post URL")
        .setDescription("The URL of your social post.")
    });
  }

  public get data(): SocialPost {
    return {
      url: this.$.url.value
    };
  }

  public set data(value: SocialPost) {
    this.$.url.value = value.url;
  }
}

export class SocialPostsForm extends Form<
  SocialPosts,
  {
    // TODO: make all these optional
    twitter: SocialPostForm;
    github: SocialPostForm;
    facebook: SocialPostForm;
  }
> {
  constructor(form?: SocialPostsForm) {
    super({
      twitter: new SocialPostForm(form ? form.$.twitter : undefined)
        .validators(TODO),
      github: new SocialPostForm(form ? form.$.github : undefined)
        .validators(TODO),
      facebook: new SocialPostForm(form ? form.$.facebook : undefined)
        .validators(TODO)
    });
  }

  public get data(): SocialPosts {
    return {
      twitter: this.$.twitter.data,
      github: this.$.github.data,
      facebook: this.$.facebook.data
    };
  }

  public set data(data: SocialPosts) {
    this.$.twitter.data = data.twitter ? data.twitter : {url: ""};
    this.$.github.data = data.github ? data.github : {url: ""};
    this.$.facebook.data = data.facebook ? data.facebook : {url: ""};
  }
}
