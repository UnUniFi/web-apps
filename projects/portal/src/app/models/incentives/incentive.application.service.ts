import { CreateTokenFormDialogComponent } from '../../pages/dialogs/incentive/create-token-form-dialog/create-token-form-dialog.component';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { WalletService } from '../wallets/wallet.service';
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
  ) {}

  async openCreateTokenFormDialog(address: string): Promise<void> {
    const txHash = await this.dialog
      .open(CreateTokenFormDialogComponent, { data: address })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  // WIP
  // async createIncentiveToken(
  //   minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  //   gasRatio: number,
  // )
}
