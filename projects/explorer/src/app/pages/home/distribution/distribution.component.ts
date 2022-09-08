import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { CosmosDistributionV1beta1QueryCommunityPoolResponse } from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from '@ununifi/shared';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  communityPool$: Observable<CosmosDistributionV1beta1QueryCommunityPoolResponse>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    this.communityPool$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.distribution.communityPool(sdk.rest).then((res) => res.data),
      ),
    );
  }

  ngOnInit(): void {}
}
