import { Component, Input, OnChanges, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { YieldInfo } from 'projects/portal/src/app/models/config.service';
import {
  StrategyAll200ResponseStrategiesInner,
  VaultAll200ResponseVaultsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css'],
})
export class StrategyComponent implements OnInit, OnChanges {
  @Input()
  id?: string | null;
  @Input()
  denom?: string | null;
  @Input()
  denomMetadataMap?: {
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  } | null;
  @Input()
  symbolImageMap?: { [symbol: string]: string } | null;
  @Input()
  strategy?: StrategyAll200ResponseStrategiesInner | null;
  @Input()
  vaults?: VaultAll200ResponseVaultsInner[] | null;
  @Input()
  weights?: (string | undefined)[] | null;
  @Input()
  strategyInfo?: YieldInfo | null;
  @Input()
  strategyAPR?: number | null;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {}
}
