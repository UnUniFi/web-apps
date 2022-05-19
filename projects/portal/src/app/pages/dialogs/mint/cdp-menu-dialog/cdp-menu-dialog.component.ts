import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { cosmosclient } from '@cosmos-client/core';
import { CdpApplicationService, CosmosSDKService } from 'projects/portal/src/app/models';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { rest, ununifi } from 'ununifi-client';
import { cdp } from 'ununifi-client/cjs/rest/ununifi/cdp/module';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-cdp-menu-dialog',
  templateUrl: './cdp-menu-dialog.component.html',
  styleUrls: ['./cdp-menu-dialog.component.css'],
})
export class CdpMenuDialogComponent implements OnInit {
  cdp: InlineResponse2004Cdp1;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse2004Cdp1,
    private router: Router,
    public matDialogRef: MatDialogRef<CdpMenuDialogComponent>,
    private readonly cdpAppService: CdpApplicationService,
    private readonly walletService: WalletService,
    private readonly cosmosSdk: CosmosSDKService,
  ) {
    this.cdp = data;
  }

  ngOnInit(): void {}

  onSubmitDetail(cdp: InlineResponse2004Cdp1) {
    this.matDialogRef.close();
    this.router.navigate(['mint', 'cdps', cdp.cdp?.owner, cdp.cdp?.type]);
  }

  onSubmitDeposit(cdp: InlineResponse2004Cdp1) {
    this.matDialogRef.close();
    this.cdpAppService.openCdpDepositFormDialog(cdp);
  }

  onSubmitClear(cdp: InlineResponse2004Cdp1) {
    this.matDialogRef.close();
    this.cdpAppService.openCdpClearFormDialog(cdp);
  }

  onSubmitWithdraw(cdp: InlineResponse2004Cdp1) {
    this.matDialogRef.close();
    this.cdpAppService.openCdpWithdrawFormDialog(cdp);
  }

  onSubmitIssue(cdp: InlineResponse2004Cdp1) {
    this.matDialogRef.close();
    this.cdpAppService.openCdpIssueFormDialog(cdp);
  }
}
