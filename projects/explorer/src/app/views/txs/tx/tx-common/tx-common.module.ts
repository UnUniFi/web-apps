import { MaterialModule } from '../../../material.module';
import { MsgBeginRedelegateComponent } from './msg-begin-redelegate/msg-begin-redelegate.component';
import { MsgCreateValidatorComponent } from './msg-create-validator/msg-create-validator.component';
import { MsgCreateVestingAccountComponent } from './msg-create-vesting-account/msg-create-vesting-account.component';
import { MsgDelegateComponent } from './msg-delegate/msg-delegate.component';
import { MsgDepositComponent } from './msg-deposit/msg-deposit.component';
import { MsgEditValidatorComponent } from './msg-edit-validator/msg-edit-validator.component';
import { MsgFundCommunityPoolComponent } from './msg-fund-community-pool/msg-fund-community-pool.component';
import { MsgSendComponent } from './msg-send/msg-send.component';
import { MsgSetWithdrawAddressComponent } from './msg-set-withdraw-address/msg-set-withdraw-address.component';
import { MsgSubmitProposalComponent } from './msg-submit-proposal/msg-submit-proposal.component';
import { MsgUndelegateComponent } from './msg-undelegate/msg-undelegate.component';
import { MsgVoteWeightedComponent } from './msg-vote-weighted/msg-vote-weighted.component';
import { MsgVoteComponent } from './msg-vote/msg-vote.component';
import { MsgWithdrawDeledatorRewardComponent } from './msg-withdraw-deledator-reward/msg-withdraw-deledator-reward.component';
import { MsgWithdrawValidatorCommissionComponent } from './msg-withdraw-validator-commission/msg-withdraw-validator-commission.component';
import { TxSignatureComponent } from './tx-signature/tx-signature.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    MsgUndelegateComponent,
    MsgDelegateComponent,
    MsgSendComponent,
    TxSignatureComponent,
    MsgEditValidatorComponent,
    MsgCreateValidatorComponent,
    MsgBeginRedelegateComponent,
    MsgWithdrawDeledatorRewardComponent,
    MsgSubmitProposalComponent,
    MsgCreateVestingAccountComponent,
    MsgDepositComponent,
    MsgVoteComponent,
    MsgVoteWeightedComponent,
    MsgSetWithdrawAddressComponent,
    MsgFundCommunityPoolComponent,
    MsgWithdrawValidatorCommissionComponent,
  ],
  imports: [CommonModule, MaterialModule, MatChipsModule],
  exports: [
    MsgUndelegateComponent,
    MsgDelegateComponent,
    MsgSendComponent,
    TxSignatureComponent,
    MsgEditValidatorComponent,
    MsgCreateValidatorComponent,
    MsgBeginRedelegateComponent,
    MsgWithdrawDeledatorRewardComponent,
    MsgSubmitProposalComponent,
    MsgCreateVestingAccountComponent,
    MsgDepositComponent,
    MsgVoteComponent,
    MsgVoteWeightedComponent,
    MsgSetWithdrawAddressComponent,
    MsgFundCommunityPoolComponent,
    MsgWithdrawValidatorCommissionComponent,
  ],
})
export class TxCommonModule {}
