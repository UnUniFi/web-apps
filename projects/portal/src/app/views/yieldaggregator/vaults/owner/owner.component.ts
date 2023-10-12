import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransferVaultRequest } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.model';
import {
  StrategyAll200ResponseStrategiesInner,
  VaultAll200ResponseVaultsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css'],
})
export class OwnerComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  owner?: string | null;

  @Input()
  symbols?: { symbol: string; display: string; img: string }[] | null;
  @Input()
  vaults?: VaultAll200ResponseVaultsInner[] | null;
  @Input()
  strategies?: StrategyAll200ResponseStrategiesInner[] | null;

  @Output()
  appTransfer: EventEmitter<TransferVaultRequest>;
  recipientAddress?: string;

  constructor() {
    this.appTransfer = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmitTransfer(vaultId?: string) {
    if (!this.recipientAddress || !vaultId) {
      return;
    }
    this.appTransfer.emit({ vaultId, recipientAddress: this.recipientAddress });
  }

  getStrategyDetail(strategyId?: string): StrategyAll200ResponseStrategiesInner | undefined {
    if (!strategyId) {
      return;
    }
    const strategy = this.strategies?.find((strategy) => strategy.strategy?.id === strategyId);
    if (!strategy) {
      return;
    }
    return strategy;
  }
}
