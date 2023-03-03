import { validatePrivateStoredWallet } from '../../../../../utils/validation';
import {
  createCosmosPrivateKeyFromString,
  createPrivateKeyStringFromMnemonic,
} from './../../../../../../../src/app/utils/key';
import { KeyType } from './../../../../../models/keys/key.model';
import { StoredWallet, WalletType } from './../../../../../models/wallets/wallet.model';
import { WalletService } from './../../../../../models/wallets/wallet.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'view-ununifi-import-wallet-with-mnemonic-form-dialog',
  templateUrl: './ununifi-import-wallet-with-mnemonic-form-dialog.component.html',
  styleUrls: ['./ununifi-import-wallet-with-mnemonic-form-dialog.component.css'],
})
export class UnunifiImportWalletWithMnemonicFormDialogComponent implements OnInit {
  isPasswordVisible: boolean = false;
  privateWallet$: Observable<(StoredWallet & { mnemonic: string; privateKey: string }) | undefined>;
  idSubject$: BehaviorSubject<string>;
  id$: Observable<string>;
  mnemonicSubject$: BehaviorSubject<string>;
  mnemonic$: Observable<string>;
  wallets$: Observable<StoredWallet[] | null | undefined>;

  constructor(
    private readonly dialogRef: DialogRef<
      StoredWallet & { mnemonic: string; privateKey: string },
      UnunifiImportWalletWithMnemonicFormDialogComponent
    >,
    private clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
    private walletService: WalletService,
  ) {
    this.wallets$ = this.walletService.storedWallets$;
    this.idSubject$ = new BehaviorSubject<string>('');
    this.idSubject$.next('');
    this.id$ = this.idSubject$.asObservable();
    this.mnemonicSubject$ = new BehaviorSubject<string>('');
    this.mnemonicSubject$.next('');
    this.mnemonic$ = this.mnemonicSubject$.asObservable();
    this.privateWallet$ = combineLatest([this.id$, this.mnemonic$]).pipe(
      mergeMap(([id, mnemonic]) => {
        if (!mnemonic) {
          return of({
            id,
            type: WalletType.ununifi,
            mnemonic: '',
            key_type: KeyType.secp256k1,
            privateKey: '',
            public_key: '',
            address: '',
          });
        }
        return createPrivateKeyStringFromMnemonic(mnemonic)
          .then((privateKey) => {
            if (!privateKey) {
              this.snackBar.open('Invalid mnemonic!', 'Close');
              throw Error('Invalid mnemonic!');
            }
            const cosmosPrivateKey = createCosmosPrivateKeyFromString(
              KeyType.secp256k1,
              privateKey,
            );
            if (!cosmosPrivateKey) {
              this.snackBar.open('Invalid privateKey!', 'Close');
              throw Error('Invalid privateKey!');
            }
            const cosmosPublicKey = cosmosPrivateKey.pubKey();
            const public_key = Buffer.from(cosmosPublicKey.bytes()).toString('hex');
            const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
            const address = accAddress.toString();
            const mnemonicWithNoWhitespace = mnemonic.trim().replace(/\s+/g, ' ');
            return {
              id,
              type: WalletType.ununifi,
              mnemonic: mnemonicWithNoWhitespace,
              key_type: KeyType.secp256k1,
              privateKey,
              public_key,
              address,
            };
          })
          .catch((error) => {
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
          });
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

  onChangeIdAndMnemonic(id: string, mnemonic: string) {
    this.idSubject$.next(id);
    this.mnemonicSubject$.next(mnemonic);
  }

  onClickButton(id: string) {
    const subscription = combineLatest([this.privateWallet$, this.wallets$]).subscribe(
      ([privateWallet, wallets]) => {
        if (!privateWallet) {
          this.snackBar.open('Invalid wallet!');
          subscription.unsubscribe();
          return;
        }
        console.log(id);
        const sameWallet = wallets?.find((wallet) => wallet.id === id);
        console.log(sameWallet);
        if (sameWallet) {
          this.snackBar.open(
            'Same Wallet ID is already connected! You need to use another Wallet ID!',
            'Close',
          );
          subscription.unsubscribe();
          return;
        }
        privateWallet.id = id;

        if (!validatePrivateStoredWallet(privateWallet)) {
          this.snackBar.open('Invalid Wallet info!', 'Close');
          subscription.unsubscribe();
          return;
        }
        this.dialogRef.close(privateWallet);
        subscription.unsubscribe();
      },
    );
  }
}
