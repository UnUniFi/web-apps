import { CosmosSDKService } from '../cosmos-sdk.service';
import { CosmosWallet } from '../wallets/wallet.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import Decimal from 'decimal.js';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly txCommonService: TxCommonService,
  ) {}

  convertSymbolAmountMapToCoins(
    symbolAmountMap: { [symbol: string]: number },
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): cosmosclient.proto.cosmos.base.v1beta1.ICoin[] {
    const coins = Object.keys(symbolAmountMap).map((symbol) => {
      const denom = symbolMetadataMap[symbol].base!;
      const denomUnit = symbolMetadataMap[symbol].denom_units?.find((unit) => unit.denom === denom);
      if (!denomUnit) {
        throw Error();
      }

      const amount = symbolAmountMap[symbol].toFixed(denomUnit.exponent!).replace('.', '');
      return {
        denom,
        amount: parseInt(amount).toString(),
      } as cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    });

    return coins;
  }

  convertCoinsToSymbolAmount(
    coins: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
    denomMetadataMap: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): { [symbol: string]: number } {
    const map: { [symbol: string]: number } = {};
    coins.map((b) => {
      const metadata = denomMetadataMap[b.denom!];
      const denomUnit = metadata.denom_units?.find((u) => u.denom === b.denom);

      if (denomUnit) {
        const amount = new Decimal(b.amount!);
        map[metadata.symbol!] = Number(
          amount.dividedBy(new Decimal(10 ** denomUnit.exponent!)).toFixed(6),
        );
      }
    });
    return map;
  }

  async simulateToSend(
    fromAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    toAddress: cosmosclient.AccAddress,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildSendTxBuilder(
      fromAccount,
      toAddress,
      amount,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async send(
    fromAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    toAddress: cosmosclient.AccAddress,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;

    const txBuilder = await this.buildSendTxBuilder(
      fromAccount,
      toAddress,
      amount,
      cosmosPublicKey,
      gas,
      fee,
    );

    const signedTxBuilder = await this.txCommonService.signTx(
      txBuilder,
      fromAccount,
      currentCosmosWallet,
      privateKey,
    );
    if (!signedTxBuilder) {
      throw Error('Failed to sign!');
    }
    const txResult = await this.txCommonService.announceTx(signedTxBuilder);
    return txResult;
  }

  async buildSendTxBuilder(
    fromAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    toAddress: cosmosclient.AccAddress,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const fromAddress = cosmosclient.AccAddress.fromString(fromAccount.address);

    const msgSend = this.buildMsgSend(fromAddress, toAddress, amount);

    // build tx
    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgSend],
      cosmosPublicKey,
      fromAccount,
      gas,
      fee,
    );

    return txBuilder;
  }

  buildMsgSend(
    fromAddress: cosmosclient.AccAddress,
    toAddress: cosmosclient.AccAddress,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
  ): cosmosclient.proto.cosmos.bank.v1beta1.MsgSend {
    const msgSend = new cosmosclient.proto.cosmos.bank.v1beta1.MsgSend({
      from_address: fromAddress.toString(),
      to_address: toAddress.toString(),
      amount,
    });
    return msgSend;
  }

  buildMsgBankSend(
    fromAddress: string,
    toAddress: string,
    symbolAmounts: { symbol: string; amount: number }[],
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): cosmosclient.proto.cosmos.bank.v1beta1.MsgSend {
    const map: { [symbol: string]: number } = {};
    for (const s of symbolAmounts) {
      map[s.symbol] = s.amount;
    }
    const coins = this.convertSymbolAmountMapToCoins(map, symbolMetadataMap);
    const msgSend = new cosmosclient.proto.cosmos.bank.v1beta1.MsgSend({
      from_address: fromAddress,
      to_address: toAddress,
      amount: coins,
    });
    return msgSend;
  }
}
