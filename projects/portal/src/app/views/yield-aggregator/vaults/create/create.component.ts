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
  symbolBalancesMap?: { [symbol: string]: number } | null;
  @Input()
  symbolMetadataMap?: { [symbol: string]: cosmos.bank.v1beta1.IMetadata } | null;
  @Output()
  changeDenom: EventEmitter<string>;
  @Output()
  appCreate: EventEmitter<CreateVaultRequest>;

  name?: string;
  commissionRate = 0.5;
  depositAmount = 0.001;
  feeAmount = 0.0005;
  firstStrategy: { id?: string; weight: number } = { id: undefined, weight: 100 };
  selectedStrategies: { id?: string; weight: number }[] = [];

  constructor() {
    this.changeDenom = new EventEmitter();
    this.appCreate = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickAddStrategy() {
    this.selectedStrategies.push({ weight: 0 });
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
    strategies.unshift(this.firstStrategy);
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
    this.appCreate.emit({
      name: this.name,
      symbol: this.selectedSymbol,
      strategies: filteredStrategies,
      commissionRate: this.commissionRate,
      feeAmount: this.feeAmount,
      depositAmount: this.depositAmount,
    });
  }
}
