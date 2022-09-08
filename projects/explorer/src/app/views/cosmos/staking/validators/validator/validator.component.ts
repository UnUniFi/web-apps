import { validatorType } from './../../../../../views/cosmos/staking/validators/validators.component';
import { Component, OnInit, Input } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20014Validators } from '@cosmos-client/core/esm/openapi';
import { toHashHex } from '@ununifi/shared';

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

  getColorCode(validator: InlineResponse20014Validators | undefined | null) {
    const hash = toHashHex(validator?.address);

    return `#${hash.substr(0, 6)}`;
  }
}
