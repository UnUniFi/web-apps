import { NftsDialogComponent } from '../../pages/dialogs/nft-pawnshop/nfts-dialog/nfts-dialog.component';
import { TxFeeConfirmDialogComponent } from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { ConfigService } from '../config.service';
import { BankQueryService } from '../cosmos/bank.query.service';
import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { TxCommonService } from '../cosmos/tx-common.service';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { NftPawnshopService } from './nft-pawnshop.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import { PubKey } from '@cosmos-client/core/esm/types';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
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
    private readonly loadingDialog: LoadingDialogService,
    private readonly walletApplicationService: WalletApplicationService,
    private readonly walletService: WalletService,
    private readonly bankQueryService: BankQueryService,
    private readonly pawnshopService: NftPawnshopService,
    private readonly txCommon: TxCommonService,
    private readonly config: ConfigService,
  ) {}

  async openNftsDialog(classID: string): Promise<void> {
    const nftID = await this.dialog
      .open(NftsDialogComponent, { data: classID })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['nft-pawnshop', 'lenders', 'nfts', classID, nftID, 'place-bid']);
  }

  async simulate(
    msg: any,
    cosmosPublicKey: PubKey,
    account: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ) {
    const gasRatio = 1.1;
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      const simulateTxBuilder = await this.txCommon.buildTxBuilderWithDummyGasAndFee(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        minimumGasPrice,
      );

      simulatedResultData = await this.txCommon.simulateTx(
        simulateTxBuilder,
        minimumGasPrice,
        gasRatio,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;

      return { gas, fee };
    } catch (error) {
      console.error(error);
      const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      return null;
    } finally {
      dialogRefSimulating.close();
    }
  }

  async broadcast(
    msg: any,
    cosmosPublicKey: PubKey,
    account: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ) {
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      const txBuilder = await this.txCommon.buildTxBuilder(
        [msg as any], // TODO
        cosmosPublicKey,
        account,
        gas,
        fee,
      );
      txResult = await this.txCommon.announceTx(txBuilder);
      txHash = txResult?.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error(txResult?.tx_response?.raw_log);
      }
      return txHash;
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return null;
    } finally {
      dialogRef.close();
    }
  }

  async listNft(
    classId: string,
    nftId: string,
    listingType: ununificlient.proto.ununifi.nftmarket.ListingType,
    bidSymbol: string,
  ) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    // create msg
    const msg = this.pawnshopService.buildMsgListNft(
      address,
      classId,
      nftId,
      listingType,
      bidSymbol,
      symbolMetadataMap,
    );

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully listed NFT.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async cancelNftListing(classId: string, nftId: string) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const msg = this.pawnshopService.buildMsgCancelNftListing(address, classId, nftId);

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
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
    lendingRate: number,
    automaticPayment: boolean,
    depositAmount: number,
  ) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

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
      lendingRate,
      automaticPayment,
      depositAmount,
      symbolMetadataMap,
    );

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully placed bid.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async cancelBid(classId: string, nftId: string) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const msg = this.pawnshopService.buildMsgCancelBid(address, classId, nftId);

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully cancelled bid.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async endNftListing(classId: string, nftId: string) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const msg = this.pawnshopService.buildMsgEndNftListing(address, classId, nftId);

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully ended listing.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async sellingDecision(classId: string, nftId: string) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    const msg = this.pawnshopService.buildMsgSellingDecision(address, classId, nftId);

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully decided selling.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async payFullBid(classId: string, nftId: string) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

    // const symbolMetadataMap = await this.bankQueryService
    //   .getSymbolMetadataMap$()
    //   .pipe(take(1))
    //   .toPromise();

    const msg = this.pawnshopService.buildMsgPayFullBid(address, classId, nftId);

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully paid settlement shortfall.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async borrow(classId: string, nftId: string, symbol: string, amount: number) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

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

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully borrowed.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }

  async repay(classId: string, nftId: string, symbol: string, amount: number) {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const address = currentCosmosWallet.address.toString();
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      throw Error('Unsupported account type.');
    }

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

    const simulationResult = await this.simulate(msg, cosmosPublicKey, account, minimumGasPrice);
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .afterClosed()
        .toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.broadcast(msg, cosmosPublicKey, account, gas, fee);
    if (!txHash) {
      return;
    }

    this.snackBar.open('Successfully repaid interests.', undefined, {
      duration: 6000,
    });
    await this.router.navigate(['txs', txHash]);
  }
}
