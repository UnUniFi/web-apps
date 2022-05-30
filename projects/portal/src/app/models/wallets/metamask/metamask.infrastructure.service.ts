import { createCosmosPublicKeyFromString } from '../../../utils/key';
import { KeyType } from '../../keys/key.model';
import { StoredWallet, WalletType } from '../wallet.model';
import { IMetaMaskInfrastructureService } from './metamask.service';
import { Injectable } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { extractPublicKey } from 'eth-sig-util';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class MetaMaskInfrastructureService implements IMetaMaskInfrastructureService {
  constructor() {}

  // Todo: message to be signed json and it's schema type should be set to function arguments.
  async signTypedDataV4ToJsonWithMetaMask(): Promise<string> {
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

    // Todo: This should be set function arguments instead of hard-coding.
    const cosmosLegacyAminoTransactionJson = {
      account_number: '12',
      chain_id: 'test',
      fee: { amount: [], gas: '200000' },
      memo: '',
      msgs: [
        {
          type: 'cosmos-sdk/MsgSend',
          value: {
            amount: [{ amount: '2000000', denom: 'uguu' }],
            from_address: 'ununifi1tqlgm42t0sl4ag3cvtsws5hsu6g5gaw4zqxeev',
            to_address: 'ununifi1v0lz8djhfakyf6k5cjez49nt0d657evwp5xru0',
          },
        },
      ],
      sequence: '0',
    };

    // Todo: I would like to automatically generate the types of the message from the message type and schema.
    // Todo: If not, this should be set function arguments.
    const messageJson = {
      domain: {
        chainId,
        name: 'UnUniFi',
        version: '1',
      },
      message: cosmosLegacyAminoTransactionJson,
      primaryType: 'Message',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
        ],
        Message: [
          { name: 'account_number', type: 'string' },
          { name: 'chain_id', type: 'string' },
          { name: 'fee', type: 'Fee' },
          { name: 'memo', type: 'string' },
          { name: 'msgs', type: 'Msg[]' },
          { name: 'sequence', type: 'string' },
        ],
        Fee: [
          { name: 'amount', type: 'Amount[]' },
          { name: 'gas', type: 'string' },
        ],
        Amount: [
          { name: 'amount', type: 'string' },
          { name: 'denom', type: 'string' },
        ],
        Msg: [
          { name: 'type', type: 'string' },
          { name: 'value', type: 'Value' },
        ],
        Value: [
          { name: 'amount', type: 'Amount[]' },
          { name: 'from_address', type: 'string' },
          { name: 'to_address', type: 'string' },
        ],
      },
    };

    const messageJsonString = JSON.stringify(messageJson);
    console.log(messageJsonString);

    const signature = await (provider as any).request({
      method: 'eth_signTypedData_v4',
      params: [metamaskAddress, messageJsonString],
    });
    console.log('signature', signature);

    return signature;
  }

  async signTypedDataV4ToJsonStringWithMetaMask(json: any): Promise<{
    message: string;
    signature: string;
  }> {
    const text = JSON.stringify(json);
    return this.signTypedDataV4ToTextWithMetaMask(text);
  }

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

  // Todo: Check the public key is correct or not.
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
    // Todo: Check the following compressing way is correct or not.
    const x = publicKey.slice(2).slice(0, 64);
    const y = publicKey.slice(2).slice(64);
    const bigIntY = BigInt(`0x${y}`);
    console.log(bigIntY);
    const compressedPublicKey = bigIntY % BigInt(2) === BigInt(0) ? `02${x}` : `03${x}`;
    console.log('x', x);
    console.log('y', y);
    console.log('bigIntY', bigIntY);
    console.log('compressedPublicKey', compressedPublicKey);
    return compressedPublicKey;
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

  // Todo: Currently, not implemented yet.
  async signWithMetaMask(unsignedData: unknown): Promise<Uint8Array | null | undefined> {
    return undefined;
  }
}
