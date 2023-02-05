import { BankService } from '../cosmos/bank.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorService {
  constructor(private readonly bankService: BankService) {}

  buildMsgDeposit(
    senderAddress: string,
    symbol: string,
    amount: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
    )[0];
  }

  buildMsgWithdraw(
    senderAddress: string,
    symbol: string,
    amount: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
    )[0];
  }
}
