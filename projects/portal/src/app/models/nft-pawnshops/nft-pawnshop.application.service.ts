import { NftsDialogComponent } from '../../pages/dialogs/nft-pawnshop/nfts-dialog/nfts-dialog.component';
import { BankQueryService } from '../cosmos/bank.query.service';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { NftPawnshopService } from './nft-pawnshop.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly bankQueryService: BankQueryService,
    private readonly pawnshopService: NftPawnshopService,
    private readonly txCommonApplication: TxCommonApplicationService,
  ) {}

  async openNftsDialog(classID: string): Promise<void> {
    const nftID = await this.dialog
      .open(NftsDialogComponent, { data: classID })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['nft-pawnshop', 'lenders', 'nfts', classID, nftID, 'place-bid']);
  }

  async listNft(
    classId: string,
    nftId: string,
    listingType: ununificlient.proto.ununifi.nftmarket.ListingType,
    bidSymbol: string,
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
      listingType,
      bidSymbol,
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully listed NFT.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully cancelled NFT listing.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully placed bid.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully cancelled bid.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully ended listing.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully decided selling.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully paid settlement shortfall.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully borrowed.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
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

    const txHash = await this.txCommonApplication.broadcast(msg, publicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully repaid interests.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }
}
