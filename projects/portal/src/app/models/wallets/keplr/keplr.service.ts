import { ConfigService } from '../../config.service';
import { Injectable } from '@angular/core';
import { AccountData } from '@cosmjs/launchpad';
import { ChainInfo, Key, Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

@Injectable({
  providedIn: 'root',
})
export class KeplrService {
  constructor(private configService: ConfigService) {}

  async getAccounts(): Promise<readonly AccountData[] | undefined> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
      const chainID = await this.configService.configs[0].chainID;
      await window.keplr?.enable(chainID);

      const offlineSigner = window.keplr?.getOfflineSigner(chainID);
      return offlineSigner?.getAccounts();
    }
  }

  async getKey(): Promise<Key | undefined> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
      const chainID = await this.configService.configs[0].chainID;
      await window.keplr?.enable(chainID);

      const key = await window.keplr?.getKey(chainID);
      if (!key) {
        window.keplr;
      }
      return key;
    }
  }

  async suggestChain(): Promise<void> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
      const chainID = await this.configService.configs[0].chainID;
      await window.keplr?.enable(chainID);

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
      await window.keplr?.experimentalSuggestChain({
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
      });
    }
  }
}
