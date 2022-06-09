import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { Key } from 'projects/portal/src/app/models/keys/key.model';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

export type ClearCdpOnSubmitEvent = {
  key: Key;
  privateKey: Uint8Array;
  ownerAddr: cosmosclient.AccAddress;
  collateralType: string;
  repayment: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  balances: proto.cosmos.base.v1beta1.ICoin[];
  gasRatio: number;
};

@Component({
  selector: 'view-cdp-clear-form-dialog',
  templateUrl: './cdp-clear-form-dialog.component.html',
  styleUrls: ['./cdp-clear-form-dialog.component.css'],
})
export class CdpClearFormDialogComponent implements OnInit {
  @Input()
  cdp?: InlineResponse2004Cdp1;

  @Input()
  key?: Key | null;

  @Input()
  owner?: string | null;

  @Input()
  collateralType?: string | null;

  @Input()
  repaymentDenom?: proto.cosmos.base.v1beta1.ICoin | null;

  @Input()
  minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Input()
  balances?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output()
  appSubmit: EventEmitter<ClearCdpOnSubmitEvent>;

  public repayment_amount: string;
  public selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  public gasRatio: number;

  constructor() {
    this.appSubmit = new EventEmitter();
    this.repayment_amount = '';
    this.gasRatio = 1.1;
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void {}

  onSubmit(privateKeyString: string, ownerAddr: string) {
    console.log(this.selectedGasPrice);
    if (!this.selectedGasPrice || !this.cdp?.cdp?.owner || !this.cdp.cdp.type) {
      return;
    }
    if (!this.balances) {
      console.error('clear-balances', this.balances);
      return;
    }

    const privateKeyWithNoWhitespace = privateKeyString.replace(/\s+/g, '');
    const privateKeyBuffer = Buffer.from(privateKeyWithNoWhitespace, 'hex');
    const privateKey = Uint8Array.from(privateKeyBuffer);

    this.appSubmit.emit({
      key: this.key!,
      privateKey,
      ownerAddr: cosmosclient.AccAddress.fromString(ownerAddr),
      collateralType: this.cdp.cdp.type,
      repayment: {
        denom: this.repaymentDenom?.denom,
        amount: this.repaymentDenom?.amount,
      },
      minimumGasPrice: this.selectedGasPrice,
      balances: this.balances,
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
