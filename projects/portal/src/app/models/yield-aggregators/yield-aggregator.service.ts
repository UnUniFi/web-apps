import { StrategyInfo } from '../config.service';
import { getDenomExponent } from '../cosmos/bank.model';
import { BankQueryService } from '../cosmos/bank.query.service';
import { BankService } from '../cosmos/bank.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { OsmosisPools } from './yield-aggregator.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import Long from 'long';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import ununificlient from 'ununifi-client';
import { Vault200Response } from 'ununifi-client/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorService {
  constructor(
    private readonly bankService: BankService,
    private readonly bankQueryService: BankQueryService,
    private readonly txCommonService: TxCommonService,
    private http: HttpClient,
  ) {}

  buildMsgDepositToVault(
    senderAddress: string,
    vaultId: string,
    denom: string,
    readableAmount: number,
    denomMetadataMap: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins(
      { [denom]: readableAmount },
      denomMetadataMap,
    )[0];
    const msg = new ununificlient.proto.ununifi.yieldaggregator.MsgDepositToVault({
      sender: senderAddress,
      vault_id: Long.fromString(vaultId),
      amount: coin,
    });

    return msg;
  }

  buildMsgWithdrawFromVault(
    senderAddress: string,
    vaultId: string,
    denom: string,
    readableAmount: number,
    denomMetadataMap: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins(
      { [denom]: readableAmount },
      denomMetadataMap,
    )[0];
    const msg = new ununificlient.proto.ununifi.yieldaggregator.MsgWithdrawFromVault({
      sender: senderAddress,
      vault_id: Long.fromString(vaultId),
      lp_token_amount: coin.amount,
    });

    return msg;
  }

  buildMsgCreateVault(
    senderAddress: string,
    denom: string,
    name: string,
    description: string,
    strategies: { id: string; weight: number }[],
    commissionRate: number,
    reserveRate: number,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    deposit: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    feeCollectorAddress: string,
  ) {
    const strategyWeights = strategies.map((strategy) => {
      return {
        strategy_id: Long.fromString(strategy.id),
        weight: this.txCommonService.numberToDecString(strategy.weight / 100),
      };
    });
    const decCommission = this.txCommonService.numberToDecString(commissionRate / 100);
    const decReserve = this.txCommonService.numberToDecString(reserveRate / 100);
    const msg = new ununificlient.proto.ununifi.yieldaggregator.MsgCreateVault({
      sender: senderAddress,
      denom: denom,
      name: name,
      description: description,
      commission_rate: decCommission,
      withdraw_reserve_rate: decReserve,
      strategy_weights: strategyWeights,
      fee,
      deposit,
      fee_collector_address: feeCollectorAddress,
    });
    return msg;
  }

  buildMsgDeleteVault(senderAddress: string, vaultId: string) {
    const msg = new ununificlient.proto.ununifi.yieldaggregator.MsgDeleteVault({
      sender: senderAddress,
      vault_id: Long.fromString(vaultId),
    });

    return msg;
  }

  buildMsgTransferVaultOwnership(senderAddress: string, vaultId: string, recipientAddress: string) {
    const msg = new ununificlient.proto.ununifi.yieldaggregator.MsgTransferVaultOwnership({
      sender: senderAddress,
      vault_id: Long.fromString(vaultId),
      recipient: recipientAddress,
    });

    return msg;
  }

  estimateMintAmount$(
    vault: Vault200Response,
    mintAmount: number,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    const lpDenom = 'yieldaggregator/vaults/' + vault?.vault?.id;
    const exponent = getDenomExponent(vault.vault?.denom);
    const mintDenomAmount = mintAmount * Math.pow(10, exponent);
    const totalAmountInVault =
      Number(vault.total_bonded_amount) +
      Number(vault.total_unbonding_amount) +
      Number(vault.withdraw_reserve);
    const supplyLp$ = this.bankQueryService.getSupply$(lpDenom);
    return supplyLp$.pipe(
      map((supplyLp) => {
        if (!totalAmountInVault || !supplyLp || !supplyLp.amount || !parseInt(supplyLp.amount)) {
          return { denom: lpDenom, amount: mintDenomAmount.toString() };
        }
        // lpAmount = lpSupply * (principalAmountToMint / principalAmountInVault)
        const mintLp = (mintDenomAmount * parseInt(supplyLp.amount)) / totalAmountInVault;
        return { denom: lpDenom, amount: mintLp.toString() };
      }),
    );
  }

  estimateRedeemAmount$(
    vault: Vault200Response,
    burnAmount: number,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    const denom = vault.vault?.denom;
    const lpDenom = 'yieldaggregator/vaults/' + vault?.vault?.id;
    const exponent = getDenomExponent(lpDenom);
    const burnDenomAmount = burnAmount * Math.pow(10, exponent);
    const totalAmountInVault =
      Number(vault.total_bonded_amount) +
      Number(vault.total_unbonding_amount) +
      Number(vault.withdraw_reserve);
    const supplyLp$ = this.bankQueryService.getSupply$(lpDenom);
    return supplyLp$.pipe(
      map((supplyLp) => {
        if (!totalAmountInVault || !supplyLp || !supplyLp.amount || !parseInt(supplyLp.amount)) {
          return { denom: denom, amount: '0' };
        }
        // principalAmount = principalAmountInVault * (lpAmountToBurn / lpSupply)
        const redeemAmount = (burnDenomAmount * totalAmountInVault) / parseInt(supplyLp.amount);
        return { denom: denom, amount: redeemAmount.toString() };
      }),
    );
  }

  async getOsmoPoolAPY(poolId: string): Promise<number> {
    const url = 'https://api-osmosis.imperator.co/apr/v2/' + poolId;
    return this.http
      .get(url)
      .toPromise()
      .then((res: any) => {
        const pools = res as OsmosisPools;
        let totalApr = 0;
        for (const pool of pools) {
          for (const apr of pool.apr_list) {
            totalApr += apr.apr_superfluid;
          }
        }
        return totalApr / 100;
      });
  }

  async getStrategyAPR(strategyInfo?: StrategyInfo): Promise<number> {
    if (!strategyInfo) {
      return 0;
    }
    if (strategyInfo.poolInfo) {
      if (strategyInfo.poolInfo.type === 'osmosis') {
        return this.getOsmoPoolAPY(strategyInfo.poolInfo.poolId);
      }
    }
    return strategyInfo.apy || 0;
  }
}
