import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllPositions200ResponsePositionsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  @Input()
  positions?: AllPositions200ResponsePositionsInner[] | null;

  @Output()
  closePosition = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onClosePosition($event: string) {
    this.closePosition.emit($event);
  }
}
