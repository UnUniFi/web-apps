import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CdpApplicationService } from 'projects/portal/src/app/models';

@Component({
  selector: 'app-collateral-menu-dialog',
  templateUrl: './collateral-menu-dialog.component.html',
  styleUrls: ['./collateral-menu-dialog.component.css'],
})
export class CollateralMenuDialogComponent implements OnInit {
  denom: string | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: string,
    private router: Router,
    public matDialogRef: MatDialogRef<CollateralMenuDialogComponent>,
    private readonly cdpAppService: CdpApplicationService,
  ) {
    this.denom = data;
  }

  ngOnInit() {}

  onSubmitCreate(denom: string | undefined) {
    this.matDialogRef.close();
    this.cdpAppService.openCreateCdpDialog(denom!);
  }

  onSubmitDetail(denom: string) {
    this.matDialogRef.close();
    this.router.navigate(['mint', 'params', 'collateral', denom]);
  }
}
