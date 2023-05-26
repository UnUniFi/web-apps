import { ConfigService } from '../../../models/config.service';
import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { SearchResult } from '../../../views/toolbar/toolbar.component';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-tool',
  templateUrl: './search-tool.component.html',
  styleUrls: ['./search-tool.component.css'],
})
export class SearchToolComponent implements OnInit {
  searchBoxInputValue$: BehaviorSubject<string> = new BehaviorSubject('');
  searchResult$: Observable<SearchResult> = of({ searchValue: '', type: '' });

  matchBlockHeightPattern$: Observable<boolean>;
  matchAccAddressPattern$: Observable<boolean>;
  matchTxHashPattern$: Observable<boolean>;
  isValidBlockHeight$: Observable<boolean>;
  isValidAccAddress$: Observable<boolean>;
  isValidTxHash$: Observable<boolean>;
  latestBlockHeight$?: Observable<string | undefined>;

  constructor(public cosmosSDK: CosmosSDKService, private readonly configS: ConfigService) {
    const config$ = this.configS.config$;
    this.matchBlockHeightPattern$ = this.searchBoxInputValue$.asObservable().pipe(
      map((value) => {
        const regExp = /^[1-9][0-9]*$/;
        return regExp.test(value);
      }),
    );

    this.matchAccAddressPattern$ = combineLatest([
      config$,
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

  ngOnInit(): void {}

  async onSubmitSearchResult(searchResult: SearchResult) {
    if (searchResult.type === 'address') {
      const redirectUrl = `${location.protocol}//${location.host}/explorer/accounts/${searchResult.searchValue}`;
      window.location.href = redirectUrl;
    } else if (searchResult.type === 'txHash') {
      const redirectUrl = `${location.protocol}//${location.host}/explorer/txs/${searchResult.searchValue}`;
      window.location.href = redirectUrl;
    } else if (searchResult.type === 'block') {
      const redirectUrl = `${location.protocol}//${location.host}/explorer/blocks/${searchResult.searchValue}`;
      window.location.href = redirectUrl;
    }
  }

  onChangeInputValue(value: string) {
    this.searchBoxInputValue$.next(value);
  }
}
