import { StoredWallet } from '../../../models/wallets/wallet.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as crypto from 'crypto';

@Component({
  selector: 'view-wallet-tool',
  templateUrl: './wallet-tool.component.html',
  styleUrls: ['./wallet-tool.component.css'],
})
export class WalletToolComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Output()
  appConnectWallet: EventEmitter<{}>;

  constructor() {
    this.appConnectWallet = new EventEmitter();
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

  onConnectWallet($event: {}) {
    this.appConnectWallet.emit($event);
  }
}
