import { AppNavigation, ConfigService } from '../../../models/config.service';
import { DeveloperService } from '../../../models/developer.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-app-derivatives',
  templateUrl: './app-derivatives.component.html',
  styleUrls: ['./app-derivatives.component.css'],
})
export class AppDerivativesComponent implements OnInit {
  address$: Observable<string | undefined>;
  apps$: Observable<AppNavigation[] | undefined>;
  navigations$: Observable<{ name: string; link: string; icon: string }[] | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly developerService: DeveloperService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    const config$ = this.configS.config$;
    this.apps$ = config$.pipe(map((conf) => conf?.apps));
    this.navigations$ = combineLatest([this.address$, config$]).pipe(
      map(([address, config]) => {
        const navigation = config?.extension?.navigations.slice();
        if (config?.extension?.developer?.enabled && address) {
          if (this.developerService.isDeveloper(address)) {
            navigation?.unshift({
              name: 'Developers',
              link: '/portal/developers',
              icon: 'build',
            });
          }
        }
        if (config?.extension?.nftMint?.enabled) {
          navigation?.unshift({
            name: 'NFT Mint',
            link: '/portal/nfts/mint',
            icon: 'add_photo_alternate',
          });
        }
        if (config?.extension?.faucet?.filter((faucet) => faucet.hasFaucet == true).length) {
          navigation?.unshift({
            name: 'Faucet',
            link: '/portal/faucet',
            icon: 'clean_hands',
          });
        }
        if (config?.extension?.monitor != undefined) {
          navigation?.unshift({
            name: 'Monitor',
            link: '/portal/monitor',
            icon: 'monitor',
          });
        }
        return navigation;
      }),
    );
  }

  ngOnInit(): void {}
}
