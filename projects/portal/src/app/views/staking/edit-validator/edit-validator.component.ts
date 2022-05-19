import { EditValidatorData } from '../../../models/cosmos/staking.model';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { proto } from '@cosmos-client/core';

@Component({
  selector: 'view-edit-validator',
  templateUrl: './edit-validator.component.html',
  styleUrls: ['./edit-validator.component.css'],
})
export class ViewEditValidatorComponent implements OnInit {
  @Input() currentStoredWallet?: StoredWallet | null;
  @Input() moniker?: string | null;
  @Input() identity?: string | null;
  @Input() website?: string | null;
  @Input() security_contact?: string | null;
  @Input() details?: string | null;
  @Input() rate?: string | null;
  @Input() min_self_delegation?: string | null;
  @Input() delegator_address?: string | null;
  @Input() validator_address?: string | null;
  @Input() denom?: string | null;
  @Input() amount?: string | null;
  @Input() minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output() submitEditValidator = new EventEmitter<
    EditValidatorData & {
      minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
    }
  >();

  minimumGasPrice?: proto.cosmos.base.v1beta1.ICoin;

  constructor(private readonly snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  async onSubmitEditValidator(
    moniker: string,
    identity: string,
    website: string,
    security_contact: string,
    details: string,
    rate: string,
    min_self_delegation: string,
    delegator_address: string,
    validator_address: string,
    denom: string,
    amount: string,
    minimumGasPriceAmount: string,
  ): Promise<void> {
    if (!this.currentStoredWallet) {
      this.snackBar.open('Wallet is not connected! Please connect wallet first.', 'Close');
      return;
    }

    if (this.minimumGasPrice === undefined) {
      this.snackBar.open('Invalid gas fee!', 'Close');
      return;
    }

    this.submitEditValidator.emit({
      moniker,
      identity,
      website,
      security_contact,
      details,
      rate,
      min_self_delegation,
      delegator_address,
      validator_address,
      denom,
      amount,
      minimumGasPrice: {
        denom: this.minimumGasPrice.denom,
        amount: minimumGasPriceAmount,
      },
    });
  }

  onMinimumGasDenomChanged(denom: string): void {
    this.minimumGasPrice = this.minimumGasPrices?.find(
      (minimumGasPrice) => minimumGasPrice.denom === denom,
    );
  }

  onMinimumGasAmountSliderChanged(amount: string): void {
    if (this.minimumGasPrice) {
      this.minimumGasPrice.amount = amount;
    }
  }
}
