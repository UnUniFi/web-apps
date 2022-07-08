import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20038,
  InlineResponse20041Validators,
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
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
  selectedValidator?: InlineResponse20041Validators | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  delegations?: InlineResponse20038 | null;
  @Input()
  delegateAmount?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  isDelegated?: boolean | null;
  @Input()
  totalRewards?: CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | null;
  @Input()
  commission?: QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod | null;
  @Input()
  isValidator?: boolean | null;
  @Output()
  appDelegate: EventEmitter<InlineResponse20041Validators>;
  @Output()
  appRedelegate: EventEmitter<InlineResponse20041Validators>;
  @Output()
  appUndelegate: EventEmitter<InlineResponse20041Validators>;
  @Output()
  appWithdrawDelegatorReward: EventEmitter<InlineResponse20041Validators>;
  @Output()
  appWithdrawValidatorCommission: EventEmitter<InlineResponse20041Validators>;
  @Output()
  appDetail: EventEmitter<InlineResponse20041Validators>;

  constructor() {
    this.appDelegate = new EventEmitter();
    this.appRedelegate = new EventEmitter();
    this.appUndelegate = new EventEmitter();
    this.appWithdrawDelegatorReward = new EventEmitter();
    this.appWithdrawValidatorCommission = new EventEmitter();
    this.appDetail = new EventEmitter();
  }

  ngOnInit(): void { }

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

  onClickWithdrawValidatorCommissionButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appWithdrawValidatorCommission.emit(this.selectedValidator);
  }

  onClickDetailButton() {
    if (!this.selectedValidator) {
      return;
    }
    this.appDetail.emit(this.selectedValidator);
  }
}
