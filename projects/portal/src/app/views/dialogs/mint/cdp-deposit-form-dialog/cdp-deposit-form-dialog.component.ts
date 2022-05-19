import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

export type CdpDepositOnSubmitEvent = {
  ownerAddress: cosmosclient.AccAddress;
  collateralType: string;
  collateral: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  balances: proto.cosmos.base.v1beta1.ICoin[];
  gasRatio: number;
};

@Component({
  selector: 'view-cdp-deposit-form-dialog',
  templateUrl: './cdp-deposit-form-dialog.component.html',
  styleUrls: ['./cdp-deposit-form-dialog.component.css'],
})
export class CdpDepositFormDialogComponent implements OnInit {
  @Input()
  cdp?: InlineResponse2004Cdp1;

  @Input()
  collateralBalance?: string | null;

  @Input()
  minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Input()
  coins?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output()
  appSubmit: EventEmitter<CdpDepositOnSubmitEvent>;

  public selectedAmount: proto.cosmos.base.v1beta1.ICoin;
  public selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  public gasRatio: number;

  constructor() {
    this.appSubmit = new EventEmitter();
    this.selectedAmount = { amount: '0' };
    this.gasRatio = 1.1;
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  onSubmit() {
    console.log(this.selectedGasPrice);
    if (!this.selectedGasPrice || !this.cdp?.cdp?.owner || !this.cdp.cdp.type) {
      return;
    }

    if (!this.coins) {
      console.error('deposit-balances', this.coins);
      return;
    }

    this.selectedAmount.amount = this.selectedAmount.amount?.toString();
    this.selectedAmount.denom = this.cdp.cdp.collateral?.denom;
    console.log(this.cdp.cdp.owner);
    this.appSubmit.emit({
      ownerAddress: cosmosclient.AccAddress.fromString(this.cdp?.cdp?.owner),
      collateralType: this.cdp.cdp.type,
      collateral: this.selectedAmount,
      minimumGasPrice: this.selectedGasPrice,
      balances: this.coins,
      gasRatio: this.gasRatio,
    });
  }
  changeGasRatio(ratio: number) {
    this.gasRatio = ratio;
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
