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
import {
  AllPositions200ResponsePositionsInner,
  MarketAll200ResponseMarketsInner,
  Price200ResponsePrice,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnInit, OnChanges {
  @Input()
  position?: AllPositions200ResponsePositionsInner | null;

  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

  @Input()
  prices?: Price200ResponsePrice[] | null;

  @Input()
  markets?: MarketAll200ResponseMarketsInner[] | null;

  @Output()
  closePosition = new EventEmitter<string>();

  perpetualFuturesPositionInstance?: ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance | null;
  perpetualOptionsPositionInstance?: ununificlient.proto.ununifi.derivatives.PerpetualOptionsPositionInstance | null;
  market?: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.position && changes.denomMetadataMap) {
      const baseMetadata = this.denomMetadataMap?.[this.position?.market?.base_denom || ''];
      const quoteMetadata = this.denomMetadataMap?.[this.position?.market?.quote_denom || ''];
      if (baseMetadata && quoteMetadata) {
        this.market = baseMetadata.symbol + '/' + quoteMetadata.symbol;
      } else {
        this.market = this.position?.market?.base_denom + '/' + this.position?.market?.quote_denom;
      }
    }

    if (changes.position) {
      const positionInstance = cosmosclient.codec.protoJSONToInstance(
        this.position?.position_instance as any,
      );
      if (
        positionInstance instanceof
        ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance
      ) {
        positionInstance.size = (Number(positionInstance.size) * 10 ** 12).toString();
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
