import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import ununificlient from 'ununifi-client';
import { AllPositions200ResponsePositionsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnInit, OnChanges {
  @Input()
  position?: AllPositions200ResponsePositionsInner | null;

  @Output()
  closePosition = new EventEmitter<string>();

  perpetualFuturesPositionInstance?: ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance | null;
  perpetualOptionsPositionInstance?: ununificlient.proto.ununifi.derivatives.PerpetualOptionsPositionInstance | null;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.position) {
      const positionInstance = cosmosclient.codec.protoJSONToInstance(
        this.position?.position_instance as any,
      );
      if (
        positionInstance instanceof
        ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance
      ) {
        this.perpetualFuturesPositionInstance = positionInstance;
      } else if (
        positionInstance instanceof
        ununificlient.proto.ununifi.derivatives.PerpetualOptionsPositionInstance
      ) {
        this.perpetualOptionsPositionInstance = positionInstance;
      }
    }
  }

  onClosePosition() {
    this.closePosition.emit(this.position?.id);
  }
}
