export type Address = string;

export enum ContentHost {
  Unknown = "unknown",
  IPFS = "ipfs",
  GunDB = "gun"
}

export interface ContentSource {
  host: ContentHost;
  hash: string;
}

export interface Uploads {
  selfie?: ContentSource;
  video?: ContentSource;
}

export interface SocialPosts {
  twitter?: string;
  github?: string;
}
