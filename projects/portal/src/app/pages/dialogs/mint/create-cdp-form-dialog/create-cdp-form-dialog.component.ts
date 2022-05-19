import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cosmosclient, proto, rest as restCosmos } from '@cosmos-client/core';
import { ConfigService } from 'projects/explorer/src/app/models/config.service';
import { CdpApplicationService, CosmosSDKService } from 'projects/portal/src/app/models';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { getCreateLimit } from 'projects/portal/src/app/utils/function';
import { getLiquidationPriceStream } from 'projects/portal/src/app/utils/stream';
import { CreateCdpOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/mint/create-cdp-form-dialog/create-cdp-form-dialog.component';
import { BehaviorSubject, combineLatest, Observable, of, Subject, timer } from 'rxjs';
import { combineAll, filter, map, mergeMap } from 'rxjs/operators';
import { ununifi, rest } from 'ununifi-client';
import { InlineResponse2004Cdp1 } from 'ununifi-client/cjs/openapi';

@Component({
  selector: 'app-create-cdp-form-dialog',
  templateUrl: './create-cdp-form-dialog.component.html',
  styleUrls: ['./create-cdp-form-dialog.component.css'],
})
export class CreateCdpFormDialogComponent implements OnInit {
  collateralParam: ununifi.cdp.ICollateralParam;
  collateralBalance$: Observable<string> | undefined;
  coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  cdpParams$: Observable<ununifi.cdp.IParams>;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  address$: Observable<cosmosclient.AccAddress>;
  balances$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  pollingInterval = 30;

  collateralLimit$: Observable<number>;

  collateralInputValue: BehaviorSubject<number> = new BehaviorSubject(0);
  liquidationPrice$: Observable<ununifi.pricefeed.ICurrentPrice>;
  principalLimit$: Observable<number>;

  cdp$: Observable<InlineResponse2004Cdp1 | undefined>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: ununifi.cdp.ICollateralParam,
    public matDialogRef: MatDialogRef<CreateCdpFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly stakingAppService: StakingApplicationService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly cdpApplicationService: CdpApplicationService,
  ) {
    this.collateralParam = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.coins$ = combineLatest([this.cosmosSDK.sdk$, this.address$]).pipe(
      mergeMap(([sdk, address]) => restCosmos.bank.allBalances(sdk.rest, address)),
      map((result) => result.data.balances),
    );
    this.collateralBalance$ = this.coins$.pipe(
      map((coins) => {
        const balance = coins?.find((coin) => coin.denom == data.denom);
        return balance ? balance.amount! : '0';
      }),
    );
    this.cdpParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.ununifi.cdp.params(sdk.rest)),
      map((param) => param.data.params!),
    );

    //get account balance information
    const timer$ = timer(0, this.pollingInterval * 1000);
    this.balances$ = combineLatest([timer$, this.cosmosSDK.sdk$, this.address$]).pipe(
      mergeMap(([n, sdk, address]) => {
        if (address === undefined) {
          return of([]);
        }
        return restCosmos.bank
          .allBalances(sdk.rest, address)
          .then((res) => res.data.balances || []);
      }),
    );

    // get collateral limit
    this.collateralLimit$ = this.balances$.pipe(
      map((balances) => {
        if (!balances) {
          return 0;
        }
        const collateralDenomLimit = balances.find(
          (balance) => balance.denom === this.collateralParam.denom,
        )?.amount;
        return Number(collateralDenomLimit);
      }),
    );

    // get principal limit
    const collateralType$ = of(this.collateralParam.type ? this.collateralParam.type : '');

    this.liquidationPrice$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => getLiquidationPriceStream(sdk.rest, collateralType$, this.cdpParams$)),
    );
    this.principalLimit$ = combineLatest([
      collateralType$,
      this.cdpParams$,
      this.liquidationPrice$,
      this.collateralInputValue.asObservable(),
    ]).pipe(
      map(([collateralType, params, liquidationPrice, collateralAmount]) => {
        return getCreateLimit(params, collateralAmount, collateralType, liquidationPrice);
      }),
    );
    this.principalLimit$.subscribe((a) => console.log(a));

    // check cdp
    this.cdp$ = combineLatest([this.address$, collateralType$, this.cosmosSDK.sdk$]).pipe(
      mergeMap(([ownerAddr, collateralType, sdk]) =>
        rest.ununifi.cdp.cdp(sdk.rest, ownerAddr, collateralType).catch((err) => {
          console.error(err);
          return;
        }),
      ),
      map((res) => (res ? res.data.cdp : undefined)),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: CreateCdpOnSubmitEvent) {
    let txHash: string | undefined;
    txHash = await this.cdpApplicationService.createCDP(
      $event.collateralType,
      $event.collateral,
      $event.principal,
      $event.minimumGasPrice,
      $event.balances,
      $event.gasRatio,
    );

    this.matDialogRef.close(txHash);
  }

  onCollateralAmountChanged(amount: number): void {
    this.collateralInputValue.next(amount);
  }
}
