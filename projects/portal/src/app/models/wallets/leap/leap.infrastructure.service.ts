import { createCosmosPublicKeyFromUint8Array } from '../../../utils/key';
import { ConfigService } from '../../config.service';
import { KeyType } from '../../keys/key.model';
import { StoredWallet, WalletType } from '../wallet.model';
import { ILeapInfrastructureService } from './leap.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

interface Key {
  name: string;
  algo: string;
  pubKey: Uint8Array;
  address: Uint8Array;
  bech32Address: string;
  isNanoLedger: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LeapInfrastructureService implements ILeapInfrastructureService {
  constructor(
    private readonly loadingDialog: LoadingDialogService,
    private snackBar: MatSnackBar,
    private configService: ConfigService,
  ) {}
  private async getKey(): Promise<Key | undefined> {
    if (!window.leap) {
      // alert('Please install Leap extension');
      return;
    }
    const chainID = this.configService.configs[0].chainID;
    await window.leap.enable(chainID);

    const key = await window.leap.getKey(chainID);
    return key;
  }

  private async getExternalKey(id: string): Promise<Key | undefined> {
    if (!window.leap) {
      // alert('Please install Leap extension');
      return;
    }
    const externalChains = this.configService.configs[0].externalChains;
    if (!externalChains) {
      alert('There is no external chain data.');
      return;
    }
    const chainID = externalChains.find((chain) => chain.chainId === id)?.chainId;
    if (!chainID) {
      alert("this chain doesn't exist");
      return;
    }
    await window.leap.enable(chainID);

    const key = await window.leap.getKey(chainID);
    return key;
  }

  private async suggestChain(): Promise<void> {
    if (!window.leap) {
      alert('Please install Leap extension');
      return;
    }
    const chainId = this.configService.configs[0].chainID;
    const chainName = this.configService.configs[0].chainName;
    const rpc = this.configService.configs[0].websocketURL.replace('ws', 'http');
    const rest = this.configService.configs[0].restURL;
    const bip44 = { coinType: 118 };
    const bech32Config = {
      bech32PrefixAccAddr: this.configService.configs[0].bech32Prefix?.accAddr!,
      bech32PrefixAccPub: this.configService.configs[0].bech32Prefix?.accPub!,
      bech32PrefixValAddr: this.configService.configs[0].bech32Prefix?.valAddr!,
      bech32PrefixValPub: this.configService.configs[0].bech32Prefix?.valPub!,
      bech32PrefixConsAddr: this.configService.configs[0].bech32Prefix?.consAddr!,
      bech32PrefixConsPub: this.configService.configs[0].bech32Prefix?.consPub!,
    };
    const currencies = [
      {
        coinDenom: 'GUU',
        coinMinimalDenom: 'uguu',
        coinDecimals: 6,
        coinGeckoId: 'ununifi',
      },
    ];
    const feeCurrencies = [
      {
        coinDenom: 'GUU',
        coinMinimalDenom: 'uguu',
        coinDecimals: 6,
        coinGeckoId: 'ununifi',
      },
    ];
    const stakeCurrency = {
      coinDenom: 'GUU',
      coinMinimalDenom: 'uguu',
      coinDecimals: 6,
      coinGeckoId: 'ununifi',
    };
    const gasPriceStep = {
      low: 0,
      average: 0.01,
      high: 0.03,
    };
    const image =
      'https://raw.githubusercontent.com/cosmos/chain-registry/master/ununifi/images/ununifi.svg';

    const chainInfo = {
      chainId,
      chainName,
      rpc,
      rest,
      bip44,
      bech32Config,
      currencies,
      feeCurrencies,
      stakeCurrency,
      gasPriceStep,
      image,
    };
    await window.leap.experimentalSuggestChain(chainInfo);
  }

  private async suggestExternalChain(id: string): Promise<void> {
    if (!window.leap) {
      alert('Please install Leap extension');
      return;
    }
    const externalChains = this.configService.configs[0].externalChains;
    if (!externalChains) {
      alert('There is no external chain data.');
      return;
    }
    const chainInfo = externalChains.find((chain) => chain.chainId === id);
    if (!chainInfo) {
      alert("this chain doesn't exist");
      return;
    }
    await window.leap.experimentalSuggestChain(chainInfo);
  }

  private async suggestChainAndGetKey(): Promise<Key | undefined> {
    const dialogRefSuggestChainAndGetKey = this.loadingDialog.open('connecting to Leap...');
    try {
      await this.suggestChain();
    } catch (error) {
      console.error(error);
      const errorMessage = `Leap Connection failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      dialogRefSuggestChainAndGetKey.close();
      return;
    }
    let keyData: Key | undefined;
    try {
      keyData = await this.getKey();
    } catch (error) {
      console.error(error);
      const errorMessage = `Leap Connection failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
    } finally {
      dialogRefSuggestChainAndGetKey.close();
    }
    return keyData;
  }

  private async suggestExternalChainAndGetKey(id: string): Promise<Key | undefined> {
    const dialogRefSuggestChainAndGetKey = this.loadingDialog.open('connecting to Leap...');
    try {
      await this.suggestExternalChain(id);
    } catch (error) {
      console.error(error);
      const errorMessage = `Leap Connection failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      dialogRefSuggestChainAndGetKey.close();
      return;
    }
    let keyData: Key | undefined;
    try {
      keyData = await this.getExternalKey(id);
    } catch (error) {
      console.error(error);
      const errorMessage = `Leap Connection failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
    } finally {
      dialogRefSuggestChainAndGetKey.close();
    }
    return keyData;
  }

  private convertLeapKeyToStoredWallet(keyData: Key | undefined): StoredWallet | undefined {
    if (!keyData) {
      console.error('Fail.');
      return undefined;
    }
    const cosmosPublicKey = createCosmosPublicKeyFromUint8Array(KeyType.secp256k1, keyData.pubKey);
    if (!cosmosPublicKey) {
      console.error('Invalid Pubkey.');
      return;
    }
    const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const pubkey = Buffer.from(cosmosPublicKey.bytes()).toString('hex');
    const storedWallet: StoredWallet = {
      id: keyData.name,
      type: WalletType.leap,
      key_type: KeyType.secp256k1,
      public_key: pubkey,
      address: accAddress.toString(),
    };
    console.log(storedWallet);
    return storedWallet;
  }

  private async signDirect(
    signer: string,
    bodyBytes: Uint8Array,
    authInfoBytes: Uint8Array,
    accountNumber: Long,
  ): Promise<any | undefined> {
    const chainId = this.configService.configs[0].chainID;
    return this.sign(chainId, signer, bodyBytes, authInfoBytes, accountNumber);
  }

  private async signDirectExternal(
    id: string,
    signer: string,
    bodyBytes: Uint8Array,
    authInfoBytes: Uint8Array,
    accountNumber: Long,
  ): Promise<any | undefined> {
    const externalChains = this.configService.configs[0].externalChains;
    if (!externalChains) {
      alert('There is no external chain data.');
      return;
    }
    const chainId = externalChains.find((chain) => chain.chainId === id)?.chainId;
    if (!chainId) {
      alert("this chain doesn't exist");
      return;
    }
    return this.sign(chainId, signer, bodyBytes, authInfoBytes, accountNumber);
  }

  async sign(
    chainId: string,
    signer: string,
    bodyBytes: Uint8Array,
    authInfoBytes: Uint8Array,
    accountNumber: Long,
  ) {
    if (!window.leap) {
      alert('Please install Leap extension');
      return;
    }
    await window.leap.enable(chainId);
    const directSignResponse = await window.leap.signDirect(chainId, signer, {
      bodyBytes,
      authInfoBytes,
      chainId,
      accountNumber,
    });
    const signLeap: any = {
      authInfoBytes: directSignResponse.signed.authInfoBytes,
      bodyBytes: directSignResponse.signed.bodyBytes,
      signature: Uint8Array.from(Buffer.from(directSignResponse.signature.signature, 'base64')),
    };
    return signLeap;
  }

  async connectWallet(): Promise<StoredWallet | null | undefined> {
    const keyData = await this.suggestChainAndGetKey();
    const storedWallet = this.convertLeapKeyToStoredWallet(keyData);
    return storedWallet;
  }

  async connectExternalWallet(id: string): Promise<Key | undefined> {
    const keyData = await this.suggestExternalChainAndGetKey(id);
    return keyData;
  }

  async checkWallet(): Promise<StoredWallet | null | undefined> {
    const keyData = await this.getKey();
    const storedWallet = this.convertLeapKeyToStoredWallet(keyData);
    return storedWallet;
  }

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signDoc = txBuilder.signDoc(signerBaseAccount.account_number);
    const signLeap = await this.signDirect(
      signerBaseAccount.address,
      signDoc.body_bytes,
      signDoc.auth_info_bytes,
      signDoc.account_number,
    );
    if (!signLeap) {
      throw Error('Invalid signature!');
    }
    txBuilder.txRaw.auth_info_bytes = signLeap.authInfoBytes;
    txBuilder.txRaw.body_bytes = signLeap.bodyBytes;
    txBuilder.addSignature(signLeap.signature);

    return txBuilder;
  }

  async signTxExternal(
    id: string,
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signDoc = txBuilder.signDoc(signerBaseAccount.account_number);
    const signLeap = await this.signDirectExternal(
      id,
      signerBaseAccount.address,
      signDoc.body_bytes,
      signDoc.auth_info_bytes,
      signDoc.account_number,
    );
    if (!signLeap) {
      throw Error('Invalid signature!');
    }
    txBuilder.txRaw.auth_info_bytes = signLeap.authInfoBytes;
    txBuilder.txRaw.body_bytes = signLeap.bodyBytes;
    txBuilder.addSignature(signLeap.signature);

    return txBuilder;
  }
}
