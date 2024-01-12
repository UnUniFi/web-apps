import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  VaultByContract200ResponseVault,
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
} from 'ununifi-client/cjs/openapi';

@Component({
  selector: 'app-contract-pools',
  templateUrl: './contract-pools.component.html',
  styleUrls: ['./contract-pools.component.css'],
})
export class ContractPoolsComponent implements OnInit {
  contractAddress$: Observable<string>;
  vault$: Observable<VaultByContract200ResponseVault>;
  tranchePools$: Observable<AllTranches200ResponseTranchesInner[]>;
  poolsAPYs$: Observable<(TranchePoolAPYs200Response | undefined)[]>;

  constructor(private route: ActivatedRoute, private readonly irsQuery: IrsQueryService) {
    this.contractAddress$ = this.route.params.pipe(map((params) => params.contract));
    this.vault$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.getVaultByContract$(contract)),
    );
    this.tranchePools$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.listTranchesByContract$(contract)),
    );
    this.poolsAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id
              ? await this.irsQuery.getTranchePoolAPYs$(tranche.id).toPromise()
              : undefined,
          ),
        ),
      ),
    );
  }

  ngOnInit(): void {}
}
