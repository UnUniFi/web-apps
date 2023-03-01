import { KeyType } from './../../../../../models/keys/key.model';
import { StoredWallet, WalletType } from './../../../../../models/wallets/wallet.model';
import { WalletService } from './../../../../../models/wallets/wallet.service';
import { createCosmosPrivateKeyFromString } from './../../../../../utils/key';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'view-ununifi-import-wallet-with-private-key-form-dialog',
  templateUrl: './ununifi-import-wallet-with-private-key-form-dialog.component.html',
  styleUrls: ['./ununifi-import-wallet-with-private-key-form-dialog.component.css'],
})
export class UnunifiImportWalletWithPrivateKeyFormDialogComponent implements OnInit {
  isPasswordVisible: boolean = false;
  privateWallet$: Observable<(StoredWallet & { mnemonic: string; privateKey: string }) | undefined>;
  idSubject$: BehaviorSubject<string>;
  id$: Observable<string>;
  privateKeySubject$: BehaviorSubject<string>;
  privateKey$: Observable<string>;
  wallets$: Observable<StoredWallet[] | null | undefined>;

  constructor(
    private readonly dialogRef: MatDialogRef<UnunifiImportWalletWithPrivateKeyFormDialogComponent>,
    private clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
    private walletService: WalletService,
  ) {
    this.wallets$ = this.walletService.storedWallets$;
    this.idSubject$ = new BehaviorSubject<string>('');
    this.idSubject$.next('');
    this.id$ = this.idSubject$.asObservable();
    this.privateKeySubject$ = new BehaviorSubject<string>('');
    this.privateKeySubject$.next('');
    this.privateKey$ = this.privateKeySubject$.asObservable();
    this.privateWallet$ = combineLatest([this.id$, this.privateKey$]).pipe(
      map(([id, privateKey]) => {
        if (!privateKey) {
          return {
            id,
            type: WalletType.ununifi,
            mnemonic: '',
            key_type: KeyType.secp256k1,
            privateKey: '',
            public_key: '',
            address: '',
          };
        }

        try {
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
            id,
            type: WalletType.ununifi,
            mnemonic: '',
            key_type: KeyType.secp256k1,
            privateKey,
            public_key,
            address,
          };
        } catch (error) {
          console.error(error);
          return {
            id,
            type: WalletType.ununifi,
            mnemonic: '',
            key_type: KeyType.secp256k1,
            privateKey: '',
            public_key: '',
            address: '',
          };
        }
      }),
    );
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

  onChangeIdAndPrivateKey(id: string, privateKey: string) {
    this.idSubject$.next(id);
    const privateKeyWithoutWhiteSpace = privateKey.replace(/\s+/g, '');
    this.privateKeySubject$.next(privateKeyWithoutWhiteSpace);
  }

  onClickButton(id: string) {
    const subscription = combineLatest([this.privateWallet$, this.wallets$]).subscribe(
      ([privateWallet, wallets]) => {
        if (!privateWallet) {
          this.snackBar.open('Invalid wallet!');
          subscription.unsubscribe();
          return;
        }
        const sameWallet = wallets?.find((wallet) => wallet.id === id);
        if (sameWallet) {
          this.snackBar.open(
            'Same Wallet ID is already connected! You need to use another Wallet ID!',
            'Close',
          );
          subscription.unsubscribe();
          return;
        }
        privateWallet.id = id;
        this.dialogRef.close(privateWallet);
        subscription.unsubscribe();
      },
    );
  }
}
