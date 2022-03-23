import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { Key } from '../../../models/keys/key.model';
import { KeyService } from '../../../models/keys/key.service';
import { Component, OnInit } from '@angular/core';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  keys$: Observable<Key[]>;
  accAddresses$: Observable<cosmosclient.AccAddress[] | undefined>;
  balances0$: Observable<proto.cosmos.base.v1beta1.ICoin[]>;
  balances1$: Observable<proto.cosmos.base.v1beta1.ICoin[]>;
  balances2$: Observable<proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(private readonly key: KeyService, private cosmosSDK: CosmosSDKService) {
    this.keys$ = from(this.key.list());
    const pubKeys$ = this.keys$.pipe(
      filter((keys) => !!keys),
      map((keys) => keys.map((key) => this.key.getPubKey(key!.type, key!.public_key))),
    );
    this.accAddresses$ = pubKeys$.pipe(
      map((keys) => keys.map((key) => cosmosclient.AccAddress.fromPublicKey(key))),
    );

    this.balances0$ = combineLatest([this.cosmosSDK.sdk$, this.accAddresses$]).pipe(
      mergeMap(([sdk, addresses]) => {
        if (addresses === undefined) {
          return [];
        }
        if (addresses[0] === undefined) {
          return [];
        }
        return rest.bank
          .allBalances(sdk.rest, addresses[0])
          .then((res) => res.data.balances || [])
          .catch((_) => []);
      }),
    );

    this.balances1$ = combineLatest([this.cosmosSDK.sdk$, this.accAddresses$]).pipe(
      mergeMap(([sdk, addresses]) => {
        if (addresses === undefined) {
          return [];
        }
        if (addresses[1] === undefined) {
          return [];
        }
        return rest.bank
          .allBalances(sdk.rest, addresses[1])
          .then((res) => res.data.balances || [])
          .catch((_) => []);
      }),
    );

    this.balances2$ = combineLatest([this.cosmosSDK.sdk$, this.accAddresses$]).pipe(
      mergeMap(([sdk, addresses]) => {
        if (addresses === undefined) {
          return [];
        }
        if (addresses[2] === undefined) {
          return [];
        }
        return rest.bank
          .allBalances(sdk.rest, addresses[2])
          .then((res) => res.data.balances || [])
          .catch((_) => []);
      }),
    );
  }

  ngOnInit(): void {}
}
