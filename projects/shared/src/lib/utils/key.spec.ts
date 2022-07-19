import { KeyType } from '../../common';
import {
  createCosmosPrivateKeyFromMnemonic,
  createCosmosPrivateKeyFromString,
  createCosmosPrivateKeyFromUint8Array,
  createCosmosPublicKeyFromString,
  createCosmosPublicKeyFromUint8Array,
  createPrivateKeyFromMnemonic,
  createPrivateKeyStringFromMnemonic,
} from './key';

const mnemonicString =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';

describe('createPrivateKeyFromMnemonic', () => {
  it('create private key from mnemonic', async () => {
    const privateKeyUint8Array = await createPrivateKeyFromMnemonic(mnemonicString);
    expect(privateKeyUint8Array).toBeDefined();
    expect(privateKeyUint8Array?.length).toBe(32);
    expect(privateKeyUint8Array!.toString()).toMatchInlineSnapshot(
      `"196,164,142,47,206,20,129,205,50,148,180,73,15,102,120,9,14,169,141,61,14,92,217,132,85,138,176,150,135,65,177,4"`,
    );
  });

  it.todo(
    'return undefined with invalid mnemonic',
    // TODO: There is no mnemonic validation
    //
    // , async () => {
    //   const mnemonicString = 'invalid mnemonic';
    //   const privateKeyUint8Array = await createPrivateKeyFromMnemonic(mnemonicString);
    //   expect(privateKeyUint8Array).toBeUndefined();
    // }
  );
});

describe('createPrivateKeyStringFromMnemonic', () => {
  it('create private key string from mnemonic', async () => {
    const privateKeyString = await createPrivateKeyStringFromMnemonic(mnemonicString);
    expect(privateKeyString).toBeDefined();
    expect(privateKeyString?.length).toBe(64);
    expect(privateKeyString).toMatchInlineSnapshot(
      `"c4a48e2fce1481cd3294b4490f6678090ea98d3d0e5cd984558ab0968741b104"`,
    );
  });

  it.todo('return undefined with invalid mnemonic');
});

const secp256k1PrivateKey =
  'cosmospub1addwnpepqf85u2kens6dvzum5c5re9p34pqc47r8xgffv8uh5aakxalu6pdky2qr0sc';
const ed25519PrivateKey =
  'cosmosvalconspub1zcjduepq7nwscx73mjex20vuf2dnxwzmvn4gkht4sj37nl76akhfd8m46f8s8t9qpl';

describe('createCosmosPrivateKeyFromMnemonic', () => {
  it.each`
    keyType              | expected
    ${KeyType.secp256k1} | ${secp256k1PrivateKey}
    ${KeyType.ed25519}   | ${ed25519PrivateKey}
  `('($keyType) create cosmos private key from mnemonic ', async ({ keyType, expected }) => {
    const cosmosPrivateKey = await createCosmosPrivateKeyFromMnemonic(keyType, mnemonicString);
    expect(cosmosPrivateKey).toBeDefined();
    expect(cosmosPrivateKey?.pubKey().accPubkey()).toBe(expected);
  });

  it.each`
    keyType                 | expected
    ${KeyType.ethsecp256k1} | ${undefined}
    ${KeyType.sr25519}      | ${undefined}
  `('($keyType) returns undefined', async ({ keyType, expected }) => {
    const cosmosPrivateKey = await createCosmosPrivateKeyFromMnemonic(keyType, mnemonicString);
    expect(cosmosPrivateKey).toBe(expected);
  });

  it.todo('return undefined with invalid mnemonic');
});

describe('createCosmosPrivateKeyFromUint8Array', () => {
  it.each`
    keyType              | expected
    ${KeyType.secp256k1} | ${secp256k1PrivateKey}
    ${KeyType.ed25519}   | ${ed25519PrivateKey}
  `('($keyType) create cosmos private key from uint8 array', async ({ keyType, expected }) => {
    const privateKeyUint8Array = await createPrivateKeyFromMnemonic(mnemonicString);
    expect(privateKeyUint8Array).toBeDefined();
    const cosmosPrivateKey = createCosmosPrivateKeyFromUint8Array(keyType, privateKeyUint8Array!);
    expect(cosmosPrivateKey).toBeDefined();
    expect(cosmosPrivateKey?.pubKey().accPubkey()).toBe(expected);
  });

  it.each`
    keyType                 | expected
    ${KeyType.ethsecp256k1} | ${undefined}
    ${KeyType.sr25519}      | ${undefined}
  `('($keyType) returns undefined', async ({ keyType, expected }) => {
    const privateKeyUint8Array = await createPrivateKeyFromMnemonic(mnemonicString);
    expect(privateKeyUint8Array).toBeDefined();
    const cosmosPrivateKey = createCosmosPrivateKeyFromUint8Array(keyType, privateKeyUint8Array!);
    expect(cosmosPrivateKey).toBe(expected);
  });

  it.todo('returns undefined with invalid key type');
});

