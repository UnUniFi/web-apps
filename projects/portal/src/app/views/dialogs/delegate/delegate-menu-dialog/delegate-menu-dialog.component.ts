import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';
import {
  InlineResponse20063,
  InlineResponse20066Validators,
} from '@cosmos-client/core/esm/openapi/api';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

@Component({
  selector: 'view-delegate-menu-dialog',
  templateUrl: './delegate-menu-dialog.component.html',
  styleUrls: ['./delegate-menu-dialog.component.css'],
})
export class DelegateMenuDialogComponent implements OnInit {
  @Input()
  selectedValidator?: InlineResponse20066Validators | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  delegations?: InlineResponse20063 | null;
  @Input()
  delegateAmount?: proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  isDelegated?: boolean | null;

  @Output()
  appDelegate: EventEmitter<InlineResponse20066Validators>;
  @Output()
  appChangeDelegate: EventEmitter<InlineResponse20066Validators>;
  @Output()
  appDetail: EventEmitter<InlineResponse20066Validators>;

  constructor() {
    this.appDelegate = new EventEmitter();
    this.appChangeDelegate = new EventEmitter();
    this.appDetail = new EventEmitter();
  }

  ngOnInit(): void {}

  getColorCode(address: string) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(address ?? ''))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  onClickDelegateButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appDelegate.emit(this.selectedValidator);
  }

  onClickChangeDelegateButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appChangeDelegate.emit(this.selectedValidator);
  }

  onClickDetailButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appDetail.emit(this.selectedValidator);
  }
}
