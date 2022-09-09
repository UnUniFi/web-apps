import { KeyType } from '../../../../../../lib/models/keys/key.model';
import { StoredWallet, WalletType } from '../../../../../../lib/models/wallets/wallet.model';
import { WalletService } from '../../../../../../lib/models/wallets/wallet.service';
import {
  createCosmosPrivateKeyFromString,
  createPrivateKeyStringFromMnemonic,
} from '../../../../../../lib/utils/key';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import * as bip39 from 'bip39';

@Component({
  selector: 'view-ununifi-create-wallet-form-dialog',
  templateUrl: './ununifi-create-wallet-form-dialog.component.html',
  styleUrls: ['./ununifi-create-wallet-form-dialog.component.css'],
})
export class UnunifiCreateWalletFormDialogComponent implements OnInit {
  isPasswordVisible: boolean = false;
  privateWallet$: Promise<StoredWallet & { mnemonic: string; privateKey: string }>;
  wallets$: Promise<StoredWallet[] | undefined>;

  constructor(
    private readonly dialogRef: MatDialogRef<UnunifiCreateWalletFormDialogComponent>,
    private clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
    private walletService: WalletService,
  ) {
    this.wallets$ = this.walletService.listStoredWallets();
    const mnemonic = bip39.generateMnemonic();
    this.privateWallet$ = createPrivateKeyStringFromMnemonic(mnemonic).then((privateKey) => {
      if (!privateKey) {
        this.snackBar.open('Invalid mnemonic!', 'Close');
        throw Error('Invalid mnemonic!');
      }
      const cosmosPrivateKey = createCosmosPrivateKeyFromString(KeyType.secp256k1, privateKey);
      if (!cosmosPrivateKey) {
        this.snackBar.open('Invalid privateKey!', 'Close');
        throw Error('Invalid privateKey!');
      }
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
    Promise.all([this.privateWallet$, this.wallets$]).then(([privateWallet, wallets]) => {
      const sameWallet = wallets?.find((wallet) => wallet.id === id);
      if (sameWallet) {
        this.snackBar.open(
          'Same Wallet ID is already connected! You need to use another Wallet ID!',
          'Close',
        );
        return;
      }
      privateWallet.id = id;
      this.dialogRef.close(privateWallet);
    });
  }
}
