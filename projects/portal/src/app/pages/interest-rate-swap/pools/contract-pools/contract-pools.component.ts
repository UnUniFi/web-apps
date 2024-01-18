import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRSVaultImage, ConfigService } from 'projects/portal/src/app/models/config.service';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable, combineLatest } from 'rxjs';
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
    this.vaultImage$ = combineLatest([this.contractAddress$, images$]).pipe(
      map(([contract, images]) => images.find((image) => image.contract === contract)),
    );
  }

  ngOnInit(): void {}
}
