import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { ExternalCosmosApplicationService } from '../external-cosmos/external-cosmos.application.service';
import { CosmwasmService } from './cosmwasm.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CosmoWasmApplicationService {
  constructor(
    private readonly externalCosmosAppService: ExternalCosmosApplicationService,
    private readonly cosmwasmService: CosmwasmService,
    private readonly dialog: Dialog,
  ) {}

  async executeContract(
    sender: string,
    contractAddress: string,
    contractMsg: any,
    amounts: { readableAmount: number; denom: string }[],
  ) {
    const msg = this.cosmwasmService.buildMsgExecuteContract(
      sender,
      contractAddress,
      contractMsg,
      amounts,
    );

    const txHash = await this.externalCosmosAppService.broadcast(msg);
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
