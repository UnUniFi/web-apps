import { ConfigService } from '../config.service';
import { BankQueryService } from '../cosmos/bank.query.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { WalletService } from '../wallets/wallet.service';
import { YieldAggregatorService } from './yield-aggregator.service';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorApplicationService {
  constructor(
    private readonly walletService: WalletService,
    private readonly bankQueryService: BankQueryService,
    private readonly yieldAggregatorService: YieldAggregatorService,
    private readonly txCommon: TxCommonService,
    private readonly config: ConfigService,
  ) {}

  async deposit(symbol: string, amount: number) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();
    const gasRatio = 1.1;

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();
  }

  async withdraw(symbol: string, amount: number) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();
    const gasRatio = 1.1;

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();
  }
}
