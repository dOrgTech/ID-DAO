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
  selfie: ContentSource;
  video: ContentSource;
}

export interface SocialPost {
  url: string;
}

export interface SocialPosts {
  twitter?: SocialPost;
  github?: SocialPost;
  facebook?: SocialPost;
}
