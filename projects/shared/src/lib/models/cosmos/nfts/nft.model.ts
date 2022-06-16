// Note: https://github.com/cosmos/cosmos-sdk/blob/main/docs/architecture/adr-043-nft-module.md
export type NFTClass = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  uri: string;
  uri_hash: string;
  data?: Metadata;
};

export type NFT = {
  nft_class: NFTClass;
  id: string;
  uri: string;
  uri_hash: string;
  data?: Metadata;
};

// Note: https://docs.opensea.io/docs/metadata-standards
export type Metadata = {
  name?: string;
  description?: string;
  image?: string;
  image_data?: string;
  external_url?: string;
  animation_url?: string;
  youtube_url?: string;
  background_color?: string;
  attributes?: Attributes;
};

export type Attributes = Attribute[];

export type Attribute = Trait | DisplayCaptureSurfaceType;

export type Trait = {
  trait_type?: string;
  value?: string;
};

export type DisplayType = 'number' | 'boost_number' | 'boost_percent';

export type Display = {
  display_type: DisplayType;
} & Trait;
