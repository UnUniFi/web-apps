import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
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
    private readonly txCommonApplication: TxCommonApplicationService,
    private readonly cosmwasmService: CosmwasmService,
    private readonly dialog: Dialog,
  ) {}

  async executeContract(
    sender: string,
    contractAddress: string,
    contractMsg: any,
    amounts: { readableAmount: number; denom: string }[],
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.cosmwasmService.buildMsgExecuteContract(
      sender,
      contractAddress,
      contractMsg,
      amounts,
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
