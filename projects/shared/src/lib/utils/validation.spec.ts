import {
  convertUint8ArrayToHexString,
  createCosmosPrivateKeyFromString,
  createCosmosPublicKeyFromString,
  createPrivateKeyStringFromMnemonic,
  KeyType,
  StoredWallet,
  validatePrivateStoredWallet,
  WalletType,
} from '../../common';
import { cosmosclient } from '@cosmos-client/core';

describe('validatePrivateStoredWallet', () => {
  const setup = async () => {
    const mnemonicString =
      'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
    const privateKeyString = await createPrivateKeyStringFromMnemonic(mnemonicString);
    const cosmosPrivateKey = createCosmosPrivateKeyFromString(KeyType.ed25519, privateKeyString!);
    const publicKeyString = convertUint8ArrayToHexString(cosmosPrivateKey?.pubKey().bytes()!);
    const cosmosPublicKey = createCosmosPublicKeyFromString(KeyType.ed25519, publicKeyString!);
    const address = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey!).toString();

    const privateStoredWallet: StoredWallet & { privateKey: string } = {
      id: '',
      type: WalletType.ununifi,
      key_type: KeyType.ed25519,
      privateKey: privateKeyString!,
      public_key: publicKeyString!,
      address: address,
    };
    return { privateStoredWallet, privateKeyString };
  };

  it('returns true if the target has the valid value', async () => {
    const { privateStoredWallet } = await setup();

    const result = validatePrivateStoredWallet(privateStoredWallet);
    expect(result).toBe(true);
  });

  it.each`
    reason                                   | wrongValue
    ${'wrong private key'}                   | ${{ privateKey: 'wrong' }}
    ${'wrong public key'}                    | ${{ public_key: 'wrong' }}
    ${'wrong address'}                       | ${{ address: 'wrong' }}
    ${'unsupported key type (ethsecp256k1)'} | ${{ key_type: KeyType.ethsecp256k1 }}
    ${'unsupported key type (sr25519)'}      | ${{ key_type: KeyType.sr25519 }}
  `('returns false with $reason', async ({ wrongValue }) => {
    const { privateStoredWallet } = await setup();

    const result = validatePrivateStoredWallet({ ...privateStoredWallet, ...wrongValue });
    expect(result).toBe(false);
  });

  it('returns false with mismatched private key and public key', async () => {
    const { privateStoredWallet } = await setup();

    const mismatchedPrivateKeyAndPublicKey = validatePrivateStoredWallet({
      ...privateStoredWallet,
      public_key: privateStoredWallet.privateKey,
    });
    expect(mismatchedPrivateKeyAndPublicKey).toBe(false);
  });
});
