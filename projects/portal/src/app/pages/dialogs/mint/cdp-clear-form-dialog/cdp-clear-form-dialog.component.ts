import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { proto, cosmosclient, rest as restCosmos } from '@cosmos-client/core';
import { Key } from '@keplr-wallet/types';
import { ConfigService } from 'projects/explorer/src/app/models/config.service';
import { CosmosSDKService, CdpApplicationService } from 'projects/portal/src/app/models';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Observable, combineLatest, timer, of, async } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ununifi, rest } from 'ununifi-client';
import { InlineResponse2004Cdp1 } from 'ununifi-client/cjs/openapi';

@Component({
  selector: 'app-cdp-clear-form-dialog',
  templateUrl: './cdp-clear-form-dialog.component.html',
  styleUrls: ['./cdp-clear-form-dialog.component.css'],
})
export class CdpClearFormDialogComponent implements OnInit {
  // currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  // coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  // collateralBalance$: Observable<string> | undefined;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  // cdp: InlineResponse2004Cdp1;

  cdp$: Observable<InlineResponse2004Cdp1>;
  key$: Observable<Key | undefined>;
  owner$: Observable<string>;
  collateralType$: Observable<string>;
  params$: Observable<ununifi.cdp.IParams>;
  repaymentDenomString$: Observable<string>;
  repaymentDenom$: Observable<proto.cosmos.base.v1beta1.ICoin | undefined>;
  address$: Observable<cosmosclient.AccAddress | undefined>;
  balances$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  pollingInterval = 30;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse2004Cdp1,
    public matDialogRef: MatDialogRef<CdpClearFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly cdpApplicationService: CdpApplicationService,

    private readonly route: ActivatedRoute,
    private readonly keyStore: KeyStoreService,
  ) {
    // this.cdp = data;
    // this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    // const address$ = this.currentStoredWallet$.pipe(
    //   filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    //   map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    // );

    // this.coins$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
    //   mergeMap(([sdk, address]) => rest.bank.allBalances(sdk.rest, address)),
    //   map((result) => result.data.balances),
    // );
    // this.collateralBalance$ = this.coins$.pipe(
    //   map((coins) => {
    //     const balance = coins?.find((coin) => coin.denom == this.cdp.cdp?.collateral?.denom);
    //     return balance ? balance.amount! : '0';
    //   }),
    // );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));

    this.key$ = this.keyStore.currentKey$.asObservable();
    this.owner$ = this.route.params.pipe(map((params) => params['owner']));
    this.collateralType$ = this.route.params.pipe(map((params) => params['collateralType']));

    //get account balance information
    this.address$ = this.owner$.pipe(
      map((address) => {
        try {
          const accAddress = cosmosclient.AccAddress.fromString(address);
          return accAddress;
        } catch (error) {
          console.error(error);
          return undefined;
        }
      }),
    );
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

    this.params$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.ununifi.cdp.params(sdk.rest)),
      map((data) => data.data.params!),
    );

    this.cdp$ = combineLatest([this.owner$, this.collateralType$, this.cosmosSDK.sdk$]).pipe(
      mergeMap(([ownerAddr, collateralType, sdk]) =>
        rest.ununifi.cdp.cdp(
          sdk.rest,
          cosmosclient.AccAddress.fromString(ownerAddr),
          collateralType,
        ),
      ),
      map((res) => res.data.cdp!),
    );

    this.repaymentDenomString$ = combineLatest([this.params$, this.cdp$]).pipe(
      map(([params, cdp]) =>
        params.debt_params?.find((debtParam) => debtParam.denom == cdp.cdp?.principal?.denom),
      ),
      map((res) => res?.denom!),
    );

    this.repaymentDenom$ = combineLatest([this.repaymentDenomString$, this.balances$]).pipe(
      map(([repaymentDenom, balances]) => {
        const repaymentDenomWithBalance = balances?.find(
          (balances) => balances.denom === repaymentDenom,
        );
        return repaymentDenomWithBalance;
      }),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {
    this.collateralType$.subscribe((collateralType) => console.log(collateralType));
  }
  // async onSubmit($event: CdpDepositOnSubmitEvent) {
  //   let txHash: string | undefined;

  //   txHash = await this.cdpApplicationService.depositCDP(
  //     $event.ownerAddress,
  //     $event.collateralType,
  //     $event.collateral,
  //     $event.minimumGasPrice,
  //     $event.balances,
  //     $event.gasRatio,
  //   );
  //   this.matDialogRef.close(txHash);
  // }

  onSubmit($event: ClearCdpOnSubmitEvent) {
    this.cdpApplicationService.repayCDP(
      $event.key,
      $event.privateKey,
      $event.collateralType,
      $event.repayment,
      $event.minimumGasPrice,
      $event.balances,
      1.1,
    );
  }
}
