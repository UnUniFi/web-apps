import { KeyType } from '../keys/key.model';
import { cosmosclient } from '@cosmos-client/core';
import { PubKey } from '@cosmos-client/core/esm/types';

// Note: Now, only ununifi is supported.
export enum WalletType {
  ununifi = 'ununifi',
  keplr = 'keplr',
  ledger = 'ledger',
  keyStation = 'keyStation',
}

// Note: For general purpose? Uint8Array
export type Wallet = {
  id: string;
  type: WalletType;
  key_type: KeyType;
  public_key: Uint8Array;
  address: Uint8Array;
};

// Note: For Indexed DB (string)
export type StoredWallet = {
  id: string;
  type: WalletType;
  key_type: KeyType;
  public_key: string;
  address: string;
};

// Note: cosmos-client/core type
export type CosmosWallet = {
  id: string;
  type: WalletType;
  key_type: KeyType;
  public_key: PubKey;
  address: cosmosclient.AccAddress;
};
