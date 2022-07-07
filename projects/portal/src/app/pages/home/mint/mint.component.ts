import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import {
  CosmosMintV1beta1QueryAnnualProvisionsResponse,
  CosmosMintV1beta1QueryInflationResponse,
} from '@cosmos-client/core/esm/openapi/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  inflation$: Observable<CosmosMintV1beta1QueryInflationResponse>;
  annualProvisions$: Observable<CosmosMintV1beta1QueryAnnualProvisionsResponse>;

  constructor(private readonly cosmosRest: CosmosRestService) {
    this.inflation$ = this.cosmosRest.getInflation$();
    this.annualProvisions$ = this.cosmosRest.getAnnualProvisions$();
  }

  ngOnInit(): void {}
}
