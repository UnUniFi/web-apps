import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { InlineResponse20066Validators } from '@cosmos-client/core/esm/openapi';
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

  @Output()
  toggleActiveChange: EventEmitter<boolean>;

  constructor() {
    this.toggleActiveChange = new EventEmitter();
  }

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

  onToggleChange(value: string) {
    if (value == 'active') {
      this.toggleActiveChange.emit(true);
    }
    if (value == 'inactive') {
      this.toggleActiveChange.emit(false);
    }
  }
}
