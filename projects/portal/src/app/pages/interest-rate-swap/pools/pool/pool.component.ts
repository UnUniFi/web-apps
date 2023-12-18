import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AllTranches200ResponseTranchesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  poolId$: Observable<string>;
  lsDenom$: Observable<string>;
  ptDenom$: Observable<string>;
  tranchePool$: Observable<AllTranches200ResponseTranchesInner>;

  mintLsAmount$: BehaviorSubject<number>;
  redeemLsAmount$: BehaviorSubject<number>;
  estimateMintRequiredAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  estimateRedeemAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly irsQuery: IrsQueryService,
    private readonly irsAppService: IrsApplicationService,
  ) {
    this.poolId$ = this.route.params.pipe(map((params) => params.id));
    this.lsDenom$ = this.poolId$.pipe(map((id) => `irs/tranche/${id}/ls`));
    this.ptDenom$ = this.poolId$.pipe(map((id) => `irs/tranche/${id}/pt`));
    this.tranchePool$ = this.poolId$.pipe(mergeMap((id) => this.irsQuery.getTranche$(id)));
    this.mintLsAmount$ = new BehaviorSubject(0);
    this.redeemLsAmount$ = new BehaviorSubject(0);
    this.estimateMintRequiredAmount$ = combineLatest([
      this.poolId$,
      this.mintLsAmount$.asObservable(),
    ]).pipe(
      mergeMap(([id, amount]) =>
        this.irsQuery.estimateMintLiquidity(id, Math.floor(amount * Math.pow(10, 6)).toString()),
      ),
    );
    this.estimateRedeemAmount$ = combineLatest([
      this.poolId$,
      this.redeemLsAmount$.asObservable(),
    ]).pipe(
      mergeMap(([id, amount]) =>
        this.irsQuery.estimateRedeemLiquidity(id, Math.floor(amount * Math.pow(10, 6)).toString()),
      ),
    );
  }

  ngOnInit(): void {}

  onChangeMintAmount(amount: number) {
    this.mintLsAmount$.next(amount);
  }
  onChangeRedeemAmount(amount: number) {
    this.redeemLsAmount$.next(amount);
  }
  onMintLP(data: MintLpRequest) {
    this.irsAppService.mintLP(data);
  }
  onRedeemLP(data: RedeemLpRequest) {
    this.irsAppService.redeemLP(data);
  }
}
