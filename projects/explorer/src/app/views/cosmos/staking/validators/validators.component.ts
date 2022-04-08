import { Component, OnInit, Input } from '@angular/core';
import {
  InlineResponse20066Validators,
  QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import {
  validatorType,
  validatorWithShareType,
} from 'projects/explorer/src/app/pages/cosmos/staking/validators/validators.component';

@Component({
  selector: 'view-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  @Input()
  validators?: validatorType[] | null;

  constructor() {}

  ngOnInit(): void {
    setTimeout(() => {
      console.log('validators', this.validators);
    }, 5000);
  }

  getColorCode(validator: InlineResponse20066Validators) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(validator.operator_address ?? ''))
      .digest()
      .toString('hex');

    return `#${hash.substr(0, 6)}`;
  }
}
