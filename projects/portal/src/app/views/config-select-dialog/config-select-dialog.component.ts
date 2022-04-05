import { Config } from '../../models/config.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as crypto from 'crypto';

@Component({
  selector: 'app-config-select-dialog',
  templateUrl: './config-select-dialog.component.html',
  styleUrls: ['./config-select-dialog.component.css'],
})
export class ConfigSelectDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: {
      configs: Config[];
      currentConfigID: string | undefined;
    },
    private readonly dialogRef: MatDialogRef<ConfigSelectDialogComponent>,
  ) {}

  ngOnInit(): void {}

  getColorCode(config: Config) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(config.id))
      .digest()
      .toString('hex');

    return `#${hash.substr(0, 6)}`;
  }

  onClickConfig(config: Config) {
    this.dialogRef.close(config);
  }
}
