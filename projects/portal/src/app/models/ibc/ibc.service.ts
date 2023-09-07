import { BankService } from '../cosmos/bank.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import ibcclient from '@cosmos-client/ibc';
import Long from 'long';

@Injectable({
  providedIn: 'root',
})
export class IbcService {
  constructor(private readonly bankService: BankService) {}

  buildMsgTransfer(
    sourcePort: string,
    sourceChannel: string,
    sender: string,
    receiver: string,
    memo: any,
    timeoutTimestamp: number,
    timeoutHeight?: {
      revisionNumber: number;
      revisionHeight: number;
    },
    amount?: { denom: string; readableAmount: number },
  ) {
    let coin: cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined;
    if (!amount) {
      coin = undefined;
    } else {
      coin = this.bankService.convertDenomReadableAmountMapToCoins({
        [amount.denom]: amount.readableAmount,
      })[0];
    }
    let IHeightTimeout: ibcclient.ibcproto.ibc.core.client.v1.IHeight | undefined;
    if (!timeoutHeight) {
      IHeightTimeout = undefined;
    } else {
      IHeightTimeout = {
        revision_number: Long.fromNumber(timeoutHeight.revisionNumber),
        revision_height: Long.fromNumber(timeoutHeight.revisionHeight),
      };
    }

    const memoString = JSON.stringify(memo);
    const msg = new ibcclient.ibcproto.ibc.applications.transfer.v1.MsgTransfer({
      source_port: sourcePort,
      source_channel: sourceChannel,
      token: coin,
      sender,
      receiver,
      timeout_height: IHeightTimeout,
      timeout_timestamp: Long.fromNumber(timeoutTimestamp),
      memo: memoString,
    });
    return msg;
  }
}
