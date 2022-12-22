import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { CdpApplicationService } from 'projects/portal/src/app/models/index';
import { Key } from 'projects/portal/src/app/models/keys/key.model';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import { UnunifiRestService } from 'projects/portal/src/app/models/ununifi-rest.service';
import { ClearCdpOnSubmitEvent } from 'projects/portal/src/app/views/mint/cdps/cdp/clear/clear.component';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import { CdpAll200ResponseCdpInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-clear',
  templateUrl: './clear.component.html',
  styleUrls: ['./clear.component.css'],
})
export class ClearComponent implements OnInit {
  key$: Observable<Key | undefined>;
  owner$: Observable<string>;
  collateralType$: Observable<string>;
  params$: Observable<ununifi.proto.ununifi.cdp.IParams>;
  repaymentDenomString$: Observable<string>;
  repaymentDenom$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;

  cdp$: Observable<CdpAll200ResponseCdpInner>;

  address$: Observable<cosmosclient.AccAddress | undefined>;
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  pollingInterval = 30;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly keyStore: KeyStoreService,
    private readonly cdpApplicationService: CdpApplicationService,
    private readonly configS: ConfigService,
    private readonly cosmosRest: CosmosRestService,
    private readonly ununifiRest: UnunifiRestService,
  ) {
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
    this.balances$ = timer$.pipe(
      withLatestFrom(this.address$),
      mergeMap(([_, address]) => {
        if (address === undefined) {
          return of([]);
        }
        return this.cosmosRest.getAllBalances$(address).pipe(map((res) => res || []));
      }),
    );

    this.params$ = this.ununifiRest.getCdpParams$().pipe(map((res) => res!));

    this.cdp$ = combineLatest([this.owner$, this.collateralType$]).pipe(
      mergeMap(([ownerAddr, collateralType]) =>
        this.ununifiRest.getCdp$(cosmosclient.AccAddress.fromString(ownerAddr), collateralType),
      ),
      map((res) => res!),
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
