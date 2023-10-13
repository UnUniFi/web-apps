import { convertHexStringToUint8Array } from '../../utils/converter';
import { BankService } from '../cosmos/bank.service';
import { Injectable } from '@angular/core';
import cosmwasmclient from '@cosmos-client/cosmwasm';

@Injectable({
  providedIn: 'root',
})
export class CosmwasmService {
  constructor(private readonly bankService: BankService) {}

  buildMsgExecuteContract(
    sender: string,
    contractAddress: string,
    msg: any,
    amounts: { denom: string; readableAmount: number }[],
  ) {
    const coins = amounts.map(
      (amount) =>
        this.bankService.convertDenomReadableAmountMapToCoins({
          [amount.denom]: amount.readableAmount,
        })[0],
    );
    const msgString = JSON.stringify(msg);
    const msgUint8Array = convertHexStringToUint8Array(msgString);
    const ExecuteMsg = new cosmwasmclient.proto.cosmwasm.wasm.v1.MsgExecuteContract({
      sender,
      contract: contractAddress,
      msg: msgUint8Array,
      funds: coins,
    });
    return ExecuteMsg;
  }
}
