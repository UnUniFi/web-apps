import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import ununificlient from 'ununifi-client';
import {
  AllPositions200ResponsePositionsInner,
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
  position?: AllPositions200ResponsePositionsInner | null;

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

  @Output()
  closePosition = new EventEmitter();

  marginRate?: number;
  positionType = ununificlient.proto.ununifi.derivatives.PositionType;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    const base = this.position?.market?.base_denom;
    const quote = this.position?.market?.quote_denom;
    const baseMetadata = this.denomMetadataMap?.[base || ''];
    const quoteMetadata = this.denomMetadataMap?.[quote || ''];
    const marketId = this.markets?.find(
      (market) => market.base_asset == base && market.quote_asset == quote,
    )?.market_id;
    const currentRate = this.prices?.find((price) => price.market_id == marketId)?.price;
    const size = this.positionInstance?.size;
    const leverage = this.positionInstance?.leverage;
    const requiredMargin = Number(currentRate) * Number(size);
    const margin = this.position?.remaining_margin;
    let marginAmount = 0;
    if (margin?.denom == base) {
      marginAmount =
        (Number(currentRate) * Number(margin?.amount)) /
        10 ** baseMetadata?.denom_units![0].exponent!;
    }
    if (margin?.denom == quote) {
      marginAmount = Number(margin?.amount) / 10 ** quoteMetadata?.denom_units![0].exponent!;
    }
    this.marginRate = ((marginAmount * leverage!) / requiredMargin) * 100;
  }

  onClickClose() {
    this.closePosition.emit(this.position?.id);
  }
}
