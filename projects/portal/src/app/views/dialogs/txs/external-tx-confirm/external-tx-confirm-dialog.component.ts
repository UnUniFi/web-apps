import { TxConfirmDialogData } from '../tx-confirm/tx-confirm-dialog.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'view-external-tx-confirm-dialog',
  templateUrl: './external-tx-confirm-dialog.component.html',
  styleUrls: ['./external-tx-confirm-dialog.component.css'],
})
export class ExternalTxConfirmDialogComponent implements OnInit {
  txData?: TxConfirmDialogData;
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: TxConfirmDialogData,
    private readonly dialogRef: DialogRef<ExternalTxConfirmDialogComponent>,
    private clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
  ) {
    data.msg =
      data.msg + ' \nPlease check the destination chain explorer for the transaction details.';
    this.txData = data;
  }

  ngOnInit(): void {}

  onClickClose() {
    this.dialogRef.close();
  }

  copyClipboard(value: string) {
    if (value.length > 0) {
      this.clipboard.copy(value);
      this.snackBar.open('Copied to clipboard', undefined, {
        duration: 3000,
      });
    }
    return false;
  }
}
