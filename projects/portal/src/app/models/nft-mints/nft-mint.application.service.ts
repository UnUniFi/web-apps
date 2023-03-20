import { TxConfirmDialogComponent } from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { NftMintService } from './nft-mint.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NftMintApplicationService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly nftMintService: NftMintService,
    private readonly txCommonApplication: TxCommonApplicationService,
  ) {}

  async mintNft(classId: string, nftId: string, recipient: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.nftMintService.buildMsgMintNft(address, classId, nftId, recipient);

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

    this.snackBar.open('Successfully minted NFT.', undefined, {
      duration: 6000,
    });
    if (txHash) {
      await this.dialog.open<string>(TxConfirmDialogComponent, { data: txHash }).closed.toPromise();
    }
  }
}
