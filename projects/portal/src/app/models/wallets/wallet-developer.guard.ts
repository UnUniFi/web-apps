import { WalletApplicationService } from './wallet.application.service';
import { StoredWallet } from './wallet.model';
import { WalletService } from './wallet.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class WalletDeveloperGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly walletService: WalletService,
    private readonly walletApplicationService: WalletApplicationService,
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const devAddress = [
      'ununifi155u042u8wk3al32h3vzxu989jj76k4zcu44v6w',
      'ununifi1v0h8j7x7kfys29kj4uwdudcc9y0nx6twwxahla',
      'ununifi1y3t7sp0nfe2nfda7r9gf628g6ym6e7d44evfv6',
      'ununifi1pp2ruuhs0k7ayaxjupwj4k5qmgh0d72wrdyjyu',
      'ununifi1gnfsfp340h33glkccjet38faxwkspwpz3r4raj',
    ];
    const currentStoredWallet: StoredWallet | undefined =
      await this.walletService.getCurrentStoredWallet();
    if (
      currentStoredWallet &&
      devAddress.find((address) => address == currentStoredWallet.address)
    ) {
      return true;
    } else {
      alert('Please login with developer account.');
      this.router.navigate(['']);
      return true;
    }
  }
}
