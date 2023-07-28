import { createCosmosPublicKeyFromUint8Array } from '../../../utils/key';
import { ConfigService } from '../../config.service';
import { KeyType } from '../../keys/key.model';
import { StoredWallet, WalletType } from '../wallet.model';
import { IKeplrInfrastructureService } from './keplr.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { ChainInfo, Key } from '@keplr-wallet/types';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

export interface signKeplr {
  authInfoBytes: Uint8Array;
  bodyBytes: Uint8Array;
  signature: Uint8Array;
}

@Injectable({
  providedIn: 'root',
})
export class KeplrInfrastructureService implements IKeplrInfrastructureService {
  constructor(
    private readonly loadingDialog: LoadingDialogService,
    private snackBar: MatSnackBar,
    private configService: ConfigService,
  ) {}

  private async getKey(): Promise<Key | undefined> {
    if (!window.keplr) {
      alert('Please install Keplr extension');
      return;
    }
    const chainID = this.configService.configs[0].chainID;
    await window.keplr?.enable(chainID);

    const key = await window.keplr?.getKey(chainID);
    return key;
  }

  private async suggestChain(): Promise<void> {
    if (!window.keplr) {
      alert('Please install Keplr extension');
      return;
    }
    const chainId = this.configService.configs[0].chainID;
    const chainName = this.configService.configs[0].chainName;
    const rpc = this.configService.configs[0].websocketURL;
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
    const chainInfo: ChainInfo = {
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
    };
    await window.keplr?.experimentalSuggestChain(chainInfo);
  }

  private async suggestChainAndGetKey(): Promise<Key | undefined> {
    const dialogRefSuggestChainAndGetKey = this.loadingDialog.open('connecting to Keplr...');
    try {
      await this.suggestChain();
    } catch (error) {
      console.error(error);
      const errorMessage = `Keplr Connection failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      dialogRefSuggestChainAndGetKey.close();
      return;
    }
    let keyData: Key | undefined;
    try {
      keyData = await this.getKey();
    } catch (error) {
      console.error(error);
      const errorMessage = `Keplr Connection failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
    } finally {
      dialogRefSuggestChainAndGetKey.close();
    }
    return keyData;
  }

  private convertKeplrKeyToStoredWallet(keyData: Key | undefined): StoredWallet | undefined {
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
      type: WalletType.Keplr,
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
  ): Promise<signKeplr | undefined> {
    if (!window.keplr) {
      alert('Please install Keplr extension');
      return;
    }
    const chainId = this.configService.configs[0].chainID;
    await window.keplr?.enable(chainId);
    const directSignResponse = await window.keplr.signDirect(chainId, signer, {
      bodyBytes,
      authInfoBytes,
      chainId,
      accountNumber,
    });
    const signKeplr: signKeplr = {
      authInfoBytes: directSignResponse.signed.authInfoBytes,
      bodyBytes: directSignResponse.signed.bodyBytes,
      signature: Uint8Array.from(Buffer.from(directSignResponse.signature.signature, 'base64')),
    };
    return signKeplr;
  }

  async connectWallet(): Promise<StoredWallet | null | undefined> {
    const keyData = await this.suggestChainAndGetKey();
    const storedWallet = this.convertKeplrKeyToStoredWallet(keyData);
    return storedWallet;
  }

  async checkWallet(): Promise<StoredWallet | null | undefined> {
    const keyData = await this.getKey();
    const storedWallet = this.convertKeplrKeyToStoredWallet(keyData);
    return storedWallet;
  }

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const signDoc = txBuilder.signDoc(signerBaseAccount.account_number);
    const signKeplr = await this.signDirect(
      signerBaseAccount.address,
      signDoc.body_bytes,
      signDoc.auth_info_bytes,
      signDoc.account_number,
    );
    if (!signKeplr) {
      throw Error('Invalid signature!');
    }
    txBuilder.txRaw.auth_info_bytes = signKeplr.authInfoBytes;
    txBuilder.txRaw.body_bytes = signKeplr.bodyBytes;
    txBuilder.addSignature(signKeplr.signature);

    return txBuilder;
  }
}
