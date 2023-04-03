import { validatorType } from '../validators.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { StakingDelegatorValidators200ResponseValidatorsInner } from '@cosmos-client/core/esm/openapi';
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

  constructor(private readonly snackBar: MatSnackBar, private clipboard: Clipboard) {}

  ngOnInit(): void {}

  getColorCode(validator: StakingDelegatorValidators200ResponseValidatorsInner | undefined | null) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(validator?.operator_address ?? ''))
      .digest()
      .toString('hex');

    return `#${hash.substr(0, 6)}`;
  }

  copyClipboard(value: string) {
    if (value.length > 0) {
      this.clipboard.copy(value);
      this.snackBar.open('Copied to clipboard', undefined, {
        duration: 3000,
      });
    }
    return false;
  }
}
