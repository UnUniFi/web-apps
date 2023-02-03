import { CreateUnitFormDialogComponent } from '../../pages/dialogs/incentive/create-unit-form-dialog/create-unit-form-dialog.component';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { WalletService } from '../wallets/wallet.service';
import { NftPawnshopService } from './nft-pawnshop.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class IncentiveApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly walletApplicationService: WalletApplicationService,
    private readonly walletService: WalletService,
    private readonly pawnshopService: NftPawnshopService,
  ) {}

  async openNftsDialog(classID: string): Promise<void> {
    const nftID = await this.dialog
      .open(CreateUnitFormDialogComponent, { data: classID })
      .afterClosed()
      .toPromise();
    await this.router.navigate([classID, nftID]);
  }
}
