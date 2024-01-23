import { BankService } from '../cosmos/bank.service';
import { Injectable } from '@angular/core';
import Long from 'long';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class IrsService {
  constructor(private readonly bankService: BankService) {}

  buildMsgDepositLiquidity(
    senderAddress: string,
    trancheId: string,
    shareOutReadableAmount: number,
    shareOutDenom: string,
    readableAmountMapInMax?: { [denom: string]: number },
  ): ununificlient.proto.ununifi.irs.MsgDepositLiquidity {
    const coins = readableAmountMapInMax
      ? this.bankService.convertDenomReadableAmountMapToCoins(readableAmountMapInMax)
      : undefined;
    const shareOut = this.bankService.convertDenomReadableAmountMapToCoins({
      [shareOutDenom]: shareOutReadableAmount,
    })[0];
    const msg = new ununificlient.proto.ununifi.irs.MsgDepositLiquidity({
      sender: senderAddress,
      tranche_id: Long.fromString(trancheId),
      share_out_amount: shareOut.amount,
      token_in_maxs: coins,
    });
    return msg;
  }

  buildMsgWithdrawLiquidity(
    senderAddress: string,
    trancheId: string,
    shareInDenom: string,
    shareInReadableAmount: number,
    readableAmountMapOutMin?: { [denom: string]: number },
  ): ununificlient.proto.ununifi.irs.MsgWithdrawLiquidity {
    const coins = readableAmountMapOutMin
      ? this.bankService.convertDenomReadableAmountMapToCoins(readableAmountMapOutMin)
      : undefined;
    const share = this.bankService.convertDenomReadableAmountMapToCoins({
      [shareInDenom]: shareInReadableAmount,
    })[0];
    const msg = new ununificlient.proto.ununifi.irs.MsgWithdrawLiquidity({
      sender: senderAddress,
      tranche_id: Long.fromString(trancheId),
      share_amount: share.amount,
      token_out_mins: coins,
    });
    return msg;
  }

  buildMsgDepositToTranche(
    senderAddress: string,
    trancheId: string,
    TrancheType: ununificlient.proto.ununifi.irs.TrancheType,
    denom: string,
    readableAmount: number,
    requiredYT?: number,
  ) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [denom]: readableAmount,
    })[0];
    const ytDenom = 'irs/tranche/' + trancheId + '/yt';
    const requiredYTAmount = requiredYT
      ? this.bankService.convertDenomReadableAmountMapToCoins({
          [ytDenom]: requiredYT,
        })[0].amount
      : '0';
    const msg = new ununificlient.proto.ununifi.irs.MsgDepositToTranche({
      sender: senderAddress,
      tranche_id: Long.fromString(trancheId),
      tranche_type: TrancheType,
      token: coin,
      required_yt: requiredYTAmount,
    });
    return msg;
  }

  buildMsgWithdrawFromTranche(
    senderAddress: string,
    trancheId: string,
    TrancheType: ununificlient.proto.ununifi.irs.TrancheType,
    readableAmountMap: { [denom: string]: number },
    denom?: string,
    requiredUT?: number,
  ) {
    const coins = this.bankService.convertDenomReadableAmountMapToCoins(readableAmountMap);
    const requiredUTAmount =
      requiredUT && denom
        ? this.bankService.convertDenomReadableAmountMapToCoins({
            [denom]: requiredUT,
          })[0].amount
        : '0';
    const msg = new ununificlient.proto.ununifi.irs.MsgWithdrawFromTranche({
      sender: senderAddress,
      tranche_id: Long.fromString(trancheId),
      tranche_type: TrancheType,
      tokens: coins,
      required_ut: requiredUTAmount,
    });
    return msg;
  }
}
