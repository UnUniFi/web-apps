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
import { EstimateDLPTokenAmount200Response } from 'ununifi-client/esm/openapi';

export type MintLPTEvent = {
  symbol: string;
  amount: number;
};

export type BurnLPTEvent = {
  amount: number;
  redeemSymbol: string;
};

@Component({
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit, OnChanges {
  @Input()
  pool?: ununificlient.proto.ununifi.derivatives.IQueryPoolResponse | null;

  @Input()
  params?: ununificlient.proto.ununifi.derivatives.IPoolParams | null;

  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

  @Input()
  symbolBalancesMap?: { [symbol: string]: number } | null;

  @Input()
  estimatedLPTAmount?: EstimateDLPTokenAmount200Response | null;

  @Input()
  estimatedRedeemAmount?: EstimateDLPTokenAmount200Response | null;

  @Output()
  estimateMint = new EventEmitter<MintLPTEvent>();

  @Output()
  estimateBurn = new EventEmitter<BurnLPTEvent>();

  @Output()
  mintLPT = new EventEmitter<MintLPTEvent>();

  @Output()
  burnLPT = new EventEmitter<BurnLPTEvent>();

  tab: 'mint' | 'burn' = 'mint';
  poolAcceptedSymbols: string[] = ['BTC', 'USDC'];
  mintSymbol: string = 'BTC';
  redeemSymbol: string = 'BTC';
  dlpBalance = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.params || changes.denomMetadataMap) {
    //   this.poolAcceptedSymbols =
    //     this.params?.accepted_assets?.map(
    //       (asset) => this.denomMetadataMap?.[asset.denom!]?.symbol!,
    //     ) || [];
    // }
    if (changes.symbolBalancesMap) {
      this.dlpBalance = this.symbolBalancesMap?.['DLP'] || 0;
    }
  }

  onEstimateMint(symbol: string, amount: number) {
    this.estimateMint.emit({
      symbol,
      amount,
    });
  }

  onEstimateBurn(amount: number, redeemSymbol: string) {
    this.estimateBurn.emit({
      amount,
      redeemSymbol,
    });
  }

  onSubmitMint(symbol: string, amount: number) {
    this.mintLPT.emit({
      symbol,
      amount,
    });
  }

  onSubmitBurn(amount: number, redeemSymbol: string) {
    this.burnLPT.emit({
      amount,
      redeemSymbol,
    });
  }
}
