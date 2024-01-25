import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRSVaultImage, ConfigService } from 'projects/portal/src/app/models/config.service';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable, combineLatest } from 'rxjs';
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
    this.trancheFixedAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTranchePtAPYs(tranche.id) : undefined,
          ),
        ),
      ),
    );
    this.trancheLongAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTrancheYtAPYs(tranche.id) : undefined,
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
