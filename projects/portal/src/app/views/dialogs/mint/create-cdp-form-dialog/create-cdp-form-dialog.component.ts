import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';
import { ununifi } from 'ununifi-client';
import { InlineResponse2004Cdp1 } from 'ununifi-client/cjs/openapi';

export type CreateCdpOnSubmitEvent = {
  collateralType: string;
  collateral: proto.cosmos.base.v1beta1.ICoin;
  principal: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  balances: proto.cosmos.base.v1beta1.ICoin[];
  gasRatio: number;
};

@Component({
  selector: 'view-create-cdp-form-dialog',
  templateUrl: './create-cdp-form-dialog.component.html',
  styleUrls: ['./create-cdp-form-dialog.component.css'],
})
export class CreateCdpFormDialogComponent implements OnInit {
  @Input()
  collateralParam?: ununifi.cdp.ICollateralParam;
  @Input()
  collateralBalance?: string | null;
  @Input()
  coins?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  cdpParams?: ununifi.cdp.IParams | null;
  @Input()
  minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  balances?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  collateralLimit?: number | null;
  @Input()
  principalLimit?: number | null;

  @Input()
  cdp?: InlineResponse2004Cdp1 | null;

  @Output()
  appSubmit: EventEmitter<CreateCdpOnSubmitEvent>;

  @Output()
  appCollateralAmountChanged: EventEmitter<number>;

  selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedAmount?: proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;

  constructor() {
    this.appSubmit = new EventEmitter();
    this.selectedAmount = { denom: 'uguu', amount: '0' };
    this.gasRatio = 1.1;
    this.appCollateralAmountChanged = new EventEmitter();
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void {}

  changeGasRatio(ratio: number) {
    this.gasRatio = ratio;
  }

  onSubmit(
    collateralDenom: string,
    collateralAmount: string,
    principalDenom: string,
    principalAmount: string,
    minimumGasPrice: string,
  ) {
    if (!collateralAmount || !principalAmount) {
      return;
    }
    if (this.selectedGasPrice === undefined) {
      return;
    }
    if (!this.balances) {
      console.error('create-balances', this.balances);
      return;
    }
    if (this.cdp && this.cdp.cdp?.type === this.collateralParam?.type) {
      console.error(
        `Already have : ${this.collateralParam?.type} CDP. \n ID: ${this.cdp.cdp?.id}`,
        'Close',
      );
      return;
    }
    if (!this.collateralParam?.type || !this.selectedAmount || !this.selectedGasPrice) {
      return;
    }
    this.selectedAmount.amount = this.selectedAmount.amount?.toString();
    this.appSubmit.emit({
      collateralType: this.collateralParam.type,
      collateral: {
        denom: collateralDenom,
        amount: collateralAmount,
      },
      principal: {
        denom: principalDenom,
        amount: principalAmount,
      },
      minimumGasPrice: this.selectedGasPrice,
      balances: this.balances,
      gasRatio: this.gasRatio,
    });
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
  onCollateralAmountChanged(amount: number): void {
    this.appCollateralAmountChanged.emit(amount);
  }
}
