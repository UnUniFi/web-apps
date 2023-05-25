import { Component, Input, OnInit } from '@angular/core';
import { StakingDelegatorValidators200ResponseValidatorsInner } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';

@Component({
  selector: 'view-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  @Input()
  validators?: StakingDelegatorValidators200ResponseValidatorsInner[] | null;

  constructor() {}

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
}
