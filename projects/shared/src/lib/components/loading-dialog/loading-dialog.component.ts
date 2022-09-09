import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';

export type LoadingDialogComponentData = {
  message$?: Observable<string>;
};

// @dynamic
@Component({
  selector: 'lib-loading-dialog',
  templateUrl: './loading-dialog.component.html',
  styleUrls: ['./loading-dialog.component.css'],
})
export class LoadingDialogComponent implements OnInit {
  message$: Observable<string>;

  constructor(
    private dialogRef: MatDialogRef<LoadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data?: LoadingDialogComponentData,
  ) {
    this.message$ = data?.message$ ? data.message$ : of('');
  }

  ngOnInit(): void {
    this.data?.message$?.subscribe(
      undefined,
      () => this.closeDialog(),
      () => this.closeDialog(),
    );
  }

  async closeDialog() {
    this.dialogRef.close();
  }
}
