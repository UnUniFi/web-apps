import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CosmosSDKService } from 'projects/portal/src/app/models';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { rest, ununifi } from 'ununifi-client';

@Component({
  selector: 'app-collateral-param',
  templateUrl: './collateral-param.component.html',
  styleUrls: ['./collateral-param.component.css'],
})
export class CollateralParamComponent implements OnInit {
  type$: Observable<string>;
  cdpParams$: Observable<ununifi.cdp.IParams>;
  collateralParam$: Observable<ununifi.cdp.ICollateralParam | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.type$ = this.route.params.pipe(map((params) => params.type));
    this.cdpParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.ununifi.cdp.params(sdk.rest)),
      map((res) => res.data.params!),
    );
    this.collateralParam$ = combineLatest([this.cdpParams$, this.type$]).pipe(
      map(([cdpParams, type]) => cdpParams?.collateral_params?.find((param) => param.type == type)),
    );
  }

  ngOnInit(): void {}
}
