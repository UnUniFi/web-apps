import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

@Component({
  selector: 'view-ununifi-backup-private-key-wizard-dialog',
  templateUrl: './ununifi-backup-private-key-wizard-dialog.component.html',
  styleUrls: ['./ununifi-backup-private-key-wizard-dialog.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class UnunifiBackupPrivateKeyWizardDialogComponent implements OnInit {
  saved: boolean = false;
  checked: boolean = false;
  inputPrivateKey: string = '';
  isPasswordVisible: boolean = false;

  now = new Date();
  sec = this.now.getSeconds();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: StoredWallet & { mnemonic: string; privateKey: string },
    public matDialogRef: MatDialogRef<UnunifiBackupPrivateKeyWizardDialogComponent>,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}

  onClickSubmit(): void {
    const walletBackupResult: StoredWallet & {
      mnemonic: string;
      privateKey: string;
      checked: boolean;
      saved: boolean;
    } = {
      id: this.data.id,
      type: this.data.type,
      key_type: this.data.key_type,
      public_key: this.data.public_key,
      address: this.data.address,
      mnemonic: this.data.mnemonic,
      privateKey: this.data.privateKey,
      checked: this.checked,
      saved: this.saved,
    };
    this.matDialogRef.close(walletBackupResult);
  }

  savePrivateKey(): void {
    // postfix
    const year = String(this.now.getFullYear());
    const month = String(this.now.getMonth() + 1);
    const date = String(this.now.getDate());
    const hour = String(this.now.getHours());
    const min = String(this.now.getMinutes());
    const sec = String(this.now.getSeconds());

    // filename
    const fileName = `wallet-backup-${this.data.id}-${year}${month}${date}${hour}${min}${sec}.txt`;

    // json
    const json = {
      id: this.data.id,
      type: this.data.type,
      key_type: this.data.key_type,
      mnemonic: this.data.mnemonic,
      privateKey: this.data.privateKey,
      public_key: this.data.public_key,
      address: this.data.address,
    };

    // text
    const jsonString = JSON.stringify(json, null, 2);

    // create link for download and execute download
    const link = document.createElement('a');
    link.href = 'data:text/plain,' + encodeURIComponent(jsonString);
    link.download = fileName;
    link.click();

    //status
    this.saved = true;
  }

  checkSavedPrivateKey(inputPrivateKey: string): void {
    if (this.data.privateKey === inputPrivateKey) {
      this.checked = true;
      this.snackBar.open('Correct', undefined, { duration: 2000 });
    } else {
      this.checked = false;
      this.snackBar.open('Wrong private key!', 'Closed');
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    return false;
  }
}
