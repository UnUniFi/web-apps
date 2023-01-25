import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-perpetual-futures',
  templateUrl: './perpetual-futures.component.html',
  styleUrls: ['./perpetual-futures.component.css'],
})
export class PerpetualFuturesComponent implements OnInit {
  configs$: Observable<string[]>;
  selectedConfig$: Observable<string>;
  payAssets$: Observable<string[]>;
  selectedPayAsset$: Observable<string>;
  targetAssets$: Observable<string[]>;
  selectedTargetAsset$: Observable<string>;

  constructor() {
    this.configs$ = of(['ETH/USD', 'BTC/USD', 'ATOM/USD']);
    this.selectedConfig$ = of('ETH/USD');
    this.payAssets$ = of(['GUU', 'ETH', 'BTC', 'ATOM', 'USDC']);
    this.selectedPayAsset$ = of('GUU');
    this.targetAssets$ = of(['ETH', 'BTC', 'ATOM']);
    this.selectedTargetAsset$ = of('ETH');
  }

  ngOnInit(): void {}

  onSubmitOrder($event: string) {}

  onChangeConfig($event: string) {}
}
