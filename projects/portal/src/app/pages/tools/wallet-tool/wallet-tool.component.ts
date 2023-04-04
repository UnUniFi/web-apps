import { WalletApplicationService } from '../../../models/wallets/wallet.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-wallet-tool',
  templateUrl: './wallet-tool.component.html',
  styleUrls: ['./wallet-tool.component.css'],
})
export class WalletToolComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly walletApplicationService: WalletApplicationService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
  }

  ngOnInit(): void {}

  // WIP
  async onConnectWallet($event: {}) {
    await this.walletApplicationService.connectWalletDialog();
  }

  async onDisconnectWallet($event: {}) {
    await this.walletApplicationService.disconnectWallet();
  }
}
