import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AllPositions200ResponsePositionsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnInit {
  @Input()
  position?: AllPositions200ResponsePositionsInner | null;

  @Output()
  closePosition = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  onClosePosition() {
    this.closePosition.emit(this.position?.id);
  }
}
