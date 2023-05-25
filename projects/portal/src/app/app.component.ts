import { environment } from '../environments/environment';
import { Config, ConfigService } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { WalletApplicationService } from './models/wallets/wallet.application.service';
import { StoredWallet } from './models/wallets/wallet.model';
import { WalletService } from './models/wallets/wallet.service';
import { SearchResult } from './views/toolbar/toolbar.component';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // tracking
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((params: any) => gtag('config', environment.gtagId, { page_path: params.url }));
  }
}
