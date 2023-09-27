import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { Observable, of } from 'rxjs';
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
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cosmosRest: CosmosRestService,
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
    this.account$ = this.address$.pipe(
      mergeMap((address) => {
        if (address === undefined) {
          return of(undefined);
        }
        return this.cosmosRest.getAccount$(address.toString());
      }),
      map((account) => {
        const { protoJSONToInstance, castProtoJSONOfProtoAny } = cosmosclient.codec;
        return account && protoJSONToInstance(castProtoJSONOfProtoAny(account));
      }),
    );
    this.balances$ = this.address$.pipe(
      mergeMap((address) => {
        if (address === undefined) {
          return of([]);
        }
        return this.cosmosRest.getAllBalances$(address.toString());
      }),
      map((balances) => balances || []),
    );
  }

  ngOnInit() {}
}
