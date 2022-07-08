import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Key } from '../../../models/keys/key.model';
import { KeyService } from '../../../models/keys/key.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { from, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  keys$: Observable<Key[]>;
  accAddresses$: Observable<cosmosclient.AccAddress[] | undefined>;
  balances0$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  balances1$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  balances2$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(private readonly key: KeyService, private cosmosRest: CosmosRestService) {
    this.keys$ = from(this.key.list());
    const pubKeys$ = this.keys$.pipe(
      filter((keys) => !!keys),
      map((keys) => keys.map((key) => this.key.getPubKey(key!.type, key!.public_key))),
    );
    this.accAddresses$ = pubKeys$.pipe(
      map((keys) => keys.map((key) => cosmosclient.AccAddress.fromPublicKey(key))),
    );

    this.balances0$ = this.accAddresses$.pipe(
      mergeMap((addresses) => {
        if (addresses === undefined || addresses.length === 0) {
          return [];
        }
        return this.cosmosRest.getAllBalances$(addresses[0]).pipe(map((res) => res || []));
      }),
    );

    this.balances1$ = this.accAddresses$.pipe(
      mergeMap((addresses) => {
        if (addresses === undefined || addresses[1] === undefined) {
          return [];
        }
        return this.cosmosRest.getAllBalances$(addresses[1]).pipe(map((res) => res || []));
      }),
    );

    this.balances2$ = this.accAddresses$.pipe(
      mergeMap((addresses) => {
        if (addresses === undefined || addresses[2] === undefined) {
          return [];
        }
        return this.cosmosRest.getAllBalances$(addresses[2]).pipe(map((res) => res || []));
      }),
    );
  }

  ngOnInit(): void {}
}
