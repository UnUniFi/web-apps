import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

export interface TxFeeConfirmDialogData {
  fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  isConfirmed: boolean;
}
@Component({
  selector: 'app-view-tx-fee-confirm-dialog',
  templateUrl: './tx-fee-confirm-dialog.component.html',
  styleUrls: ['./tx-fee-confirm-dialog.component.css'],
})
export class TxFeeConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: TxFeeConfirmDialogData,
    private readonly dialogRef: DialogRef<TxFeeConfirmDialogData, TxFeeConfirmDialogComponent>,
  ) {}

  ngOnInit(): void {}

  okToSendTx(): void {
    this.data.isConfirmed = true;
    this.dialogRef.close(this.data);
  }

  cancelToSendTx(): void {
    this.data.isConfirmed = false;
    this.dialogRef.close(this.data);
  }
}
