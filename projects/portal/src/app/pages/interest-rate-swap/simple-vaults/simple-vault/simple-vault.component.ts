import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import { MintPtRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  AllTranches200ResponseTranchesInner,
  VaultDetails200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-simple-vault',
  templateUrl: './simple-vault.component.html',
  styleUrls: ['./simple-vault.component.css'],
})
export class SimpleVaultComponent implements OnInit {
  contractAddress$: Observable<string>;
  tranches$: Observable<AllTranches200ResponseTranchesInner[]>;
  vaultDetails$: Observable<(VaultDetails200Response | undefined)[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly irsQuery: IrsQueryService,
    private readonly irsAppService: IrsApplicationService,
  ) {
    this.contractAddress$ = this.route.params.pipe(map((params) => params.contract));
    this.tranches$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.listTranchesByContract$(contract)),
    );
    this.vaultDetails$ = this.tranches$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.strategy_contract && tranche.maturity
              ? await this.irsQuery
                  .getVaultDetail$(tranche.strategy_contract, tranche.maturity)
                  .toPromise()
              : undefined,
          ),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onMintPT(data: MintPtRequest) {
    this.irsAppService.mintPT(data);
  }
}
