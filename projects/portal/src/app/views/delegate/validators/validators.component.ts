import { StoredWallet } from '../../../models/wallets/wallet.model';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import {
  DelegatorDelegations200ResponseDelegationResponsesInner,
  StakingDelegatorValidators200ResponseValidatorsInner,
  UnbondingDelegation200Response,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';

export type validatorType = {
  val: StakingDelegatorValidators200ResponseValidatorsInner;
  share: number;
  inList: boolean;
  rank: number;
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
  delegations?: DelegatorDelegations200ResponseDelegationResponsesInner[] | null;
  @Input()
  delegatedValidators?: (StakingDelegatorValidators200ResponseValidatorsInner | undefined)[] | null;
  @Input()
  unbondingDelegations?: (UnbondingDelegation200Response | undefined)[] | null;

  @Output()
  toggleActiveChange: EventEmitter<boolean>;
  @Output()
  appClickValidator: EventEmitter<StakingDelegatorValidators200ResponseValidatorsInner>;

  active: boolean;

  constructor() {
    this.active = true;
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

  onToggleActive(active: boolean) {
    this.active = active;
    this.toggleActiveChange.emit(active);
  }

  onClickValidator(validator: StakingDelegatorValidators200ResponseValidatorsInner) {
    this.appClickValidator.emit(validator);
  }
}
