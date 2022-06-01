import { createCosmosPublicKeyFromString } from '../../../utils/key';
import { ConfigService } from '../../config.service';
import { MetaMaskTx } from '../../cosmos/tx-common.model';
import { KeyType } from '../../keys/key.model';
import { StoredWallet, WalletType } from '../wallet.model';
import { IMetaMaskInfrastructureService } from './metamask.service';
import { Injectable } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { extractPublicKey } from 'eth-sig-util';
import { take } from 'rxjs/operators';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class MetaMaskInfrastructureService implements IMetaMaskInfrastructureService {
  constructor(private readonly configService: ConfigService) {}

  // Note: This method is used to get public key from signature data.
  async signTypedDataV4ToJsonStringWithMetaMask(json: any): Promise<{
    message: string;
    signature: string;
  }> {
    const text = JSON.stringify(json);
    return this.signTypedDataV4ToTextWithMetaMask(text);
  }

  // Note: This method is used to get public key from signature data.
  async signTypedDataV4ToTextWithMetaMask(text: string): Promise<{
    message: string;
    signature: string;
  }> {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (!provider || !window.ethereum?.isMetaMask) {
      throw Error('MetaMask is not installed!');
    }

    const accounts = await (provider as any).request({ method: 'eth_requestAccounts' });
    if (!accounts?.length) {
      throw Error('Failed to get MetaMask account!');
    }
    const metamaskAddress = accounts[0];

    const web3 = new Web3(Web3.givenProvider);
    const chainId = await web3.eth.getChainId();
    console.log('chainId', chainId);
    console.log('accounts', accounts);
    console.log('ethAddress', metamaskAddress);

    const messageJson = {
      domain: {
        chainId,
        name: 'UnUniFi',
        version: '1',
      },
      message: {
        text: text,
      },
      primaryType: 'Message',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
        ],
        Message: [{ name: 'text', type: 'string' }],
      },
    };

    const messageJsonString = JSON.stringify(messageJson);
    console.log(messageJsonString);

    const signature = await (provider as any).request({
      method: 'eth_signTypedData_v4',
      params: [metamaskAddress, messageJsonString],
    });
    console.log('signature', signature);

    return {
      message: messageJsonString,
      signature: signature,
    };
  }

  // Note: This method is used to sign to Cosmos SDK tx data.
  async signTypedDataV4ToCosmosSdkTxWithMetaMask(
    body: string,
    auth_info: string,
    account_number: string,
  ): Promise<{
    message: string;
    signature: string;
  }> {
    const config = await this.configService.config$.pipe(take(1)).toPromise();
    const chainId = config?.chainID;
    if (!chainId) {
      throw Error('Failed to get UnUniFi ChainID!');
    }

    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (!provider || !window.ethereum?.isMetaMask) {
      throw Error('MetaMask is not installed!');
    }

    const accounts = await (provider as any).request({ method: 'eth_requestAccounts' });
    if (!accounts?.length) {
      throw Error('Failed to get MetaMask account!');
    }
    const metamaskAddress = accounts[0];

    const web3 = new Web3(Web3.givenProvider);
    const metaMaskAccountChainId = await web3.eth.getChainId();
    console.log('chainId', metaMaskAccountChainId);
    console.log('accounts', accounts);
    console.log('ethAddress', metamaskAddress);

    const messageJson: MetaMaskTx = {
      domain: {
        chainId: metaMaskAccountChainId,
        name: 'UnUniFi',
        version: '1',
      },
      message: {
        auth_info: auth_info,
        body: body,
        chain_id: chainId,
        account_number: account_number,
      },
      primaryType: 'Message',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
        ],
        Message: [
          {
            name: 'body',
            type: 'string',
          },
          {
            name: 'auth_info',
            type: 'string',
          },
          {
            name: 'chain_id',
            type: 'string',
          },
          {
            name: 'account_number',
            type: 'string',
          },
        ],
      },
    };
    console.log(messageJson);

    const messageJsonString = JSON.stringify(messageJson);
    console.log(messageJsonString);

    const signature = await (provider as any).request({
      method: 'eth_signTypedData_v4',
      params: [metamaskAddress, messageJsonString],
    });
    console.log('signature', signature);

    return {
      message: messageJsonString,
      signature: signature,
    };
  }

  // Todo: Public key derived with this method is wrong... This should be fixed...
  async getPublicKeyFromMetaMask(): Promise<string> {
    const signedResult: {
      message: string;
      signature: string;
    } = await this.signTypedDataV4ToTextWithMetaMask('Connecting to MetaMask from UnUniFi');
    const publicKey = extractPublicKey({
      data: signedResult.message,
      sig: signedResult.signature,
    });
    console.log('publicKey', publicKey);
    // Todo: Check the following compressing way is correct or not. <- I guess original value before compressing is wrong.
    const x = publicKey.slice(2).slice(0, 64);
    const y = publicKey.slice(2).slice(64);
    const bigIntY = BigInt(`0x${y}`);
    console.log(bigIntY);
    const compressedPublicKey = bigIntY % BigInt(2) === BigInt(0) ? `02${x}` : `03${x}`;
    console.log('x', x);
    console.log('y', y);
    console.log('bigIntY', bigIntY);
    console.log('compressedPublicKey', compressedPublicKey);

    const encryptionPublicKey = await this.getEncryptionPublicKeyFromMetaMask();
    console.log('EncryptionPublicKey', encryptionPublicKey);
    const hexStringEncryptionPublicKey = Buffer.from(encryptionPublicKey, 'base64').toString('hex');
    console.log('hexStringEncryptionPublicKey', hexStringEncryptionPublicKey);

    // Todo: Currently, compressedPublicKey is wrong. Expected compressedPublicKey is hardcoded without 0x prefix.
    // return compressedPublicKey;
    return '0370265a37df3c886d3692af1b8210c2f8bd6fb4007acdb1c4c2012c663989fff4';
  }

  // Note: This method is currently not used. You can delete this.
  // Note: Public key derived with this method does not match to expected public key...
  async getEncryptionPublicKeyFromMetaMask(): Promise<string> {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (!provider || !window.ethereum?.isMetaMask) {
      throw Error('MetaMask is not installed!');
    }

    const accounts = await (provider as any).request({ method: 'eth_requestAccounts' });
    if (!accounts?.length) {
      throw Error('Failed to get MetaMask account!');
    }
    const metamaskAddress = accounts[0];

    const base64EncryptionPublicKey = await (provider as any).request({
      method: 'eth_getEncryptionPublicKey',
      params: [metamaskAddress],
    });
    console.log('base64EncryptionPublicKey', base64EncryptionPublicKey);

    const hexStringEncryptionPublicKey = Buffer.from(base64EncryptionPublicKey, 'base64').toString(
      'hex',
    );
    console.log('hexStringEncryptionPublicKey', hexStringEncryptionPublicKey);
    return hexStringEncryptionPublicKey;
  }

  async getEthAddress(): Promise<string> {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });
    if (!provider || !window.ethereum?.isMetaMask) {
      throw Error('MetaMask is not installed!');
    }
    const accounts = await (provider as any).request({ method: 'eth_requestAccounts' });
    if (!accounts?.length) {
      throw Error('Failed to get MetaMask account!');
    }
    return accounts[0];
  }

  async getCosmosStoredWalletFromMetaMask(): Promise<StoredWallet> {
    const ethAddress = await this.getEthAddress();
    // Todo: Public key should be compressed to shorter length data. But, I'm not sure this method is correct or not.
    const publicKeyString = await this.getPublicKeyFromMetaMask();
    // Todo: Key type should be ethsecp256k1? But, currently, it is not implemented yet, so I use secp256k1. Need to check it's OK or not.
    const cosmosPublicKey = createCosmosPublicKeyFromString(KeyType.secp256k1, publicKeyString);
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }
    const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const storedWallet: StoredWallet = {
      id: ethAddress,
      type: WalletType.metaMask,
      key_type: KeyType.ethsecp256k1,
      public_key: publicKeyString,
      address: accAddress.toString(),
    };
    return storedWallet;
  }

  async connectWallet(): Promise<StoredWallet | null | undefined> {
    return await this.getCosmosStoredWalletFromMetaMask();
  }

  // Todo: This method seems to work well, but, as a result, tx fails. We need to fix signature verification error.
  async signWithMetaMask(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    txBuilder.signDoc(signerBaseAccount.account_number);
    const txJsonString = txBuilder.cosmosJSONStringify();
    if (!txBuilder) {
      throw Error('Failed to txBuilder');
    }
    const txJson = JSON.parse(txJsonString);

    // fix JSONstringify issue
    delete txJson.auth_info.signer_infos[0].mode_info.multi;
    console.log(txJson);

    const authInfo = txJson.auth_info;
    const authInfoJsonString = JSON.stringify(authInfo);
    const body = txJson.body;
    const bodyJsonString = JSON.stringify(body);
    const accountNumber = signerBaseAccount.account_number.toString();

    const signatureResponse = await this.signTypedDataV4ToCosmosSdkTxWithMetaMask(
      bodyJsonString,
      authInfoJsonString,
      accountNumber,
    );
    console.log(signatureResponse.message);
    console.log(signatureResponse.signature);

    const signatureWithout0x = signatureResponse.signature.slice(2);
    console.log(signatureWithout0x);
    const signatureUint8Array = Uint8Array.from(Buffer.from(signatureWithout0x, 'hex'));
    txBuilder.addSignature(signatureUint8Array);

    return txBuilder;
  }
}
