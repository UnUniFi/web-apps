import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { proto } from '@cosmos-client/core';
import { CdpApplicationService } from 'projects/portal/src/app/models/cdps/cdp.application.service';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosSDKService } from 'projects/portal/src/app/models/cosmos-sdk.service';
import { Key } from 'projects/portal/src/app/models/keys/key.model';
import { KeyStoreService } from 'projects/portal/src/app/models/keys/key.store.service';
import { DepositCdpOnSubmitEvent } from 'projects/portal/src/app/views/mint/cdps/cdp/deposit/deposit.component';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { rest, ununifi } from 'ununifi-client';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
  key$: Observable<Key | undefined>;
  owner$: Observable<string>;
  collateralType$: Observable<string>;
  params$: Observable<ununifi.cdp.IParams>;
  denom$: Observable<string>;
  minimumGasPrices: proto.cosmos.base.v1beta1.ICoin[];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly keyStore: KeyStoreService,
    private readonly cdpApplicationService: CdpApplicationService,
    private readonly configS: ConfigService,
  ) {
    this.key$ = this.keyStore.currentKey$.asObservable();
    this.owner$ = this.route.params.pipe(map((params) => params['owner']));
    this.collateralType$ = this.route.params.pipe(map((params) => params['collateralType']));
    this.params$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.ununifi.cdp.params(sdk.rest)),
      map((data) => data.data.params!),
    );
    this.denom$ = combineLatest([this.collateralType$, this.params$]).pipe(
      map(([collateralType, params]) => {
        const matchedDenoms = params.collateral_params?.filter(
          (param) => param.type === collateralType,
        );
        return matchedDenoms ? (matchedDenoms[0].denom ? matchedDenoms[0].denom : '') : '';
      }),
    );
    this.minimumGasPrices = this.configS.config.minimumGasPrices;
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
    );
  }
}
