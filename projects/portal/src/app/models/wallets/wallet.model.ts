import { KeyType } from '../keys/key.model';
import { Window as LeapWindow } from './leap/leap.model';
import cosmosclient from '@cosmos-client/core';
import { PubKey } from '@cosmos-client/core/esm/types';
import { Window as KeplrWindow } from '@keplr-wallet/types';

export enum WalletType {
  ununifi = 'UnUniFi',
  keplr = 'Keplr',
  leap = 'Leap',
  metamask = 'MetaMask',
}

interface MergedWindow extends KeplrWindow, LeapWindow {}
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends MergedWindow {}
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
