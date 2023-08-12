import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css'],
})
export class StrategiesComponent implements OnInit {
  @Input()
  denom?: string | null;
  @Input()
  displaySymbol?: string | null;
  @Input()
  availableSymbols?: string[] | null;
  @Input()
  symbolMetadataMap?: { [symbol: string]: cosmos.bank.v1beta1.IMetadata } | null;
  @Input()
  symbolImage?: string | null;
  @Input()
  strategies?: StrategyAll200ResponseStrategiesInner[] | null;
  @Output()
  changeDenom: EventEmitter<string>;

  constructor() {
    this.changeDenom = new EventEmitter();
  }

  ngOnInit(): void {}

  onChangeSymbol() {
    if (!this.displaySymbol) {
      return;
    }
    const denom = this.symbolMetadataMap?.[this.displaySymbol].base;
    if (denom) {
      this.changeDenom.emit(denom);
    }
  }
}
