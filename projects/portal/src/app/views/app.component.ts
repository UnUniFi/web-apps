import { Config } from '../models/config.service';
import { StoredWallet } from '../models/wallets/wallet.model';
import { SearchResult } from './toolbar/toolbar.component';
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as crypto from 'crypto';

@Component({
  selector: 'view-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @Input()
  config?: Config | null;

  @Input()
  searchResult?: SearchResult | null;

  @Input()
  configs?: string[];

  @Input()
  selectedConfig?: string | null;

  @Input()
  currentStoredWallet?: StoredWallet | null;

  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;

  @Output()
  appSubmitSearchResult: EventEmitter<SearchResult>;

  @Output()
  appChangeInputValue: EventEmitter<string>;

  @Output()
  appConnectWallet: EventEmitter<{}>;

  @Output()
  appChangeConfig: EventEmitter<string>;

  // @ViewChild('drawer')
  // sidenav!: MatSidenav;
  // drawerMode$: BehaviorSubject<MatDrawerMode> = new BehaviorSubject('side' as MatDrawerMode);
  // drawerOpened$ = new BehaviorSubject(true);

  apps: { name: string; link: string; icon: string }[];
  searchValue: string;

  constructor(private router: Router, private ngZone: NgZone) {
    this.searchValue = '';
    this.searchResult = {
      searchValue: '',
      type: '',
    };
    this.apps = [
      { name: 'Utilities', link: '/', icon: 'account_balance_wallet' },
      { name: 'NFT Backed Loan', link: '/nft-backed-loan', icon: 'photo_library' },
      { name: 'Derivatives', link: '/derivatives/perpetual-futures', icon: 'show_chart' },
    ];
    this.appSubmitSearchResult = new EventEmitter();
    this.appChangeInputValue = new EventEmitter();
    this.appConnectWallet = new EventEmitter();
    this.appChangeConfig = new EventEmitter();

    // window.onresize = (_) => {
    //   this.ngZone.run(() => {
    //     this.handleResizeWindow(window.innerWidth);
    //   });
    // };

    // combineLatest([this.drawerMode$, this.router.events]).subscribe(([drawerMode, event]) => {
    //   if (drawerMode === 'over' && event instanceof NavigationEnd) {
    //     this.sidenav?.close();
    //   }
    // });
  }

  ngOnInit() {
    // this.handleResizeWindow(window.innerWidth);
  }

  // handleResizeWindow(width: number): void {
  //   if (width < 640) {
  //     this.drawerMode$.next('over');
  //     this.drawerOpened$.next(false);
  //   } else {
  //     this.drawerMode$.next('side');
  //     this.drawerOpened$.next(true);
  //   }
  // }

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

  onChangeConfig(selectedConfig: string): void {
    this.appChangeConfig.emit(selectedConfig);
  }

  onOptionSelected(): void {
    if (this.searchResult) {
      this.appSubmitSearchResult.emit(this.searchResult);
      this.searchResult = { searchValue: '', type: '' };
      this.searchValue = '';
    }
  }

  onSubmitSearchResult(): void {
    if (this.searchResult) {
      this.appSubmitSearchResult.emit(this.searchResult);
      this.searchResult = { searchValue: '', type: '' };
      this.searchValue = '';
    }
  }

  onChangeInput(inputValue: string): void {
    this.appChangeInputValue.emit(inputValue);
  }

  onFocusInput(inputValue: string): void {
    this.appChangeInputValue.emit(inputValue);
  }
}
