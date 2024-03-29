import { Config, ConfigService } from './models/config.service';
import { CosmosSDKService } from './models/cosmos-sdk.service';
import { SearchResult } from './pages/tools/search-tool/search-tool.component';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { combineLatest, Observable, BehaviorSubject, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { routerAnimation } from './animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routerAnimation],
})
export class AppComponent implements OnInit {
  config$: Observable<Config | undefined>;
  configs?: string[];
  navigations$: Observable<{ name: string; link: string; icon: string }[] | undefined>;
  selectedConfig$: Observable<string | undefined>;

  searchBoxInputValue$: BehaviorSubject<string> = new BehaviorSubject('');

  matchBlockHeightPattern$: Observable<boolean>;
  matchAccAddressPattern$: Observable<boolean>;
  matchTxHashPattern$: Observable<boolean>;

  isValidBlockHeight$: Observable<boolean>;
  isValidAccAddress$: Observable<boolean>;
  isValidTxHash$: Observable<boolean>;

  latestBlockHeight$?: Observable<string | undefined>;

  searchResult$: Observable<SearchResult> = of({ searchValue: '', type: '' });

  constructor(
    private router: Router,
    public cosmosSDK: CosmosSDKService,
    private readonly configS: ConfigService,
  ) {
    this.config$ = this.configS.config$;
    this.configs = this.configS.configs.map((config) => config.id);
    this.selectedConfig$ = this.config$.pipe(map((config) => config?.id));
    this.navigations$ = this.config$.pipe(
      map((config) => {
        if (config?.extension?.monitor != undefined) {
          config.extension.navigations.unshift({
            name: 'Monitor',
            link: '/explorer/monitor',
            icon: 'monitor',
          });
        }
        return config?.extension?.navigations;
      }),
    );

    this.matchBlockHeightPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        const regExp = /^[1-9][0-9]*$/;
        return regExp.test(value);
      }),
    );

    this.matchAccAddressPattern$ = combineLatest([
      this.config$,
      this.searchBoxInputValue$.asObservable(),
    ]).pipe(
      map(([config, value]) => {
        const prefix = config?.bech32Prefix?.accAddr ? config.bech32Prefix?.accAddr : '';
        const prefixCount = config?.bech32Prefix?.accAddr.length
          ? config.bech32Prefix?.accAddr.length
          : 0;
        const regExp = /^[0-9a-z]{39}$/;
        return regExp.test(value.slice(prefixCount)) && value.substring(0, prefixCount) === prefix;
      }),
    );

    this.matchTxHashPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        const regExp = /^[0-9A-Z]{64}$/;
        return regExp.test(value);
      }),
    );

    this.isValidBlockHeight$ = combineLatest([
      this.searchBoxInputValue$.asObservable(),
      this.matchBlockHeightPattern$,
      this.cosmosSDK.sdk$,
    ]).pipe(
      mergeMap(([searchBoxInputValue, matchBlockHeightPattern, sdk]) => {
        if (!matchBlockHeightPattern) {
          return of(false);
        }
        try {
          return cosmosclient.rest.tendermint.getLatestBlock(sdk.rest).then((res) => {
            try {
              return res.data &&
                res.data.block?.header?.height &&
                BigInt(res.data.block?.header?.height) > BigInt(searchBoxInputValue)
                ? BigInt(res.data.block?.header?.height) > BigInt(searchBoxInputValue)
                : false;
            } catch (error) {
              return false;
            }
          });
        } catch (error) {
          return of(false);
        }
      }),
    );

    this.isValidAccAddress$ = combineLatest([
      this.searchBoxInputValue$.asObservable(),
      this.matchAccAddressPattern$,
    ]).pipe(
      mergeMap(([searchBoxInputValue, matchAccAddressPattern]) => {
        if (!matchAccAddressPattern) {
          return of(false);
        }
        try {
          const address = cosmosclient.AccAddress.fromString(searchBoxInputValue);
          if (address instanceof cosmosclient.AccAddress) {
            return of(true);
          } else {
            return of(false);
          }
        } catch (error) {
          return of(false);
        }
      }),
    );

    this.isValidTxHash$ = combineLatest([
      this.searchBoxInputValue$.asObservable(),
      this.matchTxHashPattern$,
      this.cosmosSDK.sdk$,
    ]).pipe(
      mergeMap(([searchBoxInputValue, matchTxHashPattern, sdk]) => {
        if (!matchTxHashPattern) {
          return of(false);
        }
        try {
          const tx = cosmosclient.rest.tx
            .getTx(sdk.rest, searchBoxInputValue)
            .then((res) => {
              console.log(res);
              return res.data.tx;
            })
            .catch((error) => false);
          return tx;
        } catch (error) {
          return of(false);
        }
      }),
      map((tx) => {
        if (tx) {
          return true;
        } else {
          return false;
        }
      }),
    );

    this.searchResult$ = combineLatest([
      this.searchBoxInputValue$.asObservable(),
      this.matchBlockHeightPattern$,
      this.matchAccAddressPattern$,
      this.matchTxHashPattern$,
      this.isValidBlockHeight$,
      this.isValidAccAddress$,
      this.isValidTxHash$,
    ]).pipe(
      map(
        ([
          searchBoxInputValue,
          matchBlockHeightPattern,
          matchAccAddressPattern,
          matchTxHashPattern,
          isValidBlockHeight,
          isValidAccAddress,
          isValidTxHash,
        ]) => {
          if (searchBoxInputValue === true) {
            return { searchValue: '', type: '' };
          }
          if (searchBoxInputValue === false) {
            return { searchValue: '', type: '' };
          }
          if (searchBoxInputValue) {
            if (matchBlockHeightPattern && isValidBlockHeight) {
              return { searchValue: searchBoxInputValue, type: 'block' };
            }
            if (matchAccAddressPattern && isValidAccAddress) {
              return { searchValue: searchBoxInputValue, type: 'address' };
            }
            if (matchTxHashPattern && isValidTxHash) {
              return { searchValue: searchBoxInputValue, type: 'txHash' };
            }
            return { searchValue: searchBoxInputValue, type: '' };
          } else {
            return { searchValue: searchBoxInputValue, type: '' };
          }
        },
      ),
    );
  }

  async onSubmitSearchResult(searchResult: SearchResult) {
    if (searchResult.type === 'address') {
      await this.router.navigate(['accounts', searchResult.searchValue]);
    } else if (searchResult.type === 'txHash') {
      await this.router.navigate(['txs', searchResult.searchValue]);
    } else if (searchResult.type === 'block') {
      await this.router.navigate(['blocks', searchResult.searchValue]);
    }
  }

  onChangeInputValue(value: string) {
    this.searchBoxInputValue$.next(value);
  }

  onChangeConfig(value: string) {
    this.configS.setCurrentConfig(value);
  }

  ngOnInit() {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
