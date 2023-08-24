import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmos } from '@cosmos-client/core/esm/proto';
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
  availableSymbols?: ({ symbol: string; display: string } | undefined)[] | null;
  @Input()
  selectedSymbol?: string | null;
  @Input()
  strategies?: StrategyAll200ResponseStrategiesInner[] | null;
  @Input()
  commissionRate?: number | null;
  @Input()
  deposit?: { symbol: string; amount: number } | null;
  @Input()
  fee?: { symbol: string; amount: number } | null;
  @Input()
  symbolBalancesMap?: { [symbol: string]: number } | null;
  @Input()
  symbolMetadataMap?: { [symbol: string]: cosmos.bank.v1beta1.IMetadata } | null;
  @Output()
  changeDenom: EventEmitter<string>;
  @Output()
  appCreate: EventEmitter<CreateVaultRequest>;

  reserveRate?: number;
  name?: string;
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
      weight: 0,
    });
    this.selectedStrategies.sort((a, b) => a.id!.localeCompare(b.id!));

    (global as any).addStrategyModal.close();
  }

  onClickDeleteStrategy(index: number) {
    this.selectedStrategies.splice(index, 1);
  }

  onChangeSymbol() {
    this.selectedStrategies = [];
    if (!this.selectedSymbol) {
      return;
    }
    const denom = this.symbolMetadataMap?.[this.selectedSymbol].base;
    if (denom) {
      this.changeDenom.emit(denom);
    }
  }

  onSubmitCreate() {
    const strategies = this.selectedStrategies.slice();
    strategies.filter((s) => s.id && s.weight > 0);
    if (strategies.reduce((sum, s) => sum + s.weight, 0) !== 100) {
      alert('The total of the strategies should be 100%.');
      return;
    }
    const filteredStrategies = strategies.map((s) => ({ id: s.id!, weight: s.weight }));
    if (!this.selectedSymbol) {
      alert('Invalid Asset.');
      return;
    }
    if (!this.fee || !this.deposit) {
      alert('Invalid Fee or Deposit.');
      return;
    }
    if (!this.reserveRate) {
      return;
    }
    this.appCreate.emit({
      name: this.name || '',
      symbol: this.selectedSymbol,
      strategies: filteredStrategies,
      commissionRate: Number(this.commissionRate),
      reserveRate: Number(this.reserveRate),
      feeAmount: this.fee.amount,
      feeSymbol: this.fee.symbol,
      depositAmount: this.deposit.amount,
      depositSymbol: this.deposit.symbol,
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
