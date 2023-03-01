import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import { CosmosDistributionV1beta1QueryCommunityPoolResponse } from '@cosmos-client/core/esm/openapi/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  communityPool$: Observable<CosmosDistributionV1beta1QueryCommunityPoolResponse>;

  constructor(private readonly cosmosRest: CosmosRestService) {
    this.communityPool$ = this.cosmosRest.getCommunityPool$();
  }

  ngOnInit(): void {}
}
