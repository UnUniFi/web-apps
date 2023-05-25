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

  active: boolean;

  constructor() {
    this.active = true;
    this.toggleActiveChange = new EventEmitter();
  }

  ngOnInit(): void {
    setTimeout(() => {
      console.log('validators', this.validators);
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

  onToggleActive(active: boolean) {
    this.active = active;
    this.toggleActiveChange.emit(active);
  }
}
