import { validatorType } from '../validators.component';
import { Component, OnInit, Input } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import { InlineResponse20041Validators } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';

@Component({
  selector: 'view-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {
  @Input()
  validator?: validatorType | null;

  @Input()
  accAddress?: cosmosclient.AccAddress | null;

  constructor() {}

  ngOnInit(): void {}

  getColorCode(validator: InlineResponse20041Validators | undefined | null) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(validator?.operator_address ?? ''))
      .digest()
      .toString('hex');

    return `#${hash.substr(0, 6)}`;
  }
}
