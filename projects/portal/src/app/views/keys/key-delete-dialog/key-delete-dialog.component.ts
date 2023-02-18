import { KeyDeleteConfirmDialogComponent } from '../key-delete-confirm-dialog/key-delete-confirm-dialog.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-key-delete-dialog',
  templateUrl: './key-delete-dialog.component.html',
  styleUrls: ['./key-delete-dialog.component.css'],
})
export class KeyDeleteDialogComponent implements OnInit {
  inputId = '';

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: {
      id: string;
    },
    public dialogRef: DialogRef<KeyDeleteDialogComponent>,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}

  checkDeleteAccount(id: string) {
    if (id === this.data.id) {
      this.openKeyDeleteConfirmDialog();
    } else {
      this.snackBar.open('Wrong ID', undefined, {
        duration: 2000,
      });
    }
  }

  openKeyDeleteConfirmDialog() {
    this.dialog
      .open(KeyDeleteConfirmDialogComponent, {
        data: { id: this.data.id },
      })
      .afterClosed()
      .subscribe((_) => {
        this.dialogRef.close();
      });
  }
}
