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
  dlpRates?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

  @Input()
  symbolMetadataMap?: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

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

  tab: 'buy' | 'sell' = 'buy';
  poolAcceptedSymbols: string[] = ['BTC', 'USDC'];
  mintSymbol: string = 'BTC';
  redeemSymbol: string = 'BTC';
  dlpBalance = 0;
  calculatedDLPAmount? = 0;
  calculatedRedeemAmount? = 0;

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
    if (this.symbolMetadataMap && this.dlpRates) {
      const metadata = this.symbolMetadataMap[symbol];
      const rate = this.dlpRates?.find((rate) => rate.denom == metadata.base);
      const denomUnit = metadata.denom_units?.find((u) => u.denom === metadata.base);
      if (rate && rate.amount && rate.amount != '0') {
        this.calculatedDLPAmount = (amount * 10 ** denomUnit?.exponent!) / Number(rate?.amount);
      } else {
        this.calculatedDLPAmount = 0;
      }
    } else {
      this.calculatedDLPAmount = 0;
    }
    this.estimateMint.emit({
      symbol,
      amount,
    });
  }

  onEstimateBurn(amount: number, redeemSymbol: string) {
    if (this.symbolMetadataMap && this.dlpRates) {
      const metadata = this.symbolMetadataMap[redeemSymbol];
      const rate = this.dlpRates.find((rate) => rate.denom == metadata.base);
      const denomUnit = metadata.denom_units?.find((u) => u.denom === metadata.base);
      this.calculatedRedeemAmount = (amount * Number(rate?.amount)) / 10 ** denomUnit?.exponent!;
    } else {
      this.calculatedRedeemAmount = 0;
    }
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
