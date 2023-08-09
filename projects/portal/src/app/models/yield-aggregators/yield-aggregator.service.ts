import { getDenomExponent } from '../cosmos/bank.model';
import { BankQueryService } from '../cosmos/bank.query.service';
import { BankService } from '../cosmos/bank.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import Long from 'long';
import { Observable } from 'rxjs';
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
  ) {}

  buildMsgDepositToVault(
    senderAddress: string,
    vaultId: string,
    symbol: string,
    amount: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
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
    symbol: string,
    amount: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
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
    symbol: string,
    strategies: { id: string; weight: number }[],
    commissionRate: number,
    reserveRate: number,
    fee: number,
    feeSymbol: string,
    deposit: number,
    depositSymbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const denom = symbolMetadataMap[symbol].base;
    const coinDeposit = this.bankService.convertSymbolAmountMapToCoins(
      { [depositSymbol]: deposit },
      symbolMetadataMap,
    )[0];
    const coinFee = this.bankService.convertSymbolAmountMapToCoins(
      { [feeSymbol]: fee },
      symbolMetadataMap,
    )[0];
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
      commission_rate: decCommission,
      withdraw_reserve_rate: decReserve,
      strategy_weights: strategyWeights,
      fee: coinFee,
      deposit: coinDeposit,
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
    const lpDenom = 'yield-aggregator/vaults/' + vault?.vault?.id;
    const exponent = getDenomExponent(vault.vault?.denom);
    const mintDenomAmount = mintAmount * Math.pow(10, exponent);
    const totalAmountInVault =
      Number(vault.total_bonded_amount) +
      Number(vault.total_unbonding_amount) +
      Number(vault.total_withdrawal_balance);
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
    const lpDenom = 'yield-aggregator/vaults/' + vault?.vault?.id;
    const exponent = getDenomExponent(vault.vault?.denom);
    const burnDenomAmount = burnAmount * Math.pow(10, exponent);
    const totalAmountInVault =
      Number(vault.total_bonded_amount) +
      Number(vault.total_unbonding_amount) +
      Number(vault.total_withdrawal_balance);
    const supplyLp$ = this.bankQueryService.getSupply$(lpDenom);
    return supplyLp$.pipe(
      map((supplyLp) => {
        if (!totalAmountInVault || !supplyLp || !supplyLp.amount || !parseInt(supplyLp.amount)) {
          return { denom: lpDenom, amount: '0' };
        }
        // principalAmount = principalAmountInVault * (lpAmountToBurn / lpSupply)
        const redeemAmount = (burnDenomAmount * totalAmountInVault) / parseInt(supplyLp.amount);
        return { denom: lpDenom, amount: redeemAmount.toString() };
      }),
    );
  }
}
