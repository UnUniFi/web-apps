import { WalletWindow, StoredWallet, WalletType } from '../../../models/wallets/wallet.model';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import * as crypto from 'crypto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends WalletWindow {}
}
@Component({
  selector: 'view-wallet-tool',
  templateUrl: './wallet-tool.component.html',
  styleUrls: ['./wallet-tool.component.css'],
})
export class WalletToolComponent implements OnInit, OnChanges {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  denom?: string | null;
  @Input()
  denomBalancesMap?: { [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin } | null;
  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;
  @Input()
  keplrStoredWallet?: StoredWallet | null;
  @Input()
  leapStoredWallet?: StoredWallet | null;
  @Output()
  appConnectWallet: EventEmitter<{}>;
  @Output()
  appDisconnectWallet: EventEmitter<{}>;

  isFirstChange = true;

  constructor(private readonly snackBar: MatSnackBar, private clipboard: Clipboard) {
    this.appConnectWallet = new EventEmitter();
    this.appDisconnectWallet = new EventEmitter();
  }

  ngOnChanges(): void {
    if (this.isFirstChange && this.currentStoredWallet) {
      if (
        this.keplrStoredWallet &&
        this.currentStoredWallet.type === WalletType.keplr &&
        this.currentStoredWallet.public_key != this.keplrStoredWallet.public_key
      ) {
        this.isFirstChange = false;
        alert(
          'Logged out because Keplr and Portal have different addresses. Please connect wallet again.',
        );
        this.onDisconnectWallet({});
      }
      if (
        this.leapStoredWallet &&
        this.currentStoredWallet.type === WalletType.leap &&
        this.currentStoredWallet.public_key != this.leapStoredWallet.public_key
      ) {
        this.isFirstChange = false;
        alert(
          'Logged out because Leap and Portal have different addresses. Please connect wallet again.',
        );
        this.onDisconnectWallet({});
      }
    }
    if (
      this.isFirstChange &&
      this.currentStoredWallet &&
      this.keplrStoredWallet &&
      this.currentStoredWallet.type === WalletType.keplr &&
      this.currentStoredWallet.public_key != this.keplrStoredWallet.public_key
    ) {
      this.isFirstChange = false;
      alert(
        'Logged out because Keplr and Portal have different addresses. Please connect wallet again.',
      );
      this.onDisconnectWallet({});
    }
  }

  ngOnInit(): void {}

  @HostListener('window:keplr_keystorechange', ['$event'])
  onChangeKeplrKey() {
    if (this.currentStoredWallet?.type === WalletType.keplr) {
      alert('Key store in Keplr is changed. You may need to refetch the account info.');
      this.onDisconnectWallet({});
    }
  }

  @HostListener('window:leap_keystorechange', ['$event'])
  onChangeLeapKey() {
    if (this.currentStoredWallet?.type === WalletType.leap) {
      alert('Key store in Leap is changed. You may need to refetch the account info.');
      this.onDisconnectWallet({});
    }
  }

  getColorCode(storedWallet: StoredWallet) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(storedWallet.id))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
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

  onConnectWallet($event: {}) {
    this.appConnectWallet.emit($event);
  }

  onDisconnectWallet($event: {}) {
    this.appDisconnectWallet.emit($event);
  }
}
