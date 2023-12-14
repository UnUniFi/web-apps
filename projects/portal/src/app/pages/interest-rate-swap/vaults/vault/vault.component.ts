import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import {
  MintPtRequest,
  MintPtYtRequest,
  MintYtRequest,
  RedeemPtRequest,
  RedeemPtYtRequest,
  RedeemYtRequest,
} from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  AllTranches200ResponseTranchesInner,
  VaultDetails200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
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

  onMintYT(data: MintYtRequest) {
    this.irsAppService.mintYT(data);
  }
  onRedeemYT(data: RedeemYtRequest) {
    this.irsAppService.redeemYT(data);
  }
  onMintPT(data: MintPtRequest) {
    this.irsAppService.mintPT(data);
  }
  onRedeemPT(data: RedeemPtRequest) {
    this.irsAppService.redeemPT(data);
  }
  onMintPTYT(data: MintPtYtRequest) {
    this.irsAppService.mintPTYT(data);
  }
  onRedeemPTYT(data: RedeemPtYtRequest) {
    this.irsAppService.redeemPTYT(data);
  }
}
