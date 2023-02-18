import { KeyBackupDialogComponent } from '../../views/keys/key-backup-dialog/key-backup-dialog.component';
import { KeyBackupResult } from './key.model';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class KeyBackupDialogService {
  constructor(public matDialog: Dialog, private readonly dialog: Dialog) {}

  async open(
    mnemonic: string,
    privatekey: Uint8Array,
    id: string,
  ): Promise<KeyBackupResult | undefined> {
    const privatekeyString = Buffer.from(privatekey).toString('hex');
    const keyBackupResult = await this.dialog
      .open<KeyBackupResult>(KeyBackupDialogComponent, {
        data: { mnemonic: mnemonic, privateKey: privatekeyString, id: id },
      })
      .closed.toPromise();

    return keyBackupResult;
  }
}
