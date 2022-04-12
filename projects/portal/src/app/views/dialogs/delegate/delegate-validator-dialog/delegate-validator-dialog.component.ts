import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InlineResponse20066Validators } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

@Component({
  selector: 'view-delegate-validator-dialog',
  templateUrl: './delegate-validator-dialog.component.html',
  styleUrls: ['./delegate-validator-dialog.component.css'],
})
export class DelegateValidatorDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: StoredWallet & InlineResponse20066Validators,
    public matDialogRef: MatDialogRef<DelegateValidatorDialogComponent>,
    private readonly snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {}

  getColorCode(validator: InlineResponse20066Validators) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(validator.operator_address ?? ''))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  onClickButton(): void {
    this.matDialogRef.close();
  }
}
