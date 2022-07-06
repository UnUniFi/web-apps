import { Config, ConfigService } from '../../../models/config.service';
import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Key } from '../../../models/keys/key.model';
import { KeyService } from '../../../models/keys/key.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.css'],
})
export class KeyComponent implements OnInit {
  config$: Observable<Config | undefined>;
  keyID$: Observable<string>;
  key$: Observable<Key | undefined>;
  accAddress$: Observable<cosmosclient.AccAddress | undefined>;
  valAddress$: Observable<cosmosclient.ValAddress | undefined>;
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  faucets$: Observable<
    | {
        hasFaucet: boolean;
        faucetURL: string;
        denom: string;
        creditAmount: number;
        maxCredit: number;
      }[]
    | undefined
  >;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly key: KeyService,
    private configService: ConfigService,
    private cosmosRest: CosmosRestService,
  ) {
    this.config$ = this.configService.config$;
    this.keyID$ = this.route.params.pipe(map((params) => params['key_id']));
    this.key$ = this.keyID$.pipe(mergeMap((keyID) => this.key.get(keyID)));
    const pubKey$ = this.key$.pipe(
      filter((key) => !!key),
      map((key) => this.key.getPubKey(key!.type, key!.public_key)),
    );

    this.accAddress$ = pubKey$.pipe(map((key) => cosmosclient.AccAddress.fromPublicKey(key)));
    this.valAddress$ = pubKey$.pipe(map((key) => cosmosclient.ValAddress.fromPublicKey(key)));
    this.balances$ = this.accAddress$.pipe(
      mergeMap((address) => {
        if (address === undefined) {
          return of([]);
        }
        return this.cosmosRest.allBalances$(address).pipe(map((res) => res || []));
      }),
    );

    this.faucets$ = combineLatest([this.config$, this.balances$]).pipe(
      map(([config, balances]) => {
        const initialFaucets = config?.extension?.faucet?.filter((faucet) => faucet.hasFaucet);
        return initialFaucets?.filter((faucet) => {
          const faucetDenomBalanceNotFound =
            balances.find((balance) => balance.denom === faucet.denom) === undefined;
          const faucetDenomBalanceAmount = balances.find(
            (balance) => balance.denom === faucet.denom,
          )?.amount;
          const faucetDenomBalanceIsLessThanMaxCredit = faucetDenomBalanceAmount
            ? parseInt(faucetDenomBalanceAmount) <= faucet.maxCredit
            : false;
          if (faucetDenomBalanceNotFound || faucetDenomBalanceIsLessThanMaxCredit) {
            return true;
          } else {
            return false;
          }
        });
      }),
    );
  }

  ngOnInit(): void {}
}
