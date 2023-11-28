import { BankService } from '../cosmos/bank.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InterestRateSwapService {
  constructor(private readonly bankService: BankService) {}

  buildMsgMintLP(senderAddress: string, denom: string, readableAmount: string) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [denom]: Number(readableAmount),
    })[0];
    // todo: impl msg
    const msg = {
      sender: senderAddress,
      amount: coin,
    };

    return msg;
  }

  buildMsgRedeemLP(senderAddress: string, denom: string, readableAmount: string) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [denom]: Number(readableAmount),
    })[0];
    // todo: impl msg
    const msg = {
      sender: senderAddress,
      amount: coin,
    };

    return msg;
  }

  buildMsgMintYT(senderAddress: string, denom: string, readableAmount: string) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [denom]: Number(readableAmount),
    })[0];
    // todo: impl msg
    const msg = {
      sender: senderAddress,
      amount: coin,
    };

    return msg;
  }

  buildMsgRedeemYT(senderAddress: string, denom: string, readableAmount: string) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [denom]: Number(readableAmount),
    })[0];
    // todo: impl msg
    const msg = {
      sender: senderAddress,
      amount: coin,
    };

    return msg;
  }

  buildMsgMintPT(senderAddress: string, denom: string, readableAmount: string) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [denom]: Number(readableAmount),
    })[0];
    // todo: impl msg
    const msg = {
      sender: senderAddress,
      amount: coin,
    };

    return msg;
  }

  buildMsgRedeemPT(senderAddress: string, denom: string, readableAmount: string) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [denom]: Number(readableAmount),
    })[0];
    // todo: impl msg
    const msg = {
      sender: senderAddress,
      amount: coin,
    };

    return msg;
  }

  buildMsgMintPTYT(senderAddress: string, denom: string, readableAmount: string) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [denom]: Number(readableAmount),
    })[0];
    // todo: impl msg
    const msg = {
      sender: senderAddress,
      amount: coin,
    };

    return msg;
  }

  buildMsgRedeemPTYT(
    senderAddress: string,
    ptDenom: string,
    ptReadableAmount: string,
    ytDenom: string,
    ytReadableAmount: string,
  ) {
    const pt = this.bankService.convertDenomReadableAmountMapToCoins({
      [ptDenom]: Number(ptReadableAmount),
    })[0];
    const yt = this.bankService.convertDenomReadableAmountMapToCoins({
      [ytDenom]: Number(ytReadableAmount),
    })[0];
    // todo: impl msg
    const msg = {
      sender: senderAddress,
      pt_amount: pt,
      yt_amount: yt,
    };

    return msg;
  }
}
