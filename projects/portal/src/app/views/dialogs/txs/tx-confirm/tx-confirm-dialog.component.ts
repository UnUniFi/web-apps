import { Clipboard } from '@angular/cdk/clipboard';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'view-tx-confirm-dialog',
  templateUrl: './tx-confirm-dialog.component.html',
  styleUrls: ['./tx-confirm-dialog.component.css'],
})
export class TxConfirmDialogComponent implements OnInit {
  txHash?: string;
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: string,
    private readonly dialogRef: DialogRef<TxConfirmDialogComponent>,
    private clipboard: Clipboard,
    private readonly snackBar: MatSnackBar,
  ) {
    this.txHash = data;
  }

  ngOnInit(): void {}

  onClickClose() {
    this.dialogRef.close();
  }

  onClickOpenTxDetail() {
    const rootPath = window.location.origin;
    window.open(rootPath + '/portal/txs/' + this.data, '_blank');
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
