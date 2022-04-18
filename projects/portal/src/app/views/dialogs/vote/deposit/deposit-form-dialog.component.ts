import { ProposalContent } from '../../../vote/proposals/proposals.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { InlineResponse20052Proposals } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type DepositOnSubmitEvent = {
  amount: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
};

@Component({
  selector: 'view-deposit-form-dialog',
  templateUrl: './deposit-form-dialog.component.html',
  styleUrls: ['./deposit-form-dialog.component.css'],
})
export class DepositFormDialogComponent implements OnInit {
  @Input()
  proposal?: InlineResponse20052Proposals | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  coins?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  uguuBalance?: string | null;
  @Input()
  minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  proposalID?: number | null;

  @Output()
  appSubmit: EventEmitter<DepositOnSubmitEvent>;

  selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedAmount?: proto.cosmos.base.v1beta1.ICoin;

  constructor() {
    this.appSubmit = new EventEmitter();
    // this.availableDenoms = this.coins?.map((coin) => coin.denom!);
    this.availableDenoms = ['uguu'];

    this.selectedAmount = { denom: 'uguu', amount: '0' };
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void {}

  getColorCode(address: string) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(address ?? ''))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  unpackContent(value: any) {
    try {
      return cosmosclient.codec.unpackCosmosAny(value) as ProposalContent;
    } catch {
      return null;
    }
  }

  onSubmit() {
    if (!this.selectedAmount) {
      return;
    }
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.appSubmit.emit({ amount: this.selectedAmount, minimumGasPrice: this.selectedGasPrice });
  }

  onMinimumGasDenomChanged(denom: string): void {
    this.selectedGasPrice = this.minimumGasPrices?.find(
      (minimumGasPrice) => minimumGasPrice.denom === denom,
    );
  }

  onMinimumGasAmountSliderChanged(amount: string): void {
    if (this.selectedGasPrice) {
      this.selectedGasPrice.amount = amount;
    }
  }
}
