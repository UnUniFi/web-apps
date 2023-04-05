import { CosmosSDKService } from '../cosmos-sdk.service';
import { BankService } from '../cosmos/bank.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class DerivativesService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly txCommonService: TxCommonService,
    private readonly bankService: BankService,
  ) {}

  getMarginSymbol(
    baseSymbol: string,
    quoteSymbol: string,
    positionType: ununificlient.proto.ununifi.derivatives.PositionType,
  ) {
    switch (positionType) {
      case ununificlient.proto.ununifi.derivatives.PositionType.LONG:
        return quoteSymbol;
      case ununificlient.proto.ununifi.derivatives.PositionType.SHORT:
        return baseSymbol;
      default:
        throw Error('');
    }
  }

  buildMsgMintLiquidityProviderToken(
    senderAddress: string,
    symbol: string,
    amount: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
    )[0];

    const msgMintLiquidityProviderToken =
      new ununificlient.proto.ununifi.derivatives.MsgDepositToPool({
        sender: senderAddress,
        amount: coin,
      });
    return msgMintLiquidityProviderToken;
  }

  buildMsgBurnLiquidityProviderToken(
    senderAddress: string,
    amount: number,
    redeemSymbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const symbol = 'DLP';
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
    )[0];

    const redeemDenom = symbolMetadataMap?.[redeemSymbol].base;

    const msgMintLiquidityProviderToken =
      new ununificlient.proto.ununifi.derivatives.MsgWithdrawFromPool({
        sender: senderAddress,
        lpt_amount: coin.amount,
        redeem_denom: redeemDenom,
      });
    return msgMintLiquidityProviderToken;
  }

  buildPerpetualFuturesPositionInstance(
    positionType: ununificlient.proto.ununifi.derivatives.PositionType,
    size: number,
    leverage: number,
  ) {
    const perpetualFuturesPositionInstance =
      new ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance({
        position_type: positionType,
        size: this.txCommonService.numberToDecString(size),
        leverage: Math.floor(leverage),
      });
    return perpetualFuturesPositionInstance;
  }

  buildMsgOpenPosition(
    senderAddress: string,
    marginSymbol: string,
    marginAmount: number,
    baseSymbol: string,
    quoteSymbol: string,
    positionInstance: cosmosclient.proto.google.protobuf.IAny,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const margin = this.bankService.convertSymbolAmountMapToCoins(
      { [marginSymbol]: marginAmount },
      symbolMetadataMap,
    )[0];

    const msgOpenPosition = new ununificlient.proto.ununifi.derivatives.MsgOpenPosition({
      sender: senderAddress,
      margin,
      market: {
        base_denom: symbolMetadataMap?.[baseSymbol].base,
        quote_denom: symbolMetadataMap?.[quoteSymbol].base,
      },
      position_instance: positionInstance,
    });
    return msgOpenPosition;
  }

  buildMsgClosePosition(senderAddress: string, positionId: string) {
    const msgClosePosition = new ununificlient.proto.ununifi.derivatives.MsgClosePosition({
      sender: senderAddress,
      position_id: positionId,
    });
    return msgClosePosition;
  }
}
