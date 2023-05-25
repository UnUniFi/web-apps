import { CosmosSDKService } from '../../models/cosmos-sdk.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { GetNodeInfo200Response } from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable, timer } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  nodeInfo$: Observable<GetNodeInfo200Response>;
  syncing$: Observable<boolean>;

  constructor(private cosmosSDK: CosmosSDKService) {
    const timer$ = timer(0, 60 * 60 * 1000);
    const combined$ = combineLatest([timer$, this.cosmosSDK.sdk$]).pipe(map(([_, sdk]) => sdk));

    this.nodeInfo$ = combined$.pipe(
      mergeMap((sdk) => cosmosclient.rest.tendermint.getNodeInfo(sdk.rest).then((res) => res.data)),
    );

    this.syncing$ = combined$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.tendermint.getSyncing(sdk.rest).then((res) => res.data.syncing || false),
      ),
    );
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
