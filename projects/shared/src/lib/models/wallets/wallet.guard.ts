import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { WalletApplicationService } from 'projects/shared/src/lib/models/wallets/wallet.application.service';
import { StoredWallet } from 'projects/shared/src/lib/models/wallets/wallet.model';
import { WalletService } from 'projects/shared/src/lib/models/wallets/wallet.service';

@Injectable({
  providedIn: 'root',
})
export class WalletGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly walletService: WalletService,
    private readonly walletApplicationService: WalletApplicationService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const currentStoredWallet: StoredWallet | undefined =
      await this.walletService.getCurrentStoredWallet();
    if (currentStoredWallet) {
      return true;
    }

    // 1st try
    await this.walletApplicationService.connectWalletDialog();
    const currentStoredWallet1: StoredWallet | undefined =
      await this.walletService.getCurrentStoredWallet();
    if (currentStoredWallet1) {
      return true;
    }

    // 2nd try
    await this.walletApplicationService.connectWalletDialog();
    const currentStoredWallet2: StoredWallet | undefined =
      await this.walletService.getCurrentStoredWallet();
    if (currentStoredWallet2) {
      return true;
    }

    // end
    return true;
  }
}
