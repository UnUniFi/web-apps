import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { StakingDelegatorValidators200ResponseValidatorsInner } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';

export type validatorType = {
  val: StakingDelegatorValidators200ResponseValidatorsInner;
  share: number;
  inList: boolean;
  rank: number;
};

export type validatorWithShareType = {
  val: StakingDelegatorValidators200ResponseValidatorsInner;
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

  @Output()
  toggleActiveChange: EventEmitter<boolean>;

  active = true;

  constructor() {
    this.toggleActiveChange = new EventEmitter();
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log('validators', this.validators);
    }, 5000);
  }

  getColorCode(validator: StakingDelegatorValidators200ResponseValidatorsInner) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(validator.operator_address ?? ''))
      .digest()
      .toString('hex');

    return `#${hash.substr(0, 6)}`;
  }

  onClickToggle() {
    this.active = !this.active;
    this.toggleActiveChange.emit(this.active);
  }
}
