import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'view-ununifi-select-create-import-dialog',
  templateUrl: './ununifi-select-create-import-dialog.component.html',
  styleUrls: ['./ununifi-select-create-import-dialog.component.css'],
})
export class UnunifiSelectCreateImportDialogComponent implements OnInit {
  options: {
    value: 'select' | 'import' | 'create';
    name: string;
  }[] = [
    {
      value: 'select',
      name: 'Select Account',
    },
    {
      value: 'import',
      name: 'Import Account',
    },
    {
      value: 'create',
      name: 'Create Account',
    },
  ];

  constructor(public matDialogRef: MatDialogRef<UnunifiSelectCreateImportDialogComponent>) {}

  ngOnInit(): void {}

  onClickButton(value: 'select' | 'import' | 'create'): void {
    this.matDialogRef.close(value);
  }
}
