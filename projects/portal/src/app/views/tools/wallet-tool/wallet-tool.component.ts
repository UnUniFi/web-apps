import { StoredWallet } from '../../../models/wallets/wallet.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as crypto from 'crypto';

@Component({
  selector: 'view-wallet-tool',
  templateUrl: './wallet-tool.component.html',
  styleUrls: ['./wallet-tool.component.css'],
})
export class WalletToolComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  symbolBalancesMap?: { [symbol: string]: number } | null;
  @Output()
  appConnectWallet: EventEmitter<{}>;
  @Output()
  appDisconnectWallet: EventEmitter<{}>;

  constructor(private readonly snackBar: MatSnackBar, private clipboard: Clipboard) {
    this.appConnectWallet = new EventEmitter();
    this.appDisconnectWallet = new EventEmitter();
  }

  ngOnInit(): void {}

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
