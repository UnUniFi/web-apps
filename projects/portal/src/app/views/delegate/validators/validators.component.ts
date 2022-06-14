import { StoredWallet } from '../../../models/wallets/wallet.model';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import {
  InlineResponse20063DelegationResponses,
  InlineResponse20066Validators,
  InlineResponse20072,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';

export type validatorType = {
  val: InlineResponse20066Validators;
  share: number;
  inList: boolean;
  rank: number;
};

export type validatorWithShareType = {
  val: InlineResponse20066Validators;
  share: number;
};

@Component({
  selector: 'view-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  @Input()
  validators?: validatorType[] | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  delegations?: InlineResponse20063DelegationResponses[] | null;
  @Input()
  delegatedValidators?: (InlineResponse20066Validators | undefined)[] | null;
  @Input()
  unbondingDelegations?: (InlineResponse20072 | undefined)[] | null;

  @Output()
  toggleActiveChange: EventEmitter<boolean>;

  @Output()
  appClickValidator: EventEmitter<InlineResponse20066Validators>;

  constructor() {
    this.toggleActiveChange = new EventEmitter();
    this.appClickValidator = new EventEmitter();
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log('validators', this.validators);
      console.log('unbonding', this.unbondingDelegations);
    }, 5000);

  }

  getColorCode(valAddress: string) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(valAddress ?? ''))
      .digest()
      .toString('hex');

    return `#${hash.substr(0, 6)}`;
  }

  toNumber(str: string) {
    return Number(str);
  }

  onToggleChange(value: string) {
    if (value == 'active') {
      this.toggleActiveChange.emit(true);
    }
    if (value == 'inactive') {
      this.toggleActiveChange.emit(false);
    }
  }

  onClickValidator(validator: InlineResponse20066Validators) {
    this.appClickValidator.emit(validator);
  }
}
