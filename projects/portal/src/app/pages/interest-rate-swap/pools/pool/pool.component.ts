import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AllTranches200ResponseTranchesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  poolId$: Observable<string>;
  tranchePool$: Observable<AllTranches200ResponseTranchesInner>;

  constructor(
    private route: ActivatedRoute,
    private readonly irsQuery: IrsQueryService,
    private readonly irsAppService: IrsApplicationService,
  ) {
    this.poolId$ = this.route.params.pipe(map((params) => params.id));
    this.tranchePool$ = this.poolId$.pipe(mergeMap((id) => this.irsQuery.getTranche$(id)));
  }

  ngOnInit(): void {}

  onMintLP(data: MintLpRequest) {
    this.irsAppService.mintLP(data);
  }
  onRedeemLP(data: RedeemLpRequest) {
    this.irsAppService.redeemLP(data);
  }
}
