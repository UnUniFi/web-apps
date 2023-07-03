import { NftsDialogComponent } from '../../pages/dialogs/nft-pawnshop/nfts-dialog/nfts-dialog.component';
import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { BankQueryService } from '../cosmos/bank.query.service';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { NftPawnshopService } from './nft-pawnshop.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { take } from 'rxjs/operators';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly bankQueryService: BankQueryService,
    private readonly pawnshopService: NftPawnshopService,
    private readonly txCommonApplication: TxCommonApplicationService,
  ) { }

  async openNftsDialog(classID: string): Promise<void> {
    const nftID = await this.dialog
      .open<string>(NftsDialogComponent, { data: classID })
      .closed.toPromise();
    await this.router.navigate(['nft-backed-loan', 'nfts', classID, nftID, 'place-bid']);
  }

  async listNft(
    classId: string,
    nftId: string,
    bidSymbol: string,
    minimumDepositRate: number,
    autoRefinancing: boolean,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.pawnshopService.buildMsgListNft(
      address,
      classId,
      nftId,
      bidSymbol,
      symbolMetadataMap,
      minimumDepositRate,
      autoRefinancing,
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

    // this.snackBar.open('Successfully listed NFT.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully listed your NFT.' },
        })
        .closed.toPromise();
      this.router.navigate(['nft-backed-loan', 'nfts', classId, nftId]);
    }
  }

  async cancelNftListing(classId: string, nftId: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.pawnshopService.buildMsgCancelNftListing(address, classId, nftId);

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

    // this.snackBar.open('Successfully cancelled NFT listing.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully cancelled your NFT Listing.' },
        })
        .closed.toPromise();
      this.router.navigate(['nft-backed-loan', 'borrowers', 'borrower']);
    }
  }

  async placeBid(
    classId: string,
    nftId: string,
    symbol: string,
    bidAmount: number,
    biddingPeriod: Date,
    lendingRate: number,
    automaticPayment: boolean,
    depositAmount: number,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.pawnshopService.buildMsgPlaceBid(
      address,
      classId,
      nftId,
      symbol,
      bidAmount,
      biddingPeriod,
      lendingRate,
      automaticPayment,
      depositAmount,
      symbolMetadataMap,
    );

    // comment-out simulate
    // const simulationResult = await this.txCommonApplication.simulate(
    //   msg,
    //   publicKey,
    //   account,
    //   minimumGasPrice,
    // );
    // if (!simulationResult) {
    //   return;
    // }
    // const { gas, fee } = simulationResult;

    // if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
    //   return;
    // }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
    );
    if (!txHash) {
      return;
    }

    // this.snackBar.open('Successfully placed bid.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully accepted your bid. Please check your bidding status from Join as a Lender in NFT Backed-Loan.',
          },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async cancelBid(classId: string, nftId: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.pawnshopService.buildMsgCancelBid(address, classId, nftId);

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

    // this.snackBar.open('Successfully cancelled bid.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully cancelled your bid. Please check your bidding status from Join as a Lender in NFT Backed-Loan.',
          },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async endNftListing(classId: string, nftId: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.pawnshopService.buildMsgEndNftListing(address, classId, nftId);

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

    // this.snackBar.open('Successfully ended listing.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully accepted the end of your NFT listing.',
          },
        })
        .closed.toPromise();
      this.router.navigate(['nft-backed-loan', 'borrowers', 'borrower']);
    }
  }

  async sellingDecision(classId: string, nftId: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.pawnshopService.buildMsgSellingDecision(address, classId, nftId);

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

    // this.snackBar.open('Successfully decided selling.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully accepted your selling decision. \nIf the successful bidder pays the full amount of the bid price within the specified period, you will receive the tokens.',
          },
        })
        .closed.toPromise();
      this.router.navigate(['nft-backed-loan', 'borrowers', 'borrower']);
    }
  }

  async payFullBid(classId: string, nftId: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    // const symbolMetadataMap = await this.bankQueryService
    //   .getSymbolMetadataMap$()
    //   .pipe(take(1))
    //   .toPromise();

    const msg = this.pawnshopService.buildMsgPayFullBid(address, classId, nftId);

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

    // this.snackBar.open('Successfully paid settlement shortfall.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully accepted your payment. After a short time, the status changes to Successful Bid. \nThe NFT will be added to your account after the specified delivery period.',
          },
        })
        .closed.toPromise();
      this.router.navigate(['nft-backed-loan', 'lenders', 'lender']);
    }
  }

  async borrow(classId: string, nftId: string, symbol: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.pawnshopService.buildMsgBorrow(
      address,
      classId,
      nftId,
      symbol,
      amount,
      symbolMetadataMap,
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

    // this.snackBar.open('Successfully borrowed.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully borrowed tokens. Please be careful of the repayment deadline. \nIf refinancing is not possible, your NFT will be liquidated.',
          },
        })
        .closed.toPromise();
      this.router.navigate(['nft-backed-loan', 'nfts', classId, nftId]);
    }
  }

  async repay(classId: string, nftId: string, symbol: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.pawnshopService.buildMsgRepay(
      address,
      classId,
      nftId,
      symbol,
      amount,
      symbolMetadataMap,
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

    // this.snackBar.open('Successfully repaid interests.', undefined, {
    //   duration: 6000,
    // });
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully repaid tokens. Please check your repayment deadline as it will be updated.',
          },
        })
        .closed.toPromise();
      this.router.navigate(['nft-backed-loan', 'nfts', classId, nftId]);
    }
  }

  private async waitSeconds(seconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
}
