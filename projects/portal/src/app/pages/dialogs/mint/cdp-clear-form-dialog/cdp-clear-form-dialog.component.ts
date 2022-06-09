import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { proto, cosmosclient, rest as restCosmos } from '@cosmos-client/core';
import { ConfigService } from 'projects/explorer/src/app/models/config.service';
import { CosmosSDKService, CdpApplicationService } from 'projects/portal/src/app/models';
import { Key } from 'projects/portal/src/app/models/keys/key.model';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import { getCreateLimit } from 'projects/portal/src/app/utils/function';
import { getLiquidationPriceStream } from 'projects/portal/src/app/utils/stream';
import { ClearCdpOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/mint/cdp-clear-form-dialog/cdp-clear-form-dialog.component';
import { Observable, combineLatest, timer, of, async, BehaviorSubject } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ununifi, rest } from 'ununifi-client';
import { InlineResponse2004Cdp1 } from 'ununifi-client/cjs/openapi';

@Component({
  selector: 'app-cdp-clear-form-dialog',
  templateUrl: './cdp-clear-form-dialog.component.html',
  styleUrls: ['./cdp-clear-form-dialog.component.css'],
})
export class CdpClearFormDialogComponent implements OnInit {
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  cdp: InlineResponse2004Cdp1;
  cdpParams$: Observable<ununifi.cdp.IParams>;
  key$: Observable<Key | undefined>;
  owner$: Observable<string>;
  collateralType$: Observable<string>;
  params$: Observable<ununifi.cdp.IParams>;
  repaymentDenomString$: Observable<string>;
  repaymentDenom$: Observable<proto.cosmos.base.v1beta1.ICoin | undefined>;
  address$: Observable<cosmosclient.AccAddress | undefined>;
  balances$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  pollingInterval = 30;
  liquidationPrice$: Observable<ununifi.pricefeed.ICurrentPrice>;
  principalLimit$: Observable<number>;
  collateralInputValue: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse2004Cdp1,
    public matDialogRef: MatDialogRef<CdpClearFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly configS: ConfigService,
    private readonly cdpApplicationService: CdpApplicationService,
    private readonly route: ActivatedRoute,
    private readonly keyStore: KeyStoreService,
  ) {
    this.cdp = data;
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

    this.repaymentDenomString$ = this.params$.pipe(
      map((params) =>
        params.debt_params?.find((debtParam) => debtParam.denom == this.cdp.cdp?.principal?.denom),
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

    this.cdpParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.ununifi.cdp.params(sdk.rest)),
      map((param) => param.data.params!),
    );
    // get principal limit

    this.liquidationPrice$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => getLiquidationPriceStream(sdk.rest, this.collateralType$, this.cdpParams$)),
    );
    this.principalLimit$ = combineLatest([
      this.collateralType$,
      this.cdpParams$,
      this.liquidationPrice$,
      this.collateralInputValue.asObservable(),
    ]).pipe(
      map(([collateralType, params, liquidationPrice, collateralAmount]) => {
        return getCreateLimit(params, collateralAmount, collateralType, liquidationPrice);
      }),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}
  async onSubmit($event: ClearCdpOnSubmitEvent) {
    let txHash: string | undefined;

    txHash = await this.cdpApplicationService.repayCDP(
      $event.key,
      $event.privateKey,
      $event.collateralType,
      $event.repayment,
      $event.minimumGasPrice,
      $event.balances,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
}
