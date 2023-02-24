import { StoredWallet } from '../../../../../../lib/models/wallets/wallet.model';
import { WalletService } from '../../../../../../lib/models/wallets/wallet.service';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ununifi-key-form-dialog',
  templateUrl: './ununifi-key-form-dialog.component.html',
  styleUrls: ['./ununifi-key-form-dialog.component.css'],
})
export class UnunifiKeyFormDialogComponent implements OnInit {
  currentStoredWallet$: Promise<StoredWallet | null | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly dialogRef: DialogRef<
      StoredWallet & { privateKey: string },
      UnunifiKeyFormDialogComponent
    >,
    private readonly snackBar: MatSnackBar,
  ) {
    this.currentStoredWallet$ = this.walletService.getCurrentStoredWallet();
  }

  ngOnInit(): void {}

  onClickButton(privateKey: string) {
    this.currentStoredWallet$.then((currentStoredWallet) => {
      if (!currentStoredWallet) {
        this.snackBar.open('There is no wallet connected! Connect wallet firstly!', 'Close');
        return;
      }
      const privateWallet: StoredWallet & { privateKey: string } = {
        id: currentStoredWallet.id,
        type: currentStoredWallet.type,
        key_type: currentStoredWallet.key_type,
        privateKey,
        public_key: currentStoredWallet.public_key,
        address: currentStoredWallet.address,
      };
      this.dialogRef.close(privateWallet);
    });
  }
}
