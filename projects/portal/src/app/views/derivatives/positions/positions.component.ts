import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  AllPositions200ResponsePositionsInner,
  MarketAll200ResponseMarketsInner,
  Price200ResponsePrice,
} from 'ununifi-client/esm/openapi';

export type ClosePositionEvent = {
  positionId: string;
};

@Component({
  selector: 'view-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  @Input()
  positions?: AllPositions200ResponsePositionsInner[] | null;

  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

  @Input()
  prices?: Price200ResponsePrice[] | null;

  @Input()
  markets?: MarketAll200ResponseMarketsInner[] | null;

  @Input()
  longPositionsTotal?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;

  @Input()
  shortPositionsTotal?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;

  @Output()
  closePosition = new EventEmitter<ClosePositionEvent>();

  constructor() {}

  ngOnInit(): void {}

  onClosePosition($event: string) {
    this.closePosition.emit({
      positionId: $event,
    });
  }
}
