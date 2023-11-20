import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

export interface WithdrawFeeConfirmDialogData {
  redeemAmount: number;
  feeAmount: number;
  denom: string;
}
@Component({
  selector: 'app-view-withdraw-fee-confirm-dialog',
  templateUrl: './withdraw-fee-confirm-dialog.component.html',
  styleUrls: ['./withdraw-fee-confirm-dialog.component.css'],
})
export class WithdrawFeeConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: WithdrawFeeConfirmDialogData,
    private readonly dialogRef: DialogRef<boolean, WithdrawFeeConfirmDialogComponent>,
  ) {}

  ngOnInit(): void {}

  okToSendTx(): void {
    this.dialogRef.close(true);
  }

  cancelToSendTx(): void {
    this.dialogRef.close(false);
  }
}
