import { StoredWallet } from '../models/wallets/wallet.model';
import { createCosmosPrivateKeyFromString, createCosmosPublicKeyFromString } from './key';
import cosmosclient from '@cosmos-client/core';

export const validatePrivateStoredWallet = (
  privateStoredWallet: StoredWallet & { privateKey: string },
): boolean => {
  try {
    const cosmosPrivateKey = createCosmosPrivateKeyFromString(
      privateStoredWallet.key_type,
      privateStoredWallet.privateKey,
    );
    if (!cosmosPrivateKey) {
      return false;
    }
    const cosmosPublicKey = createCosmosPublicKeyFromString(
      privateStoredWallet.key_type,
      privateStoredWallet.public_key,
    );
    if (!cosmosPublicKey) {
      return false;
    }
    const matchPrivateKeyAndPublicKey =
      cosmosPrivateKey.pubKey().bytes().toString() !== cosmosPublicKey.bytes().toString();
    if (matchPrivateKeyAndPublicKey) {
      return false;
    }
    const matchPublicKeyAndAddress =
      cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey).toAccAddress().toString() !==
      privateStoredWallet.address;
    if (matchPublicKeyAndAddress) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const validateAccAddress = (address: string): boolean => {
  try {
    const accAddress = cosmosclient.AccAddress.fromString(address);
    return true
  } catch (error) {
    console.error(error);
    return false;
  }
}
