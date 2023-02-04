import { NftsDialogComponent } from '../../pages/dialogs/nft-pawnshop/nfts-dialog/nfts-dialog.component';
import { ConfigService } from '../config.service';
import { BankQueryService } from '../cosmos/bank.query.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { WalletService } from '../wallets/wallet.service';
import { NftPawnshopService } from './nft-pawnshop.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { map, take } from 'rxjs/operators';

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

  async listNft() {}

  async cancelNftListing() {}

  async placeBid() {
    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();
    const gasRatio = 1.1;

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
  }

  async cancelBid() {}

  async endNftListing() {}

  async sellingDecision() {}

  async payFullBid() {}

  async borrow() {}

  async repay() {}
}
