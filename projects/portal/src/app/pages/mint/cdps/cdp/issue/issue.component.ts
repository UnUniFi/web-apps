import { getIssueLimit } from '../../../../../utils/function';
import { getLiquidationPriceStream } from '../../../../../utils/stream';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosSDKService } from 'projects/portal/src/app/models/index';
import { CdpApplicationService } from 'projects/portal/src/app/models/index';
import { Key } from 'projects/portal/src/app/models/keys/key.model';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import { IssueCdpOnSubmitEvent } from 'projects/portal/src/app/views/mint/cdps/cdp/issue/issue.component';
import { timer, of, zip, combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.css'],
})
export class IssueComponent implements OnInit {
  key$: Observable<Key | undefined>;
  owner$: Observable<string>;
  collateralType$: Observable<string>;
  params$: Observable<ununifi.proto.ununifi.cdp.IParams>;
  principalDenom$: Observable<string>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  cdp$: Observable<InlineResponse2004Cdp1>;
  liquidationPrice$: Observable<ununifi.proto.ununifi.pricefeed.ICurrentPrice>;
  issueLimit$: Observable<number>;

  address$: Observable<cosmosclient.AccAddress | undefined>;
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  pollingInterval = 30;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly keyStore: KeyStoreService,
    private readonly cdpApplicationService: CdpApplicationService,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly configS: ConfigService,
  ) {
    this.key$ = this.keyStore.currentKey$.asObservable();
    this.owner$ = this.route.params.pipe(map((params) => params['owner']));
    this.collateralType$ = this.route.params.pipe(map((params) => params['collateralType']));
    this.params$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => ununifi.rest.cdp.params(sdk.rest)),
      map((data) => data.data.params!),
    );

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
        return cosmosclient.rest.bank
          .allBalances(sdk.rest, address)
          .then((res) => res.data.balances || []);
      }),
    );

    this.cdp$ = combineLatest([this.owner$, this.collateralType$, this.cosmosSDK.sdk$]).pipe(
      mergeMap(([ownerAddr, collateralType, sdk]) =>
        ununifi.rest.cdp.cdp(
          sdk.rest,
          cosmosclient.AccAddress.fromString(ownerAddr),
          collateralType,
        ),
      ),
      map((res) => res.data.cdp!),
    );

    this.principalDenom$ = combineLatest([this.params$, this.cdp$]).pipe(
      map(([params, cdp]) =>
        params.debt_params?.find((debtParam) => debtParam.denom == cdp.cdp?.principal?.denom),
      ),
      map((res) => res?.denom!),
    );

    this.liquidationPrice$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => getLiquidationPriceStream(sdk.rest, this.collateralType$, this.params$)),
    );

    this.issueLimit$ = zip(this.cdp$, this.params$, this.liquidationPrice$).pipe(
      map(([cdp, params, price]) => getIssueLimit(cdp.cdp!, params, price)),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void { }

  onSubmit($event: IssueCdpOnSubmitEvent) {
    this.cdpApplicationService.drawCDP(
      $event.key,
      $event.privateKey,
      $event.collateralType,
      $event.principal,
      $event.minimumGasPrice,
      $event.balances,
      1.1,
    );
  }
}
