import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';

@Component({
  selector: 'app-ununifi-key-form-dialog',
  templateUrl: './ununifi-key-form-dialog.component.html',
  styleUrls: ['./ununifi-key-form-dialog.component.css'],
})
export class UnunifiKeyFormDialogComponent implements OnInit {
  currentStoredWallet$: Promise<StoredWallet | null | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly dialogRef: MatDialogRef<UnunifiKeyFormDialogComponent>,
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
