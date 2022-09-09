import { LoadingDialogComponent, LoadingDialogComponentData } from './loading-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingDialogService {
  constructor(private dialog: MatDialog) {}

  open(message: string) {
    const message$ = new BehaviorSubject<string>(message);

    const dialogRef = this.dialog.open<
      LoadingDialogComponent,
      LoadingDialogComponentData,
      undefined
    >(LoadingDialogComponent, { data: { message$ }, disableClose: true });

    return {
      next: (message: string) => message$.next(message),
      close: () => {
        dialogRef.close();
        message$.complete();
      },
    };
  }
}
