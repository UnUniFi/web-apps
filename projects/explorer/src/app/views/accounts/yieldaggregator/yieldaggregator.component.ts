import { Component, Input, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import ununificlient from 'ununifi-client';

@Component({
  selector: 'view-yieldaggregator',
  templateUrl: './yieldaggregator.component.html',
  styleUrls: ['./yieldaggregator.component.css'],
})
export class YieldaggregatorComponent implements OnInit {
  @Input()
  depositors?: string[] | null;
  @Input()
  addressTVLs?:
    | {
        address: string;
        vaultBalances: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined;
        values: number[];
        tvl: number;
      }[]
    | null;

  constructor() {}

  ngOnInit(): void {}
}
