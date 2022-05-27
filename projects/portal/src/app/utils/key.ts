import { KeyType } from '../models/keys/key.model';
import { convertHexStringToUint8Array } from './converter';
import { proto } from '@cosmos-client/core';
import { PrivKey, PubKey } from '@cosmos-client/core/esm/types';

export const createCosmosPrivateKeyFromUint8Array = (
  keyType: KeyType,
  privateKeyUint8Array: Uint8Array,
): PrivKey | undefined => {
  try {
    switch (keyType) {
      case KeyType.secp256k1:
        return new proto.cosmos.crypto.secp256k1.PrivKey({ key: privateKeyUint8Array });
      case KeyType.ed25519:
        return new proto.cosmos.crypto.ed25519.PrivKey({ key: privateKeyUint8Array });
      // Todo: implementation is necessary
      case KeyType.ethsecp256k1:
        return undefined;
      default:
        return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const createCosmosPrivateKeyFromString = (
  keyType: KeyType,
  privateKeyString: string,
): PrivKey | undefined => {
  const privateKeyUint8Array = convertHexStringToUint8Array(privateKeyString);
  if (!privateKeyUint8Array) {
    return undefined;
  }
  return createCosmosPrivateKeyFromUint8Array(keyType, privateKeyUint8Array);
};

export const createCosmosPublicKeyFromUint8Array = (
  keyType: KeyType,
  publicKeyUint8Array: Uint8Array,
): PubKey | undefined => {
  try {
    switch (keyType) {
      case KeyType.secp256k1:
        return new proto.cosmos.crypto.secp256k1.PubKey({ key: publicKeyUint8Array });
      case KeyType.ed25519:
        return new proto.cosmos.crypto.ed25519.PubKey({ key: publicKeyUint8Array });
      // Todo: implementation is necessary
      case KeyType.ethsecp256k1:
        return undefined;
      default:
        return undefined;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const createCosmosPublicKeyFromString = (
  keyType: KeyType,
  publicKeyString: string,
): PubKey | undefined => {
  const publicKeyUint8Array = convertHexStringToUint8Array(publicKeyString);
  if (!publicKeyUint8Array) {
    return undefined;
  }
  return createCosmosPublicKeyFromUint8Array(keyType, publicKeyUint8Array);
};
