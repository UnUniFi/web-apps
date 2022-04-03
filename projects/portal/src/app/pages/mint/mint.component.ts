import { CosmosSDKService } from '../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ununifi, rest } from 'ununifi-client';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  cdpParams$: Observable<ununifi.cdp.IParams>;
  collateralParams$: Observable<ununifi.cdp.ICollateralParam[] | null | undefined>;
  debtParams$: Observable<ununifi.cdp.IDebtParam[] | null | undefined>;

  constructor(private cosmosSDK: CosmosSDKService) {
    const timer$ = timer(0, 60 * 1000);

    this.cdpParams$ = combineLatest([this.cosmosSDK.sdk$, timer$]).pipe(
      mergeMap(([sdk, _]) => rest.ununifi.cdp.params(sdk.rest)),
      map((res) => res.data.params!),
    );
    this.collateralParams$ = this.cdpParams$.pipe(map((cdpParams) => cdpParams?.collateral_params));
    this.debtParams$ = this.cdpParams$.pipe(
      map((cdpParams) => {
        if (!cdpParams?.debt_param) {
          return undefined;
        }
        // Todo : return IDebtParam array, after IParams have IDebtParam array
        return [cdpParams?.debt_param];
      }),
    );
  }

  ngOnInit(): void {}
}
