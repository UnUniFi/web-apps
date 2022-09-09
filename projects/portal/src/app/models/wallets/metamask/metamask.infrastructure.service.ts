import { createCosmosPublicKeyFromString } from '../../../utils/key';
import { ConfigService } from '../../config.service';
import { KeyType } from '../../keys/key.model';
import { StoredWallet, WalletType } from '../wallet.model';
import { IMetaMaskInfrastructureService } from './metamask.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MetaMaskInfrastructureService implements IMetaMaskInfrastructureService {
  constructor(private readonly configService: ConfigService) {}

  private messageToDigest(message: string): Uint8Array {
    const messageHash = ethers.utils.hashMessage(message);
    const digest = ethers.utils.arrayify(messageHash);
    return digest;
  }

  private async personalSign(message: string): Promise<string> {
    await detectEthereumProvider({ mustBeMetaMask: true });
    if (!window.ethereum?.isMetaMask) {
      throw Error('MetaMask is not installed!');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    if (!accounts?.length) {
      throw Error('Failed to get MetaMask account!');
    }
    const address = accounts[0];
    console.log(address);
    const signer = provider.getSigner(address);
    const signature = signer.signMessage(message);
    return signature;
  }

  private async getPublicKeyFromMetaMask(): Promise<string> {
    const message = 'Connecting to MetaMask from UnUniFi';
    const signature = await this.personalSign(message);
    console.log('signature', signature);
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    console.log('ethRecoveredAddress', recoveredAddress);

    const digest = this.messageToDigest(message);
    console.log('digest', digest);
    const recoveredUncompressedPublicKey = ethers.utils.recoverPublicKey(digest, signature);
    console.log('ethUncompressedPublicKey', recoveredUncompressedPublicKey);
    const recoverdAddress2 = ethers.utils.recoverAddress(digest, signature);
    console.log('ethRecoveredAddress2', recoverdAddress2);
    const recoveredCompressedPublicKey = ethers.utils.computePublicKey(
      recoveredUncompressedPublicKey,
      true,
    );
    console.log('ethCompressedPublicKey', recoveredCompressedPublicKey);
    const publicKeyWithout0x = recoveredCompressedPublicKey.slice(2);
    return publicKeyWithout0x;
  }

  private async getEthAddress(): Promise<string> {
    await detectEthereumProvider({ mustBeMetaMask: true });
    if (!window.ethereum?.isMetaMask) {
      throw Error('MetaMask is not installed!');
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    if (!accounts?.length) {
      throw Error('Failed to get MetaMask account!');
    }
    const address = accounts[0];
    console.log(address);
    return accounts[0];
  }

  private async getCosmosStoredWalletFromMetaMask(): Promise<StoredWallet> {
    const ethAddress = await this.getEthAddress();
    const publicKeyString = await this.getPublicKeyFromMetaMask();
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

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const txJson = txBuilder.toProtoJSON() as any;

    console.log(txJson);

    const config = await this.configService.config$.pipe(take(1)).toPromise();
    const chainId = config?.chainID;
    if (!chainId) {
      throw Error('Failed to get UnUniFi ChainID!');
    }

    const messageJson = {
      body: txJson.body,
      auth_info: txJson.auth_info,
      chain_id: chainId,
      account_number: signerBaseAccount.account_number.toString(10),
    };
    console.log(messageJson);

    const messageToBeSigned = JSON.stringify(messageJson);
    console.log(messageToBeSigned);

    const signature = await this.personalSign(messageToBeSigned);
    console.log(signature);
    const signatureWithout0x = signature.slice(2);
    console.log(signatureWithout0x);
    const signatureUint8Array = Uint8Array.from(Buffer.from(signatureWithout0x, 'hex'));
    txBuilder.addSignature(signatureUint8Array);

    // Note: Debug only purpose implementation
    const recoveredAddress = ethers.utils.verifyMessage(messageToBeSigned, signature);
    console.log('recoveredAddress', recoveredAddress);
    const digest = this.messageToDigest(messageToBeSigned);
    const recoveredUncompressedPublicKey = ethers.utils.recoverPublicKey(digest, signature);
    console.log('recoveredUncompressedPublicKey', recoveredUncompressedPublicKey);
    const recoveredCompressedPublicKey = ethers.utils.computePublicKey(
      recoveredUncompressedPublicKey,
      true,
    );
    console.log('recoveredCompressedPublicKey', recoveredCompressedPublicKey);

    return txBuilder;
  }
}
