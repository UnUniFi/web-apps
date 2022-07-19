import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { CdpApplicationService } from 'projects/portal/src/app/models/index';
import { Key } from 'projects/portal/src/app/models/keys/key.model';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import { UnunifiRestService } from 'projects/portal/src/app/models/ununifi-rest.service';
import { DepositCdpOnSubmitEvent } from 'projects/portal/src/app/views/mint/cdps/cdp/deposit/deposit.component';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import ununifi from 'ununifi-client';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
  key$: Observable<Key | undefined>;
  owner$: Observable<string>;
  collateralType$: Observable<string>;
  params$: Observable<ununifi.proto.ununifi.cdp.IParams>;
  denom$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
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
    this.params$ = this.ununifiRest.getCdpParams$().pipe(map((res) => res!));

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
      map((balances) => balances ?? []),
    );

    this.denom$ = combineLatest([this.collateralType$, this.params$, this.balances$]).pipe(
      map(([collateralType, params, balances]) => {
        const matchedDenoms = params.collateral_params?.filter(
          (param) => param.type === collateralType,
        );
        const collateralDenom = matchedDenoms
          ? matchedDenoms[0].denom
            ? matchedDenoms[0].denom
            : ''
          : '';
        const collateralDenomWithBalance = balances?.find(
          (balances) => balances.denom === collateralDenom,
        );

        return collateralDenomWithBalance;
      }),
    );
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  onSubmit($event: DepositCdpOnSubmitEvent) {
    this.cdpApplicationService.depositCDP(
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
