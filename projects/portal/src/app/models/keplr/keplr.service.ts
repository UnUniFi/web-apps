import { ConfigService } from '../config.service';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { BroadcastMode, decodeSignature } from '@cosmjs/launchpad';
import { ChainInfo, Key, Window as KeplrWindow } from '@keplr-wallet/types';

export interface signKeplr {
  authInfoBytes: Uint8Array;
  bodyBytes: Uint8Array;
  signature: Uint8Array;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

@Injectable({
  providedIn: 'root',
})
export class KeplrService {
  constructor(private readonly cosmosSDK: CosmosSDKService, private configService: ConfigService) {}

  async getKey(): Promise<Key | undefined> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
      const chainID = this.configService.configs[0].chainID;
      await window.keplr?.enable(chainID);

      const key = await window.keplr?.getKey(chainID);
      return key;
    }
  }

  async suggestChain(): Promise<void> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
      const chainId = this.configService.configs[0].chainID;
      const chainName = this.configService.configs[0].chainID;
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
      const coinType = 118;
      const gasPriceStep = {
        low: 0.01,
        average: 0.025,
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
        coinType,
        gasPriceStep,
      };
      await window.keplr?.experimentalSuggestChain(chainInfo);
    }
  }

  async signDirect(
    signer: string,
    bodyBytes: Uint8Array,
    authInfoBytes: Uint8Array,
    accountNumber: Long,
  ): Promise<signKeplr | undefined> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
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
        signature: decodeSignature(directSignResponse.signature).signature,
      };
      return signKeplr;
    }
  }
}
