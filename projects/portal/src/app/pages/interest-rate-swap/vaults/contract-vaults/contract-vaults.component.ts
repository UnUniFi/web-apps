import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  VaultByContract200ResponseVault,
  AllTranches200ResponseTranchesInner,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-contract-vaults',
  templateUrl: './contract-vaults.component.html',
  styleUrls: ['./contract-vaults.component.css'],
})
export class ContractVaultsComponent implements OnInit {
  contractAddress$: Observable<string>;
  vault$: Observable<VaultByContract200ResponseVault>;
  tranchePools$: Observable<AllTranches200ResponseTranchesInner[]>;
  trancheFixedAPYs$: Observable<(TranchePtAPYs200Response | undefined)[]>;
  trancheLongAPYs$: Observable<(TrancheYtAPYs200Response | undefined)[]>;

  constructor(private route: ActivatedRoute, private readonly irsQuery: IrsQueryService) {
    this.contractAddress$ = this.route.params.pipe(map((params) => params.contract));
    this.vault$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.getVaultByContract$(contract)),
    );
    this.tranchePools$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.listTranchesByContract$(contract)),
    );
    this.trancheFixedAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTranchePtAPYs$(tranche.id).toPromise() : undefined,
          ),
        ),
      ),
    );
    this.trancheLongAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTrancheYtAPYs$(tranche.id).toPromise() : undefined,
          ),
        ),
      ),
    );
  }

  ngOnInit(): void {}
}
