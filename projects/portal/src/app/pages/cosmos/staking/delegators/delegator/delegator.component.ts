import { CosmosSDKService } from '../../../../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20038, InlineResponse20041 } from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-delegator',
  templateUrl: './delegator.component.html',
  styleUrls: ['./delegator.component.css'],
})
export class DelegatorComponent implements OnInit {
  delegations$: Observable<InlineResponse20038>;
  validators$: Observable<InlineResponse20041>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
  ) {
    const address$ = this.route.params.pipe(
      map((params) => params.address),
      map((addr) => cosmosclient.AccAddress.fromString(addr)),
    );

    const combined$ = combineLatest([this.cosmosSDK.sdk$, address$]);

    this.delegations$ = combined$.pipe(
      mergeMap(([sdk, address]) => cosmosclient.rest.staking.delegatorDelegations(sdk.rest, address)),
      map((res) => res.data),
    );

    this.validators$ = combined$.pipe(
      mergeMap(([sdk, address]) => cosmosclient.rest.staking.delegatorValidators(sdk.rest, address)),
      map((res) => res.data),
    );
  }

  ngOnInit(): void { }
}
