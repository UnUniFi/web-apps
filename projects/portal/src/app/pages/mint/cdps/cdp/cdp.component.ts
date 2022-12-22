import { getIssueLimit, getWithdrawLimit } from '../../../../utils/function';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  getCollateralParamsStream,
  UnunifiRestService,
} from 'projects/portal/src/app/models/ununifi-rest.service';
import { combineLatest, Observable, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  CdpAll200ResponseCdpInner,
  DepositAll200ResponseDepositsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-cdp',
  templateUrl: './cdp.component.html',
  styleUrls: ['./cdp.component.css'],
})
export class CdpComponent implements OnInit {
  owner$: Observable<string>;
  collateralType$: Observable<string>;
  denom$: Observable<string>;
  cdpParams$: Observable<ununifi.proto.ununifi.cdp.IParams>;
  cdp$: Observable<CdpAll200ResponseCdpInner>;
  deposits$: Observable<DepositAll200ResponseDepositsInner[]>;

  spotPrice$: Observable<ununifi.proto.ununifi.pricefeed.ICurrentPrice>;
  liquidationPrice$: Observable<ununifi.proto.ununifi.pricefeed.ICurrentPrice>;
  withdrawLimit$: Observable<number>;
  issueLimit$: Observable<number>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ununifiRest: UnunifiRestService,
  ) {
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
    const ownerAndCollateralType$ = combineLatest([this.owner$, this.collateralType$]);

    this.cdp$ = ownerAndCollateralType$.pipe(
      mergeMap(([ownerAddr, collateralType]) =>
        this.ununifiRest.getCdp$(cosmosclient.AccAddress.fromString(ownerAddr), collateralType),
      ),
      map((res) => res!),
    );

    this.deposits$ = ownerAndCollateralType$.pipe(
      mergeMap(([ownerAddr, collateralType]) =>
        this.ununifiRest.getAllDeposits$(
          cosmosclient.AccAddress.fromString(ownerAddr),
          collateralType,
        ),
      ),
      map((res) => res || []),
    );

    this.spotPrice$ = getCollateralParamsStream(this.collateralType$, this.cdpParams$).pipe(
      mergeMap((collateralParams) => this.ununifiRest.getPrice$(collateralParams.spot_market_id)),
    );

    this.liquidationPrice$ = getCollateralParamsStream(this.collateralType$, this.cdpParams$).pipe(
      mergeMap((collateralParams) =>
        this.ununifiRest.getPrice$(collateralParams.liquidation_market_id),
      ),
    );

    this.withdrawLimit$ = zip(this.cdp$, this.cdpParams$, this.spotPrice$).pipe(
      map(([cdp, params, price]) => getWithdrawLimit(cdp.cdp!, params, price)),
    );

    this.issueLimit$ = zip(this.cdp$, this.cdpParams$, this.liquidationPrice$).pipe(
      map(([cdp, params, price]) => getIssueLimit(cdp.cdp!, params, price)),
    );
  }

  ngOnInit(): void {}
}
