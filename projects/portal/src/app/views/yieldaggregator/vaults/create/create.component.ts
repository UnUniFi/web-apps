import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CreateVaultRequest } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.model';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi/api';

@Component({
  selector: 'view-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  denom?: string | null;
  @Input()
  availableTokens?: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[] | null;
  @Input()
  strategies?: StrategyAll200ResponseStrategiesInner[] | null;
  @Input()
  commissionRate?: number | null;
  @Input()
  deposit?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  fee?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  denomBalancesMap?: { [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin } | null;
  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;
  @Output()
  changeDenom: EventEmitter<string>;
  @Output()
  appCreate: EventEmitter<CreateVaultRequest>;

  reserveRate?: number;
  name?: string;
  description?: string;
  selectedStrategies: { id?: string; name?: string; denom?: string; weight: number }[] = [];

  constructor() {
    this.reserveRate = 10;
    this.changeDenom = new EventEmitter();
    this.appCreate = new EventEmitter();
  }

  ngOnInit(): void {}

  isAlreadySelectedStrategy(strategyId: string) {
    return this.selectedStrategies.some((s) => s.id === strategyId);
  }

  onAddStrategy(strategyId: string, strategyDenom: string) {
    if (!strategyId) {
      return;
    }
    if (!this.denom) {
      this.changeDenom.emit(strategyDenom);
    }
    this.selectedStrategies.push({
      id: strategyId,
      name: this.strategies?.find((s) => s.strategy?.id === strategyId)?.strategy?.name,
      denom: strategyDenom,
      weight: this.selectedStrategies.length ? 0 : 100,
    });
    this.selectedStrategies.sort((a, b) => a.id!.localeCompare(b.id!));

    (global as any).addStrategyModal.close();
  }

  onClickDeleteStrategy(index: number) {
    this.selectedStrategies.splice(index, 1);
  }

  onChangeDenom() {
    this.selectedStrategies = [];
    if (!this.denom) {
      return;
    }
    this.changeDenom.emit(this.denom);
  }

  onSubmitCreate() {
    const strategies = this.selectedStrategies.slice();
    strategies.filter((s) => s.id && s.weight > 0);
    if (strategies.reduce((sum, s) => sum + s.weight, 0) !== 100) {
      alert('The total of the strategies should be 100%.');
      return;
    }
    const filteredStrategies = strategies.map((s) => ({ id: s.id!, weight: s.weight }));
    if (!this.fee || !this.deposit) {
      alert('Invalid Fee or Deposit.');
      return;
    }
    if (!this.reserveRate) {
      return;
    }
    if (!this.address) {
      alert('Invalid Fee Collector Address.');
      return;
    }
    this.appCreate.emit({
      name: this.name || '',
      denom: this.denom || '',
      description: this.description || '',
      strategies: filteredStrategies,
      commissionRate: Number(this.commissionRate),
      reserveRate: Number(this.reserveRate),
      fee: {
        denom: this.fee.denom || '',
        amount: this.fee.amount || '',
      },
      deposit: {
        denom: this.deposit.denom || '',
        amount: this.deposit.amount || '',
      },
      feeCollectorAddress: this.address || '',
    });
  }

  createStrategyURL(strategy: { id?: string; name?: string; denom?: string; weight: number }) {
    const url =
      '/portal/yield-aggregator/strategies/' +
      encodeURIComponent(strategy.denom || '') +
      '/' +
      strategy.id;
    return url;
  }
}
