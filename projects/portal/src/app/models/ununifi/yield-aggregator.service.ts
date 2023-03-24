import { BankService } from '../cosmos/bank.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import Long from 'long';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorService {
  constructor(private readonly bankService: BankService) {}

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
    const msg = new ununificlient.proto.ununifi.chain.yieldaggregator.MsgDepositToVault({
      sender: senderAddress,
      vault_id: Long.fromString(vaultId),
      amount: coin,
    });

    return msg;
  }

  buildMsgWithdrawFromVault(
    senderAddress: string,
    vaultId: string,
    amount: number,
    // symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    // const coin = this.bankService.convertSymbolAmountMapToCoins(
    //   { [symbol]: amount },
    //   symbolMetadataMap,
    // )[0];
    const msg = new ununificlient.proto.ununifi.chain.yieldaggregator.MsgWithdrawFromVault({
      sender: senderAddress,
      vault_id: Long.fromString(vaultId),
      lp_token_amount: amount.toString(),
    });

    return msg;
  }

  buildMsgCreateVault(
    senderAddress: string,
    symbol: string,
    strategies: { id: string; weight: number }[],
    commissionRate: number,
    fee: number,
    deposit: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coinDeposit = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: deposit },
      symbolMetadataMap,
    )[0];
    const coinFee = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: fee },
      symbolMetadataMap,
    )[0];
    const strategyWeights = strategies.map((strategy) => {
      return {
        strategy_id: Long.fromString(strategy.id),
        weight: (strategy.weight / 100).toString(),
      };
    });
    const msg = new ununificlient.proto.ununifi.chain.yieldaggregator.MsgCreateVault({
      sender: senderAddress,
      denom: coinDeposit.denom,
      commission_rate: commissionRate.toString(),
      strategy_weights: strategyWeights,
      fee: coinFee,
      deposit: coinDeposit,
    });
    return msg;
  }

  buildMsgDeleteVault(senderAddress: string, vaultId: string) {
    const msg = new ununificlient.proto.ununifi.chain.yieldaggregator.MsgDeleteVault({
      sender: senderAddress,
      vault_id: Long.fromString(vaultId),
    });

    return msg;
  }

  buildMsgTransferVaultOwnership(senderAddress: string, vaultId: string, recipientAddress: string) {
    const msg = new ununificlient.proto.ununifi.chain.yieldaggregator.MsgTransferVaultOwnership({
      sender: senderAddress,
      vault_id: Long.fromString(vaultId),
      recipient: recipientAddress,
    });

    return msg;
  }
}
