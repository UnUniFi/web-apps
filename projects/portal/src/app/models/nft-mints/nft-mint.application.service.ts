import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { NftMintQueryService } from './nft-mint.query.service';
import { NftMintService } from './nft-mint.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NftMintApplicationService {
  constructor(
    private readonly dialog: Dialog,
    private readonly nftMintService: NftMintService,
    private readonly txCommonApplication: TxCommonApplicationService,
    private readonly nftMintQuery: NftMintQueryService,
  ) {}

  async mintTestNft(nftId: string, recipient: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address } = prerequisiteData;

    const testClass = 'factory/' + address + '/test';
    const classes = await this.nftMintQuery.getClasses(address);
    if (!classes.includes(testClass)) {
      await this.createClass(
        'test',
        'UnUniFi test',
        'TEST',
        'Test NFT for UnUniFi Testnet',
        '',
        '',
      );
    }
    await this.mintNft(testClass, nftId, recipient);
  }

  async createClass(
    subclass: string,
    name: string,
    symbol: string,
    description: string,
    uri: string,
    uriHash: string,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.nftMintService.buildMsgCreateClass(
      address,
      subclass,
      name,
      symbol,
      description,
      uri,
      uriHash,
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

    // this.snackBar.open('Successfully minted NFT.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully create NFT class.',
          },
        })
        .closed.toPromise();
    }
  }

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

    // this.snackBar.open('Successfully minted NFT.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully mint the NFT. Go to NFT Backed Loan, select Join as a Borrower, and list your NFT.',
          },
        })
        .closed.toPromise();
    }
  }
}
