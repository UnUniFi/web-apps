import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20038, InlineResponse20041 } from '@cosmos-client/core/esm/openapi';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { Observable } from 'rxjs';
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
    private readonly cosmosRest: CosmosRestService,
  ) {
    const address$ = this.route.params.pipe(
      map((params) => params.address),
      map((addr) => cosmosclient.AccAddress.fromString(addr)),
    );

    this.delegations$ = address$.pipe(
      mergeMap((address) => this.cosmosRest.getDelegatorDelegations$(address)),
    );
    this.validators$ = address$.pipe(
      mergeMap((address) => this.cosmosRest.getDelegatorValidators$(address)),
    );
  }

  ngOnInit(): void {}
}
