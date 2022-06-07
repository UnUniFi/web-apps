import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';
import {
  InlineResponse20063,
  InlineResponse20066Validators,
  InlineResponse20041Pool,
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
  @Input()
  totalRewards?: InlineResponse20041Pool | null;

  @Output()
  appDelegate: EventEmitter<InlineResponse20066Validators>;
  @Output()
  appRedelegate: EventEmitter<InlineResponse20066Validators>;
  @Output()
  appUndelegate: EventEmitter<InlineResponse20066Validators>;
  @Output()
  appWithdrawDelegatorReward: EventEmitter<InlineResponse20066Validators>;
  @Output()
  appDetail: EventEmitter<InlineResponse20066Validators>;

  constructor() {
    this.appDelegate = new EventEmitter();
    this.appRedelegate = new EventEmitter();
    this.appUndelegate = new EventEmitter();
    this.appWithdrawDelegatorReward = new EventEmitter();
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

  onClickRedelegateButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appRedelegate.emit(this.selectedValidator);
  }

  onClickUndelegateButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appUndelegate.emit(this.selectedValidator);
  }

  onClickWithdrawDelegatorRewardButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appWithdrawDelegatorReward.emit(this.selectedValidator);
  }

  onClickDetailButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appDetail.emit(this.selectedValidator);
  }
}
