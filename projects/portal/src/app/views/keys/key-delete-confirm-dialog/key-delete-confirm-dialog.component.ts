import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { KeyApplicationService } from 'projects/portal/src/app/models/keys/key.application.service';

@Component({
  selector: 'app-key-delete-confirm-dialog',
  templateUrl: './key-delete-confirm-dialog.component.html',
  styleUrls: ['./key-delete-confirm-dialog.component.css'],
})
export class KeyDeleteConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: {
      id: string;
    },
    public dialogRef: DialogRef<KeyDeleteConfirmDialogComponent>,
    private readonly keyApplication: KeyApplicationService,
  ) {}

  ngOnInit(): void {}

  confirm(): void {
    this.keyApplication.delete(this.data.id);
    this.dialogRef.close();
  }

  notConfirm(): void {
    this.dialogRef.close();
  }
}
