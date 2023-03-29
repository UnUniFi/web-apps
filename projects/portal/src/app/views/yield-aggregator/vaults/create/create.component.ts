import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { CreateVaultRequest } from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';
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

  name?: string;
  selectedStrategyId?: string;
  selectedStrategies: { id?: string; name?: string; weight: number }[] = [];

  constructor() {
    this.changeDenom = new EventEmitter();
    this.appCreate = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickAddStrategy() {
    if (!this.selectedStrategyId) {
      alert('Please select a strategy.');
      return;
    }
    this.selectedStrategies.push({
      id: this.selectedStrategyId,
      name: this.strategies?.find((s) => s.id === this.selectedStrategyId)?.name,
      weight: 0,
    });
  }
  onClickDeleteStrategy(index: number) {
    this.selectedStrategies.splice(index, 1);
  }
  onChangeSymbol() {
    if (!this.selectedSymbol) {
      return;
    }
    const denom = this.symbolMetadataMap?.[this.selectedSymbol].base;
    console.log(denom);
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
    if (!this.name) {
      alert('Invalid Name.');
      return;
    }
    if (!this.selectedSymbol) {
      alert('Invalid Asset.');
      return;
    }
    if (!this.fee || !this.deposit) {
      alert('Invalid Fee or Deposit.');
      return;
    }
    this.appCreate.emit({
      name: this.name,
      symbol: this.selectedSymbol,
      strategies: filteredStrategies,
      commissionRate: Number(this.commissionRate),
      feeAmount: this.fee.amount,
      feeSymbol: this.fee.symbol,
      depositAmount: this.deposit.amount,
      depositSymbol: this.deposit.symbol,
    });
  }

  onClickOpenStrategyDetail(id?: string) {
    const rootPath = window.location.origin;
    window.open(
      rootPath + '/portal/yield-aggregator/strategies/' + this.denom + '/' + id,
      '_blank',
    );
  }
}
