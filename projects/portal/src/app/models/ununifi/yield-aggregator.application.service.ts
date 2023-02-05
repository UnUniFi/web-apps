import { ConfigService } from '../config.service';
import { BankQueryService } from '../cosmos/bank.query.service';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { WalletService } from '../wallets/wallet.service';
import { YieldAggregatorService } from './yield-aggregator.service';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly walletService: WalletService,
    private readonly bankQueryService: BankQueryService,
    private readonly yieldAggregatorService: YieldAggregatorService,
    private readonly txCommon: TxCommonService,
    private readonly txCommonApplication: TxCommonApplicationService,
    private readonly config: ConfigService,
  ) {}

  async deposit(symbol: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.yieldAggregatorService.buildMsgDeposit(
      address,
      symbol,
      amount,
      symbolMetadataMap,
    );

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully listed NFT.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async withdraw(symbol: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.yieldAggregatorService.buildMsgWithdraw(
      address,
      symbol,
      amount,
      symbolMetadataMap,
    );

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully listed NFT.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }
}
