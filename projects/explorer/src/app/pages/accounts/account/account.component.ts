import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDKService } from '@ununifi/shared';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  address$: Observable<cosmosclient.AccAddress | undefined>;
  account$: Observable<
    | cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount
    | cosmosclient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount
    | unknown
    | undefined
  >;
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private snackBar: MatSnackBar,
  ) {
    this.address$ = this.route.params.pipe(
      map((params) => params.address),
      map((address) => {
        try {
          const accAddress = cosmosclient.AccAddress.fromString(address);
          return accAddress;
        } catch (error) {
          console.error(error);
          this.snackBar.open('Invalid address!', undefined, { duration: 6000 });
          return undefined;
        }
      }),
    );

    const combined$ = combineLatest([this.cosmosSDK.sdk$, this.address$]);

    this.account$ = combined$.pipe(
      mergeMap(([sdk, address]) => {
        if (address === undefined) {
          return of(undefined);
        }
        return cosmosclient.rest.auth
          .account(sdk.rest, address)
          .then((res) =>
            cosmosclient.codec.protoJSONToInstance(
              cosmosclient.codec.castProtoJSONOfProtoAny(res.data?.account),
            ),
          )
          .catch((error) => {
            console.error(error);
            return undefined;
          });
      }),
    );

    this.balances$ = combined$.pipe(
      mergeMap(([sdk, address]) => {
        if (address === undefined) {
          return of([]);
        }
        return cosmosclient.rest.bank
          .allBalances(sdk.rest, address)
          .then((res) => res.data.balances || []);
      }),
    );
  }

  ngOnInit() {}
}
