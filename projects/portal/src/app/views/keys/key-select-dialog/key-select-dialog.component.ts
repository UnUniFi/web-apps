import { Key } from '../../../models/keys/key.model';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import * as crypto from 'crypto';

@Component({
  selector: 'app-key-select-dialog',
  templateUrl: './key-select-dialog.component.html',
  styleUrls: ['./key-select-dialog.component.css'],
})
export class KeySelectDialogComponent implements OnInit {
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: {
      keys: Key[];
      currentKeyID: string | undefined;
    },
    private readonly dialogRef: DialogRef<Key, KeySelectDialogComponent>,
  ) {}

  ngOnInit(): void {}

  getColorCode(key: Key) {
    const hash = crypto.createHash('sha256').update(Buffer.from(key.id)).digest().toString('hex');

    return `#${hash.substr(0, 6)}`;
  }

  onClickKey(key: Key) {
    this.dialogRef.close(key);
  }
}
