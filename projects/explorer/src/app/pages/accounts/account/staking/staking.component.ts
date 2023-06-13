import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse } from '@cosmos-client/core/esm/openapi/api';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-staking',
  templateUrl: './staking.component.html',
  styleUrls: ['./staking.component.css'],
})
export class StakingComponent implements OnInit {
  totalRewards$: Observable<
    CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | undefined
  >;
  //eachRewards$: Observable<QueryValidatorDelegationsResponseIsResponseTypeForTheQueryValidatorDelegationsRPCMethod>;

  constructor(
    private readonly route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cosmosRest: CosmosRestService,
  ) {
    const accAddress$ = this.route.params.pipe(
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

    /*
    delegationTotalRewardsで報酬の合計値、Valaddress毎の報酬の両方を取得可能
    Valaddress指定で取得するAPI delegationRewardsは現状コメントアウト
    */
    this.totalRewards$ = accAddress$.pipe(
      mergeMap((accAddress) => {
        if (accAddress === undefined) {
          return of(undefined);
        }
        return this.cosmosRest.getDelegationTotalRewards$(accAddress);
      }),
    );

    /*
    const valAddress$ = accAddress$.pipe(
      map((accAddress) => {
        if (accAddress === undefined) {
          return undefined;
        }
        return accAddress.toValAddress();
      }),
    );
    const combined$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$]);
    this.eachRewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) => cosmosclient.rest.cosmos.distribution.delegationRewards(sdk.rest, accAddress, valAddress)),
      map((res) => res.data),
    );
    */
  }

  ngOnInit(): void {}
}
