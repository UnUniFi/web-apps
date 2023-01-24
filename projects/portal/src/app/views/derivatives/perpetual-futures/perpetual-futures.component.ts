import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface Asset {
  price: string;
  changeRate: string;
  high: string;
  low: string;
}
declare const TradingView: any;

@Component({
  selector: 'view-perpetual-futures',
  templateUrl: './perpetual-futures.component.html',
  styleUrls: ['./perpetual-futures.component.css'],
})
export class PerpetualFuturesComponent implements OnInit, AfterViewInit {
  @Input()
  configs?: string[];
  @Input()
  selectedConfig?: string | null;
  @Input()
  payAssets?: string[];
  @Input()
  selectedPayAssets?: string;
  @Input()
  tradeAssets?: string[];
  @Input()
  selectedTradeAssets?: string;

  @Output()
  appChangeConfig: EventEmitter<string>;
  @Output()
  toggleLongChange: EventEmitter<boolean>;

  asset: Asset;
  changePercentage: string;

  payAmount: number;
  tradeAmount: number;

  rate: number;
  leverage: number;

  constructor() {
    this.appChangeConfig = new EventEmitter();
    this.toggleLongChange = new EventEmitter();

    this.configs = ['ETH/USD', 'BTC/USD', 'ATOM/USD'];
    this.selectedConfig = 'ETH/USD';
    this.payAssets = ['GUU', 'ETH', 'BTC', 'ATOM', 'USDC'];
    this.selectedPayAssets = 'GUU';
    this.tradeAssets = ['ETH', 'BTC', 'ATOM'];
    this.selectedTradeAssets = 'ETH';
    this.asset = { price: '1300', changeRate: '0.0015', high: '1400', low: '1260' };
    this.changePercentage = '+' + (Number(this.asset.changeRate) * 100).toLocaleString() + '%';
    this.payAmount = 0;
    this.tradeAmount = 0;
    this.rate = 2700;
    this.leverage = 1;
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    new TradingView.widget({
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
    });
  }

  onChangeConfig(config: string): void {
    this.selectedConfig = config;
    this.appChangeConfig.emit(config);
    if (config === 'ETH/USD') {
      new TradingView.widget({
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
      });
    } else if (config === 'BTC/USD') {
      new TradingView.widget({
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
      });
    } else if (config === 'ATOM/USD') {
      new TradingView.widget({
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
      });
    }
  }

  onChangePayAmount(): void {
    this.tradeAmount = this.payAmount / this.rate;
  }

  onChangeTradeAmount(): void {
    this.payAmount = this.tradeAmount * this.rate;
  }

  onToggleChange(value: string) {
    if (value == 'long') {
      this.toggleLongChange.emit(true);
    }
    if (value == 'short') {
      this.toggleLongChange.emit(false);
    }
  }

  formatLabel(value: number): string {
    return value.toLocaleString();
  }
}
