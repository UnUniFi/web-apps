import { getWithdrawLimit } from '../../../../../utils/function';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { CdpApplicationService } from 'projects/portal/src/app/models/index';
import { Key } from 'projects/portal/src/app/models/keys/key.model';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import {
  getCollateralParamsStream,
  UnunifiRestService,
} from 'projects/portal/src/app/models/ununifi-rest.service';
import { WithdrawCdpOnSubmitEvent } from 'projects/portal/src/app/views/mint/cdps/cdp/withdraw/withdraw.component';
import { combineLatest, Observable, of, timer, zip } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import { CdpAll200ResponseCdpInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
})
export class WithdrawComponent implements OnInit {
  key$: Observable<Key | undefined>;
  owner$: Observable<string>;
  collateralType$: Observable<string>;
  cdpParams$: Observable<ununifi.proto.ununifi.cdp.IParams>;
  denom$: Observable<string>;

  cdp$: Observable<CdpAll200ResponseCdpInner>;
  spotPrice$: Observable<ununifi.proto.ununifi.pricefeed.ICurrentPrice>;
  withdrawLimit$: Observable<number>;

  address$: Observable<cosmosclient.AccAddress | undefined>;
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  pollingInterval = 30;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly keyStore: KeyStoreService,
    private readonly cdpApplicationService: CdpApplicationService,
    private readonly configS: ConfigService,
    private readonly ununifiRest: UnunifiRestService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.key$ = this.keyStore.currentKey$.asObservable();
    this.owner$ = this.route.params.pipe(map((params) => params['owner']));
    this.collateralType$ = this.route.params.pipe(map((params) => params['collateralType']));
    this.cdpParams$ = this.ununifiRest.getCdpParams$().pipe(map((res) => res!));
    this.denom$ = combineLatest([this.collateralType$, this.cdpParams$]).pipe(
      map(([collateralType, params]) => {
        const matchedDenoms = params.collateral_params?.filter(
          (param) => param.type === collateralType,
        );
        return matchedDenoms ? (matchedDenoms[0].denom ? matchedDenoms[0].denom : '') : '';
      }),
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
    this.balances$ = timer$.pipe(
      withLatestFrom(this.address$),
      mergeMap(([_, address]) => {
        if (address === undefined) {
          return of([]);
        }
        return this.cosmosRest.getAllBalances$(address);
      }),
    );

    this.cdp$ = combineLatest([this.owner$, this.collateralType$]).pipe(
      mergeMap(([ownerAddr, collateralType]) =>
        this.ununifiRest.getCdp$(cosmosclient.AccAddress.fromString(ownerAddr), collateralType),
      ),
      map((res) => res!),
    );

    this.spotPrice$ = getCollateralParamsStream(this.collateralType$, this.cdpParams$).pipe(
      mergeMap((collateralParams) => this.ununifiRest.getPrice$(collateralParams.spot_market_id)),
    );

    this.withdrawLimit$ = zip(this.cdp$, this.cdpParams$, this.spotPrice$).pipe(
      map(([cdp, params, price]) => getWithdrawLimit(cdp.cdp!, params, price)),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  onSubmit($event: WithdrawCdpOnSubmitEvent) {
    this.cdpApplicationService.withdrawCDP(
      $event.key,
      $event.privateKey,
      $event.ownerAddr,
      $event.collateralType,
      $event.collateral,
      $event.minimumGasPrice,
      $event.balances,
      1.1,
    );
  }
}
