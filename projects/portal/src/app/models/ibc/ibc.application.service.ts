import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { ExternalCosmosApplicationService } from '../external-cosmos/external-cosmos.application.service';
import { IbcService } from './ibc.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IbcApplicationService {
  constructor(
    private readonly externalCosmosAppService: ExternalCosmosApplicationService,
    private readonly txCommonApplication: TxCommonApplicationService,
    private readonly ibcService: IbcService,
    private readonly dialog: Dialog,
  ) {}

  async transfer(
    sourcePort: string,
    sourceChannel: string,
    receiver: string,
    memo: any,
    timeoutTimestamp: number,
    timeoutHeight?: {
      revisionNumber: number;
      revisionHeight: number;
    },
    amount?: { denom: string; readableAmount: number },
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.ibcService.buildMsgTransfer(
      sourcePort,
      sourceChannel,
      address,
      receiver,
      memo,
      timeoutTimestamp,
      timeoutHeight,
      amount,
    );

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
      gas,
      fee,
    );
    if (!txHash) {
      return;
    }

    await this.dialog
      .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
        data: { txHash: txHash, msg: 'Deposit to the vault was successful.' },
      })
      .closed.toPromise();
    location.reload();
  }
}
