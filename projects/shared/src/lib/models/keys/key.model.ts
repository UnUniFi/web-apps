export enum KeyType {
  secp256k1 = 'secp256k1',
  ed25519 = 'ed25519',
  sr25519 = 'sr25519',
  ethsecp256k1 = 'ethsecp256k1',
}

export type Key = {
  id: string;
  type: KeyType;
  public_key: string;
};

export type KeyBackupResult = {
  saved: Boolean;
  checked: Boolean;
};
