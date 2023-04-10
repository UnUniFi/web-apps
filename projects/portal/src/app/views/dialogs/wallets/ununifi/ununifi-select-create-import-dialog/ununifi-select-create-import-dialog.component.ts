import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';

export type UnunifiSelectCreateImportDialogData =
  | 'select'
  | 'import'
  | 'importWithPrivateKey'
  | 'create';
@Component({
  selector: 'view-ununifi-select-create-import-dialog',
  templateUrl: './ununifi-select-create-import-dialog.component.html',
  styleUrls: ['./ununifi-select-create-import-dialog.component.css'],
})
export class UnunifiSelectCreateImportDialogComponent implements OnInit {
  options: {
    value: UnunifiSelectCreateImportDialogData;
    name: string;
  }[] = [
    {
      value: 'select',
      name: 'Select Account',
    },
    {
      value: 'import',
      name: 'Import Account with Mnemonic',
    },
    {
      value: 'importWithPrivateKey',
      name: 'Import Account with Private Key',
    },
    {
      value: 'create',
      name: 'Create Account',
    },
  ];

  constructor(
    public dialogRef: DialogRef<
      UnunifiSelectCreateImportDialogData,
      UnunifiSelectCreateImportDialogComponent
    >,
  ) {}

  ngOnInit(): void { }

  onClickClose() {
    this.dialogRef.close();
  }

  onClickButton(value: UnunifiSelectCreateImportDialogData): void {
    this.dialogRef.close(value);
  }
}
