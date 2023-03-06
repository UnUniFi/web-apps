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
  openedRate?: number;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.position && changes.denomMetadataMap) {
      const baseDenom = this.position?.position?.market?.base_denom;
      const quoteDenom = this.position?.position?.market?.quote_denom;
      const baseMetadata = this.denomMetadataMap?.[baseDenom || ''];
      const quoteMetadata = this.denomMetadataMap?.[quoteDenom || ''];
      if (baseMetadata && quoteMetadata) {
        this.market = baseMetadata.symbol + '/' + quoteMetadata.symbol;
      } else {
        this.market = baseDenom + '/' + quoteDenom;
      }
    }

    if (changes.position) {
      const positionInstance = cosmosclient.codec.protoJSONToInstance(
        this.position?.position?.position_instance as any,
      );
      const baseRate = this.position?.position?.opened_base_rate;
      const quoteRate = this.position?.position?.opened_quote_rate;
      this.openedRate = Number(baseRate) / Number(quoteRate);
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

  onClosePosition($event: string) {
    this.closePosition.emit($event);
  }
}
