import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MsgUndelegateComponent } from './msg-undelegate/msg-undelegate.component';
import { MaterialModule } from '../../../material.module';
import { MatChipsModule } from '@angular/material/chips';
import { MsgDelegateComponent } from './msg-delegate/msg-delegate.component';
import { MsgSendComponent } from './msg-send/msg-send.component';
import { TxSignatureComponent } from './tx-signature/tx-signature.component';

@NgModule({
  declarations: [MsgUndelegateComponent, MsgDelegateComponent, MsgSendComponent, TxSignatureComponent],
  imports: [CommonModule, MaterialModule, MatChipsModule],
  exports: [MsgUndelegateComponent, MsgDelegateComponent, MsgSendComponent, TxSignatureComponent]
})
export class TxCommonModule { }
