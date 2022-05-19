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
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-debt-menu-dialog',
  templateUrl: './debt-menu-dialog.component.html',
  styleUrls: ['./debt-menu-dialog.component.css'],
})
export class DebtMenuDialogComponent implements OnInit {
  denom: string | null | undefined;
  cdps$: Observable<(InlineResponse2004Cdp1 | undefined)[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ununifi.cdp.IDebtParam,
    private router: Router,
    public matDialogRef: MatDialogRef<DebtMenuDialogComponent>,
    private readonly cdpAppService: CdpApplicationService,
    private readonly walletService: WalletService,
    private readonly cosmosSdk: CosmosSDKService,
  ) {
    this.denom = data.denom;

    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );

    const collateralTypes$ = this.cosmosSdk.sdk$.pipe(
      mergeMap((sdk) => rest.ununifi.cdp.params(sdk.rest)),
      map((res) => res.data?.params?.collateral_params?.map((p) => p.type!) || []),
    );
    this.cdps$ = combineLatest([address$, collateralTypes$, this.cosmosSdk.sdk$]).pipe(
      mergeMap(([address, collateralTypes, sdk]) =>
        Promise.all(
          collateralTypes.map((collateralType) =>
            rest.ununifi.cdp.cdp(sdk.rest, address, collateralType).catch((err) => {
              console.log(err);
              return;
            }),
          ),
        ),
      ),
      map((result) => result.map((res) => (res ? res.data.cdp! : undefined))),
      map((result) => result.filter((res) => res?.cdp?.principal?.denom == this.denom)),
    );
  }

  ngOnInit() {}

  onOpenCdpMenu(cdp: InlineResponse2004Cdp1) {
    this.matDialogRef.close();
    this.cdpAppService.openCdpMenuDialog(cdp);
  }

  onViewDetail(denom: string) {
    this.matDialogRef.close();
    this.router.navigate(['mint', 'params', 'debt', denom]);
  }
}
