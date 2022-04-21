import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { proto } from '@cosmos-client/core';

@Component({
  selector: 'app-view-inactive-validator-confirm-dialog',
  templateUrl: './inactive-validator-confirm-dialog.component.html',
  styleUrls: ['./inactive-validator-confirm-dialog.component.css'],
})
export class InactiveValidatorConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      valAddress: string;
      isConfirmed: boolean;
    },
    private readonly dialogRef: MatDialogRef<InactiveValidatorConfirmDialogComponent>,
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
