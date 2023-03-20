import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  ValidatorOutstandingRewards200Response,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  commission$: Observable<
    | QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod
    | undefined
  >;
  rewards$: Observable<ValidatorOutstandingRewards200Response | undefined>;
  slashes$: Observable<CosmosDistributionV1beta1QueryValidatorSlashesResponse | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly cosmosRest: CosmosRestService,
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
    const valAddress$ = accAddress$.pipe(
      map((address) => {
        if (address === undefined) {
          return undefined;
        }
        return address.toValAddress();
      }),
    );
    const combined$ = combineLatest([accAddress$, valAddress$]);

    this.commission$ = combined$.pipe(
      mergeMap(([accAddress, valAddress]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        return this.cosmosRest.getValidatorCommission$(valAddress);
      }),
    );

    this.rewards$ = combined$.pipe(
      mergeMap(([accAddress, valAddress]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        return this.cosmosRest.getValidatorOutstandingRewards$(valAddress);
      }),
    );

    this.slashes$ = combined$.pipe(
      mergeMap(([accAddress, valAddress]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        return this.cosmosRest.getValidatorSlashes$(valAddress, '1', '2');
      }),
    );
  }

  ngOnInit(): void {}
}
