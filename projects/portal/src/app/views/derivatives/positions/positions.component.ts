import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { AllPositions200ResponsePositionsInner } from 'ununifi-client/esm/openapi';

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
  symbolMetadataMap?: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

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
