import { KeyDeleteDialogComponent } from '../../views/keys/key-delete-dialog/key-delete-dialog.component';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeyDeleteDialogService {
  constructor(private readonly dialog: Dialog) {}

  openKeyDeleteDialog(id: string) {
    return this.dialog.open(KeyDeleteDialogComponent, {
      data: { id: id },
    }).closed;
  }
}
