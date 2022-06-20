import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'view-ununifi-select-create-import-dialog',
  templateUrl: './ununifi-select-create-import-dialog.component.html',
  styleUrls: ['./ununifi-select-create-import-dialog.component.css'],
})
export class UnunifiSelectCreateImportDialogComponent implements OnInit {
  options: {
    value: 'select' | 'import' | 'importWithPrivateKey' | 'create';
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

  constructor(public matDialogRef: MatDialogRef<UnunifiSelectCreateImportDialogComponent>) {}

  ngOnInit(): void {}

  onClickButton(value: 'select' | 'import' | 'importWithPrivateKey' | 'create'): void {
    this.matDialogRef.close(value);
  }
}
