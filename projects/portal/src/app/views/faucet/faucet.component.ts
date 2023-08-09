import { getDenomExponent } from '../../models/cosmos/bank.model';
import { validateAccAddress } from '../../utils/validation';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cosmos } from '@cosmos-client/core/esm/proto';

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
  @Input() address?: string | null;
  @Input() symbols?: string[] | null;
  @Input() symbol?: string | null;
  @Input() amount?: number | null;
  @Input() symbolMetadataMap?: {
    [symbol: string]: cosmos.bank.v1beta1.IMetadata;
  } | null;
  @Input() creditAmount?: number | null;
  @Input() maxCredit?: number | null;
  @Input() symbolImageMap?: { [symbol: string]: string };

  @Output() postFaucetRequested: EventEmitter<FaucetOnSubmitEvent> =
    new EventEmitter<FaucetOnSubmitEvent>();
  @Output() selectedDenomChanged: EventEmitter<string> = new EventEmitter();

  focusAmount: boolean;

  constructor(private matSnackBar: MatSnackBar) {
    this.focusAmount = false;
  }

  ngOnInit(): void {}

  onPostFaucetRequested(): void {
    if (!this.symbol) {
      this.matSnackBar.open('Invalid Coin! Valid Denom must be selected!', undefined, {
        duration: 6000,
      });
      return;
    }
    if (!this.address || !validateAccAddress(this.address)) {
      this.matSnackBar.open('Invalid Address!', undefined, {
        duration: 6000,
      });
      return;
    }
    if (!this.symbolMetadataMap) {
      this.matSnackBar.open('No Coin Info of ' + this.symbol, undefined, {
        duration: 6000,
      });
      return;
    }
    const metadata = this.symbolMetadataMap[this.symbol];
    if (!this.amount) {
      this.matSnackBar.open('Invalid Amount!', undefined, {
        duration: 6000,
      });
      return;
    }
    if (!metadata.base) {
      this.matSnackBar.open('No metadata of ' + this.symbol, undefined, {
        duration: 6000,
      });
      return;
    }
    const exponent = getDenomExponent(metadata.base);
    const amountInt = Math.floor(this.amount * 10 ** exponent);
    if (amountInt > 0 && this.faucetURL) {
      this.postFaucetRequested.emit({
        address: this.address,
        amount: amountInt,
        denom: metadata.base!,
        url: this.faucetURL,
      });
    } else {
      this.matSnackBar.open('No Claims! The amount must be plus number!', undefined, {
        duration: 6000,
      });
    }
  }

  onSelectedDenomChanged(): void {
    if (!this.symbol) {
      this.matSnackBar.open('Invalid Coin', undefined, {
        duration: 6000,
      });
      return;
    }
    if (!this.symbolMetadataMap) {
      this.matSnackBar.open('No Coin Info of ' + this.symbol, undefined, {
        duration: 6000,
      });
      return;
    }
    const metadata = this.symbolMetadataMap[this.symbol];

    this.selectedDenomChanged.emit(metadata.base!);
  }
}
