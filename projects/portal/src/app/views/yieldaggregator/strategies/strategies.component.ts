import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
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
  denomMetadataMap?: {
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  } | null;
  @Input()
  symbolImageMap?: { [symbol: string]: string };
  @Input()
  availableDenoms?: string[] | null;
  @Input()
  strategies?: StrategyAll200ResponseStrategiesInner[] | null;
  @Output()
  changeDenom: EventEmitter<string>;

  constructor() {
    this.changeDenom = new EventEmitter();
  }

  ngOnInit(): void {}

  onChangeDenom() {
    if (!this.denom) {
      return;
    }
    this.changeDenom.emit(this.denom);
  }
}
