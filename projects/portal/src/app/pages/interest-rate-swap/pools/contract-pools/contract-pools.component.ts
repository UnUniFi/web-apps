import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRSVaultImage, ConfigService } from 'projects/portal/src/app/models/config.service';
import {
  dummyVaults,
  dummyTranchePools,
  dummyPoolAPYs,
} from 'projects/portal/src/app/models/irs/irs.dummy';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable, combineLatest, of } from 'rxjs';
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
  vaultImage$?: Observable<IRSVaultImage | undefined>;

  constructor(
    private route: ActivatedRoute,
    private readonly irsQuery: IrsQueryService,
    private readonly configS: ConfigService,
  ) {
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
    const images$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.vaultImage$ = combineLatest([this.vault$, images$]).pipe(
      map(([vault, images]) => images.find((image) => image.contract === vault.strategy_contract)),
    );
    this.vault$ = of(dummyVaults[0]);
    this.tranchePools$ = of(dummyTranchePools.slice(0, 3));
    this.poolsAPYs$ = of(dummyPoolAPYs.slice(0, 3));
  }

  ngOnInit(): void {}
}
