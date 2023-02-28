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
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

  @Output()
  changeMarket = new EventEmitter<string>();

  markets?: string[];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const getMarket = (m: ununificlient.proto.ununifi.derivatives.IMarket) => {
      const baseMetadata = this.denomMetadataMap?.[m.base_denom || ''];
      const quoteMetadata = this.denomMetadataMap?.[m.quote_denom || ''];
      if (baseMetadata && quoteMetadata) {
        return baseMetadata.symbol + '/' + quoteMetadata.symbol;
      } else {
        return m.base_denom + '/' + m.quote_denom;
      }
    };

    if (changes.params) {
      this.markets = this.params?.markets?.map((market) => getMarket(market));
    }
  }

  onChangeMarket(market: string): void {
    this.changeMarket.emit(market);
  }
}
