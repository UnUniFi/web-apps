import { Component, Input, OnInit } from '@angular/core';
import { CosmosMintV1beta1QueryInflationResponse } from '@cosmos-client/core/esm/openapi';

@Component({
  selector: 'view-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @Input()
  latestBlockHeight?: bigint | null;
  @Input()
  totalSupply?: number | null;
  @Input()
  stakedTokens?: number | null;
  @Input()
  stakedRatio?: string | null;
  @Input()
  inflation?: string | null;
  constructor() {}

  ngOnInit(): void {}
}
