import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CosmosSDKService } from 'projects/portal/src/app/models';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { rest, ununifi } from 'ununifi-client';

@Component({
  selector: 'app-debt-param',
  templateUrl: './debt-param.component.html',
  styleUrls: ['./debt-param.component.css'],
})
export class DebtParamComponent implements OnInit {
  type$: Observable<string>;
  cdpParams$: Observable<ununifi.cdp.IParams>;
  debtParam$: Observable<ununifi.cdp.IDebtParam | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.type$ = this.route.params.pipe(map((params) => params.type));
    this.cdpParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.ununifi.cdp.params(sdk.rest)),
      map((res) => res.data.params!),
    );
    this.debtParam$ = combineLatest([this.cdpParams$, this.type$]).pipe(
      map(([cdpParams, type]) => cdpParams?.debt_params?.find((param) => param.denom == type)),
    );
  }

  ngOnInit(): void {}
}
