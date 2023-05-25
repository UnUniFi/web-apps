import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

export interface InactiveValidatorConfirmDialogData {
  valAddress: string;
  isConfirmed: boolean;
}
@Component({
  selector: 'app-view-inactive-validator-confirm-dialog',
  templateUrl: './inactive-validator-confirm-dialog.component.html',
  styleUrls: ['./inactive-validator-confirm-dialog.component.css'],
})
export class InactiveValidatorConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: InactiveValidatorConfirmDialogData,
    private readonly dialogRef: DialogRef<
      InactiveValidatorConfirmDialogData,
      InactiveValidatorConfirmDialogComponent
    >,
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
