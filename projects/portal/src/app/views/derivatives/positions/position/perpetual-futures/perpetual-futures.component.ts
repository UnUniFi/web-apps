import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import ununificlient from 'ununifi-client';
import {
  AddressPositions200ResponsePositionsInner,
  MarketAll200ResponseMarketsInner,
  Price200ResponsePrice,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-perpetual-futures',
  templateUrl: './perpetual-futures.component.html',
  styleUrls: ['./perpetual-futures.component.css'],
})
export class PerpetualFuturesComponent implements OnInit {
  @Input()
  position?: AddressPositions200ResponsePositionsInner | null;

  @Input()
  positionInstance?: ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance | null;

  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

  @Input()
  prices?: Price200ResponsePrice[] | null;

  @Input()
  markets?: MarketAll200ResponseMarketsInner[] | null;

  @Input()
  market?: string;

  @Input()
  baseSymbol?: string | null;

  @Input()
  quoteSymbol?: string | null;

  @Input()
  openedRate?: number;

  @Output()
  closePosition = new EventEmitter();

  // marginRate?: number;
  positionType = ununificlient.proto.ununifi.derivatives.PositionType;

  constructor() {}

  ngOnInit(): void {}

  onClickClose() {
    this.closePosition.emit(this.position?.position?.id);
  }
}
