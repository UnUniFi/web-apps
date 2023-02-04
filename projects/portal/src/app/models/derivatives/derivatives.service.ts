import { CosmosSDKService } from '../cosmos-sdk.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { KeyService } from '../keys/key.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class DerivativesService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly txCommonService: TxCommonService,
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
    const bankService = {} as any;
    const coin = (
      bankService.convert(
        symbol,
        amount,
        symbolMetadataMap,
      ) as cosmosclient.proto.cosmos.base.v1beta1.ICoin[]
    )[0]; // DERIVATIVES_TODO

    const msgMintLiquidityProviderToken =
      new ununificlient.proto.ununifi.derivatives.MsgMintLiquidityProviderToken({
        sender: senderAddress,
        amount: coin,
      });
    return msgMintLiquidityProviderToken;
  }

  buildMsgBurnLiquidityProviderToken(
    senderAddress: string,
    amount: number,
    returnSymbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const bankService = {} as any;
    const symbol = 'DLP';
    const coin = (
      bankService.convert(
        symbol,
        amount,
        symbolMetadataMap,
      ) as cosmosclient.proto.cosmos.base.v1beta1.ICoin[]
    )[0]; // DERIVATIVES_TODO

    const msgMintLiquidityProviderToken =
      new ununificlient.proto.ununifi.derivatives.MsgBurnLiquidityProviderToken({
        sender: senderAddress,
        amount: coin.amount,
        // return_denom: returnDenom,
      });
    return msgMintLiquidityProviderToken;
  }

  buildPerpetualFuturesPositionInstance(
    baseSymbol: string,
    positionType: ununificlient.proto.ununifi.derivatives.PositionType,
    size: number,
    leverage: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const bankService = {} as any;
    const position = (
      bankService.convert(
        baseSymbol,
        size,
        symbolMetadataMap,
      ) as cosmosclient.proto.cosmos.base.v1beta1.ICoin[]
    )[0]; // DERIVATIVES_TODO

    const perpetualFuturesPositionInstance =
      new ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance({
        position_type: positionType,
        size: position.amount,
        leverage: Math.floor(leverage).toString(), // DERIVATIVES_TODO: remove toString
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
    const bankService = {} as any;
    const margin = (
      bankService.convert(
        marginSymbol,
        marginAmount,
        symbolMetadataMap,
      ) as cosmosclient.proto.cosmos.base.v1beta1.ICoin[]
    )[0]; // DERIVATIVES_TODO
    const msgOpenPosition = new ununificlient.proto.ununifi.derivatives.MsgOpenPosition({
      sender: senderAddress,
      margin,
      market: {
        denom: symbolMetadataMap?.[baseSymbol].base, // DERIVATIVES_TODO: base_denom
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
