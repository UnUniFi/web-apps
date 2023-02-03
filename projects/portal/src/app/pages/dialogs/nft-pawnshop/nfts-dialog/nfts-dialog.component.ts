import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { IncentiveApplicationService } from 'projects/portal/src/app/models/incentives/incentive.application.service';
import { PawnshopQueryService } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.query.service';
import { UnunifiRestService } from 'projects/portal/src/app/models/ununifi-rest.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { CreateIncentiveUnitOnSubmitEvent as RegisterIncentiveUnitOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/incentive/create-unit-form-dialog/create-unit-form-dialog.component';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-nfts-dialog',
  templateUrl: './nfts-dialog.component.html',
  styleUrls: ['./nfts-dialog.component.css'],
})
export class NftsDialogComponent implements OnInit {
  classID: string | undefined;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  coins$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  uguuBalance$: Observable<string> | undefined;
  listedClass$: Observable<ListedClass200Response>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: string,
    public matDialogRef: MatDialogRef<NftsDialogComponent>,
    private readonly walletService: WalletService,
    private readonly cosmosRest: CosmosRestService,
    private readonly pawnshopQuery: PawnshopQueryService,
  ) {
    this.classID = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.coins$ = address$.pipe(mergeMap((address) => this.cosmosRest.getAllBalances$(address)));
    this.uguuBalance$ = this.coins$.pipe(
      map((coins) => {
        const balance = coins?.find((coin) => coin.denom == 'uguu');
        return balance ? balance.amount! : '0';
      }),
    );
    this.listedClass$ = this.pawnshopQuery.listListedClass(this.classID, 100);
  }

  ngOnInit(): void {}

  async onSubmit($event: string) {}
}
