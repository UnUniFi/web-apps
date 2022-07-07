import { CdpApplicationService } from '../../../../models/index';
import { Key } from '../../../../models/keys/key.model';
import { KeyService } from '../../../../models/keys/key.service';
import { getCreateLimit } from '../../../../utils/function';
import { CreateCdpOnSubmitEvent } from '../../../../views/mint/cdps/create/create.component';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import {
  getCollateralParamsStream,
  UnunifiRestService,
} from 'projects/portal/src/app/models/ununifi-rest.service';
import { BehaviorSubject, combineLatest, Observable, of, Subject, timer } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  key$: Observable<Key | undefined>;
  cdpParams$: Observable<ununifi.proto.ununifi.cdp.IParams>;
  collateralParams$: Observable<ununifi.proto.ununifi.cdp.ICollateralParam[] | null | undefined>;
  selectedCollateralTypeSubject: Subject<string | null | undefined>;
  selectedCollateralType$: Observable<string | null | undefined>;
  selectedCollateralParam$: Observable<
    ununifi.proto.ununifi.cdp.ICollateralParam | null | undefined
  >;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  address$: Observable<cosmosclient.AccAddress>;
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  pollingInterval = 30;

  collateralType$: Observable<string>;
  collateralLimit$: Observable<number>;

  collateralInputValue: BehaviorSubject<number> = new BehaviorSubject(0);
  liquidationPrice$: Observable<ununifi.proto.ununifi.pricefeed.ICurrentPrice>;
  principalLimit$: Observable<number>;

  cdp$: Observable<InlineResponse2004Cdp1 | undefined>;

  constructor(
    private readonly key: KeyService,
    private readonly keyStore: KeyStoreService,
    private readonly cdpApplicationService: CdpApplicationService,
    private readonly configS: ConfigService,
    private readonly ununifiRest: UnunifiRestService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.key$ = this.keyStore.currentKey$.asObservable();
    this.cdpParams$ = this.ununifiRest.getCdpParams$().pipe(map((res) => res!));

    this.collateralParams$ = this.cdpParams$.pipe(map((cdpParams) => cdpParams?.collateral_params));
    this.selectedCollateralTypeSubject = new Subject();
    this.collateralParams$.subscribe((collateralParams) => {
      if (collateralParams === undefined || collateralParams === null) {
        this.selectedCollateralTypeSubject.next(undefined);
        return;
      }
      this.selectedCollateralTypeSubject.next(collateralParams[0].type);
    });
    this.selectedCollateralType$ = this.selectedCollateralTypeSubject.asObservable();
    this.selectedCollateralParam$ = combineLatest([
      this.collateralParams$,
      this.selectedCollateralType$,
    ]).pipe(
      map(([collateralParams, selectedCollateralType]) => {
        if (
          collateralParams === undefined ||
          collateralParams === null ||
          selectedCollateralType === undefined ||
          selectedCollateralType === null
        ) {
          return undefined;
        }
        return collateralParams.filter(
          (collateralParam) => collateralParam.type === selectedCollateralType,
        )[0];
      }),
    );

    //get account balance information
    this.address$ = this.key$.pipe(
      filter((key): key is Key => key !== undefined),
      map((key) =>
        cosmosclient.AccAddress.fromPublicKey(this.key.getPubKey(key!.type, key.public_key)),
      ),
    );
    const timer$ = timer(0, this.pollingInterval * 1000);
    this.balances$ = combineLatest([timer$, this.address$]).pipe(
      mergeMap(([_, address]) => {
        if (address === undefined) {
          return of([]);
        }
        return this.cosmosRest.getAllBalances$(address);
      }),
    );

    // get collateral limit
    this.collateralLimit$ = combineLatest([this.balances$, this.selectedCollateralParam$]).pipe(
      map(([balances, CollateralParam]) => {
        if (!CollateralParam) {
          return 0;
        }
        if (!balances) {
          return 0;
        }
        const collateralDenomLimit = balances.find(
          (balance) => balance.denom === CollateralParam.denom,
        )?.amount;
        return Number(collateralDenomLimit);
      }),
    );

    // get principal limit
    this.collateralType$ = this.selectedCollateralType$.pipe(map((type) => (type ? type : '')));

    this.liquidationPrice$ = getCollateralParamsStream(this.collateralType$, this.cdpParams$).pipe(
      mergeMap((collateralParams) =>
        this.ununifiRest.getPrice$(collateralParams.liquidation_market_id),
      ),
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

    // check cdp
    this.cdp$ = combineLatest([this.address$, this.collateralType$]).pipe(
      mergeMap(([ownerAddr, collateralType]) =>
        this.ununifiRest.getCdp$(ownerAddr, collateralType),
      ),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  onSubmit($event: CreateCdpOnSubmitEvent) {
    this.cdpApplicationService.createCDP(
      $event.key,
      $event.privateKey,
      $event.collateralType,
      $event.collateral,
      $event.principal,
      $event.minimumGasPrice,
      $event.balances,
      1.1,
    );
  }

  onSelectedCollateralTypeChanged(collateralType: string): void {
    this.selectedCollateralTypeSubject.next(collateralType);
  }

  onCollateralAmountChanged(amount: number): void {
    this.collateralInputValue.next(amount);
  }
}
