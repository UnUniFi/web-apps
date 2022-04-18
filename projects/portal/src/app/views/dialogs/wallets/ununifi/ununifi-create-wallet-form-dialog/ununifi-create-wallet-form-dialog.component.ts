import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cosmosclient } from '@cosmos-client/core';
import * as bip39 from 'bip39';
import { KeyType } from 'projects/portal/src/app/models/keys/key.model';
import { KeyService } from 'projects/portal/src/app/models/keys/key.service';
import { StoredWallet, WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';

@Component({
  selector: 'view-ununifi-create-wallet-form-dialog',
  templateUrl: './ununifi-create-wallet-form-dialog.component.html',
  styleUrls: ['./ununifi-create-wallet-form-dialog.component.css'],
})
export class UnunifiCreateWalletFormDialogComponent implements OnInit {
  isPasswordVisible: boolean = false;
  privateWallet$: Promise<StoredWallet & { mnemonic: string; privateKey: string }>;

  constructor(
    private readonly dialogRef: MatDialogRef<UnunifiCreateWalletFormDialogComponent>,
    private clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
    private keyService: KeyService,
  ) {
    const mnemonic = bip39.generateMnemonic();
    this.privateWallet$ = this.keyService.getPrivateKeyFromMnemonic(mnemonic).then((privateKey) => {
      const cosmosPrivateKey = this.keyService.getPrivKey(
        KeyType.secp256k1,
        Uint8Array.from(Buffer.from(privateKey, 'hex')),
      );
      const cosmosPublicKey = cosmosPrivateKey.pubKey();
      const public_key = Buffer.from(cosmosPublicKey.bytes()).toString('hex');
      const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
      const address = accAddress.toString();
      return {
        id: '',
        type: WalletType.ununifi,
        mnemonic,
        key_type: KeyType.secp256k1,
        privateKey,
        public_key,
        address,
      };
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
    return false;
  }

  copyClipboard(value: string) {
    if (value.length > 0) {
      this.clipboard.copy(value);
      this.snackBar.open('Copied to clipboard', undefined, {
        duration: 3000,
      });
    }
    return false;
  }

  onClickButton(id: string) {
    this.privateWallet$.then((privateWallet) => {
      privateWallet.id = id;
      this.dialogRef.close(privateWallet);
    });
  }
}
