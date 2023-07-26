import { KeyType } from '../keys/key.model';
import cosmosclient from '@cosmos-client/core';
import { PubKey } from '@cosmos-client/core/esm/types';

// Note: Now, only ununifi is supported.
export enum WalletType {
  ununifi = 'ununifi',
  keplr = 'keplr',
  metaMask = 'metaMask',
}

// Note: For general purpose? Uint8Array ... Want to use this as possible?
export type Wallet = {
  id: string;
  type: WalletType;
  key_type: KeyType;
  public_key: Uint8Array;
  address: Uint8Array;
};

// Note: For Indexed DB (string) ... This type is necessary for Indexed DB.
export type StoredWallet = {
  id: string;
  type: WalletType;
  key_type: KeyType;
  public_key: string;
  address: string;
};

// Note: cosmos-client/core type ... I guess sdk declared type is more convenient than Uint8Array?
export type CosmosWallet = {
  id: string;
  type: WalletType;
  key_type: KeyType;
  public_key: PubKey;
  address: cosmosclient.AccAddress;
};