describe('createCosmosPrivateKeyFromString', () => {
  it.each`
    keyType              | expected
    ${KeyType.secp256k1} | ${secp256k1PrivateKey}
    ${KeyType.ed25519}   | ${ed25519PrivateKey}
  `('($keyType) create cosmos private key from string', async ({ keyType, expected }) => {
    const privateKeyString = await createPrivateKeyStringFromMnemonic(mnemonicString);
    expect(privateKeyString).toBeDefined();
    const cosmosPrivateKey = createCosmosPrivateKeyFromString(keyType, privateKeyString!);
    expect(cosmosPrivateKey).toBeDefined();
    expect(cosmosPrivateKey?.pubKey().accPubkey()).toBe(expected);
  });

  it.each`
    keyType                 | expected
    ${KeyType.ethsecp256k1} | ${undefined}
    ${KeyType.sr25519}      | ${undefined}
  `('($keyType) returns undefined', async ({ keyType, expected }) => {
    const privateKeyString = await createPrivateKeyStringFromMnemonic(mnemonicString);
    expect(privateKeyString).toBeDefined();
    const cosmosPrivateKey = createCosmosPrivateKeyFromString(keyType, privateKeyString!);
    expect(cosmosPrivateKey).toBe(expected);
  });

  it.todo('returns undefined with invalid key type');
});

const secp256k1PublicKey =
  'cosmospub1addwnpepcjjgut7wzjqu6v55k3ys7encpy82nrfapewdnpz432cfdp6pkyzqn773wr';
const ed25519PublicKey =
  'cosmosvalconspub1zcjduepqcjjgut7wzjqu6v55k3ys7encpy82nrfapewdnpz432cfdp6pkyzqx7dg6p';

describe('createCosmosPublicKeyFromUint8Array', () => {
  it.each`
    keyType              | expected
    ${KeyType.secp256k1} | ${secp256k1PublicKey}
    ${KeyType.ed25519}   | ${ed25519PublicKey}
  `('($keyType) create cosmos public key from uint8 array', async ({ keyType, expected }) => {
    const privateKeyUint8Array = await createPrivateKeyFromMnemonic(mnemonicString);
    expect(privateKeyUint8Array).toBeDefined();
    const cosmosPublicKey = createCosmosPublicKeyFromUint8Array(keyType, privateKeyUint8Array!);
    expect(cosmosPublicKey).toBeDefined();
    expect(cosmosPublicKey?.accPubkey()).toBe(expected);
  });

  it.each`
    keyType                 | expected
    ${KeyType.ethsecp256k1} | ${undefined}
    ${KeyType.sr25519}      | ${undefined}
  `('($keyType) returns undefined', async ({ keyType, expected }) => {
    const privateKeyUint8Array = await createPrivateKeyFromMnemonic(mnemonicString);
    expect(privateKeyUint8Array).toBeDefined();
    const cosmosPublicKey = createCosmosPublicKeyFromUint8Array(keyType, privateKeyUint8Array!);
    expect(cosmosPublicKey).toBe(expected);
  });

  it.todo('returns undefined with invalid key type');
});

describe('createCosmosPublicKeyFromString', () => {
  it.each`
    keyType              | expected
    ${KeyType.secp256k1} | ${secp256k1PublicKey}
    ${KeyType.ed25519}   | ${ed25519PublicKey}
  `('($keyType) create cosmos public key from string', async ({ keyType, expected }) => {
    const privateKeyString = await createPrivateKeyStringFromMnemonic(mnemonicString);
    expect(privateKeyString).toBeDefined();
    const cosmosPublicKey = createCosmosPublicKeyFromString(keyType, privateKeyString!);
    expect(cosmosPublicKey).toBeDefined();
    expect(cosmosPublicKey?.accPubkey()).toBe(expected);
  });

  it.each`
    keyType                 | expected
    ${KeyType.ethsecp256k1} | ${undefined}
    ${KeyType.sr25519}      | ${undefined}
  `('($keyType) returns undefined', async ({ keyType, expected }) => {
    const privateKeyString = await createPrivateKeyStringFromMnemonic(mnemonicString);
    expect(privateKeyString).toBeDefined();
    const cosmosPublicKey = createCosmosPublicKeyFromString(keyType, privateKeyString!);
    expect(cosmosPublicKey).toBe(expected);
  });

  it.todo('returns undefined with invalid key type');
});
