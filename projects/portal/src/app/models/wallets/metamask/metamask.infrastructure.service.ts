import { KeyType } from '../../keys/key.model';
import { StoredWallet, WalletType } from '../wallet.model';
import { IMetaMaskInfrastructureService } from './metamask.service';
import { Injectable } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class MetaMaskInfrastructureService implements IMetaMaskInfrastructureService {
  constructor() {}

  async connectWallet(): Promise<StoredWallet | null | undefined> {
    // Note: refer https://docs.metamask.io/guide/ethereum-provider.html#table-of-contents
    const provider = (await detectEthereumProvider()) as any;
    if (!provider) {
      throw Error('MetaMask is not installed!');
    }

    // Note: `provider === window.ethereum` is true.
    if (provider) {
      try {
        await provider.enable();
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        const ethAddress = accounts[0];
        // Todo: Currently, I don't know the way to get public key from MetaMask. So I set empty string.
        // Todo: Currently, I don't know the way to get UnUniFi's bech32Prefix converted address string. So I set eth address string. (If I can get correct public key, I can convert it to correct address value.)
        const connectedStoredWallet: StoredWallet = {
          id: ethAddress,
          type: WalletType.metaMask,
          key_type: KeyType.ethsecp256k1,
          public_key: '',
          address: ethAddress,
        };
        return connectedStoredWallet;
      } catch (error) {
        throw Error('MetaMask access denied!');
      }
    }
    return undefined;
  }

  // Todo: Currently, not implemented yet.
  async signWithMetaMask(unsignedData: unknown): Promise<Uint8Array | null | undefined> {
    return undefined;
  }
}
