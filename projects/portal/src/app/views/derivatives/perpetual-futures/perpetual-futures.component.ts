import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import ununificlient from 'ununifi-client';

@Component({
  selector: 'view-perpetual-futures',
  templateUrl: './perpetual-futures.component.html',
  styleUrls: ['./perpetual-futures.component.css'],
})
export class PerpetualFuturesComponent implements OnInit, OnChanges {
  @Input()
  info?: ununificlient.proto.ununifi.derivatives.IQueryPerpetualFuturesResponse | null;
  @Input()
  params?: ununificlient.proto.ununifi.derivatives.IPerpetualFuturesParams | null;
  @Input()
  markets?: string[] | null;
  @Input()
  selectedMarket?: string | null;

  @Output()
  changeMarket = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  onChangeMarket(market: string): void {
    this.changeMarket.emit(market);
  }
}
