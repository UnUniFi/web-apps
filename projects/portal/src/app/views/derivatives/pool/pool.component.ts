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
  params?: ununificlient.proto.ununifi.derivatives.IPool | null;

  @Input()
  denomMetadataMap?: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } | null;

  @Input()
  symbolBalanceMap?: { [symbol: string]: number } | null;

  @Output()
  mintLPT = new EventEmitter<MintLPTEvent>();

  @Output()
  burnLPT = new EventEmitter<BurnLPTEvent>();

  poolAcceptedSymbols: string[] = [];
  dlpBalance = 0;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.params || changes.denomMetadataMap) {
      this.poolAcceptedSymbols =
        this.params?.accepted_assets?.map(
          (asset) => this.denomMetadataMap?.[asset.denom!]?.symbol!,
        ) || [];
    }
    if (changes.symbolBalancesMap) {
      this.dlpBalance = this.symbolBalanceMap?.['DLP'] || 0;
    }
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
