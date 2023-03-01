import { validateAccAddress } from '../../utils/validation';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type Amount = {
  amount: number;
  denom: string;
};

export type FaucetOnSubmitEvent = {
  address: string;
  amount: number;
  denom: string;
  url: string;
};

@Component({
  selector: 'app-view-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css'],
})
export class FaucetComponent implements OnInit {
  @Input() faucetURL?: string | null;
  @Input() denoms?: string[] | null;
  @Input() address?: string | null;
  @Input() denom?: string | null;
  @Input() amount?: number | null;
  @Input() creditAmount?: number | null;
  @Input() maxCredit?: number | null;

  @Output() postFaucetRequested: EventEmitter<FaucetOnSubmitEvent> =
    new EventEmitter<FaucetOnSubmitEvent>();
  @Output() selectedDenomChanged: EventEmitter<string> = new EventEmitter();

  focusAmount: boolean;

  constructor(private matSnackBar: MatSnackBar) {
    this.focusAmount = false;
  }

  ngOnInit(): void {}

  onPostFaucetRequested(address: string, amount: string): void {
    if (!this.denom) {
      this.matSnackBar.open('Invalid Denom! Valid Denom must be selected!', undefined, {
        duration: 6000,
      });
      return;
    }
    if (!validateAccAddress(address)) {
      this.matSnackBar.open('Invalid Address!', undefined, {
        duration: 6000,
      });
      return;
    }
    const amountInt = parseInt(amount);
    if (amountInt > 0 && this.faucetURL) {
      this.postFaucetRequested.emit({
        address: address,
        amount: amountInt,
        denom: this.denom,
        url: this.faucetURL,
      });
    } else {
      this.matSnackBar.open('No Claims! At least 1 amount must be plus number!', undefined, {
        duration: 6000,
      });
    }
  }

  onSelectedDenomChanged(selectedDenom: string): void {
    this.selectedDenomChanged.emit(selectedDenom);
  }
}
