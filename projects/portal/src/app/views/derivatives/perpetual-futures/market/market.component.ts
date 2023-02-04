import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import ununificlient from 'ununifi-client';

declare const TradingView: any;

export type OpenPositionEvent = {
  marginSymbol: string;
  marginAmount: number;
  baseSymbol: string;
  quoteSymbol: string;
  positionType: ununificlient.proto.ununifi.derivatives.PositionType;
  size: number;
  leverage: number;
};

@Component({
  selector: 'view-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
})
export class MarketComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  baseSymbol?: string | null;

  @Input()
  quoteSymbol?: string | null;

  @Input()
  params?: ununificlient.proto.ununifi.derivatives.IPerpetualFuturesParams | null;

  @Input()
  info?: ununificlient.proto.ununifi.derivatives.IQueryPerpetualFuturesMarketResponse | null;

  @Input()
  symbolBalancesMap?: { [symbol: string]: number } | null;

  @Output()
  openPosition = new EventEmitter<OpenPositionEvent>();

  leverage = 1;
  marginAmount = 0;
  maxMargin = 100;
  minMargin = 0;
  marginSymbol?: string | null;

  positionType = ununificlient.proto.ununifi.derivatives.PositionType;
  tradingViewConfig: { [market: string]: any } = {
    'ETH/USD': {
      autosize: true,
      symbol: 'COINBASE:ETHUSD',
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_legend: true,
      save_image: false,
      container_id: 'tradingview_5b3c4',
    },
    'BTC/USD': {
      autosize: true,
      symbol: 'COINBASE:BTCUSD',
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_legend: true,
      save_image: false,
      container_id: 'tradingview_5b3c4',
    },
    'ATOM/USD': {
      autosize: true,
      symbol: 'COINBASE:ATOMUSD',
      interval: '60',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_legend: true,
      save_image: false,
      container_id: 'tradingview_5b3c4',
    },
  };

  constructor() {}

  ngOnInit(): void {}

  updateTradingView() {
    const getMarket = (baseSymbol?: string | null, quoteSymbol?: string | null) =>
      `${baseSymbol}/${quoteSymbol}`;

    const market = getMarket(this.baseSymbol, this.quoteSymbol);
    if (this.tradingViewConfig[market]) {
      TradingView.widget(this.tradingViewConfig[market]);
    }
  }

  ngAfterViewInit(): void {
    this.updateTradingView();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.baseSymbol || changes.quoteSymbol) {
      this.updateTradingView();

      if (changes.symbolBalancesMap) {
        this.maxMargin = this.symbolBalancesMap?.[this.quoteSymbol || ''] ?? 0;
      }
    }
  }

  onTogglePositionType(positionType: ununificlient.proto.ununifi.derivatives.PositionType) {
    switch (positionType) {
      case ununificlient.proto.ununifi.derivatives.PositionType.LONG:
        this.marginSymbol = this.quoteSymbol;
        break;
      case ununificlient.proto.ununifi.derivatives.PositionType.SHORT:
        this.marginSymbol = this.baseSymbol;
        break;
    }
  }

  onClickSetMargin(size: number, leverage: number) {
    this.marginAmount = size / leverage;
  }

  onSubmit(
    size: number,
    leverage: number,
    marginAmount: number,
    positionType: ununificlient.proto.ununifi.derivatives.PositionType,
  ) {
    this.openPosition.emit({
      marginSymbol: this.marginSymbol || '',
      marginAmount: marginAmount,
      baseSymbol: this.baseSymbol || '',
      quoteSymbol: this.quoteSymbol || '',
      positionType,
      size,
      leverage,
    });
  }
}
