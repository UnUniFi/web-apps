import { Component, Input, OnInit } from '@angular/core';
import {
  CosmosDistributionV1beta1QueryValidatorSlashesResponse,
  ValidatorOutstandingRewards200Response,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from '@cosmos-client/core/esm/openapi/api';

@Component({
  selector: 'view-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css'],
})
export class DistributionComponent implements OnInit {
  @Input()
  commission?: QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod | null;
  @Input()
  rewards?: ValidatorOutstandingRewards200Response | null;
  @Input()
  slashes?: CosmosDistributionV1beta1QueryValidatorSlashesResponse | null;

  constructor() {}

  ngOnInit(): void {}
}
