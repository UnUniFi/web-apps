import { Clipboard } from '@angular/cdk/clipboard';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface TxConfirmDialogData {
  txHash: string;
  msg: string;
}
@Component({
  selector: 'view-tx-confirm-dialog',
  templateUrl: './tx-confirm-dialog.component.html',
  styleUrls: ['./tx-confirm-dialog.component.css'],
})
export class TxConfirmDialogComponent implements OnInit {
  txData?: TxConfirmDialogData;
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: TxConfirmDialogData,
    private readonly dialogRef: DialogRef<TxConfirmDialogComponent>,
    private clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
  ) {
    data.msg = data.msg + ' \nIf it is not reflected, wait a while and reload the page.';
    this.txData = data;
  }

  ngOnInit(): void {}

  onClickClose() {
    this.dialogRef.close();
  }

  onClickOpenTxDetail() {
    const rootPath = window.location.origin;
    window.open(rootPath + '/portal/utilities/txs/' + this.data, '_blank');
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
