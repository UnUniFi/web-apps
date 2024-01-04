import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import { MintPtRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  AllTranches200ResponseTranchesInner,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-simple-vault',
  templateUrl: './simple-vault.component.html',
  styleUrls: ['./simple-vault.component.css'],
})
export class SimpleVaultComponent implements OnInit {
  address$: Observable<string>;
  contractAddress$: Observable<string>;
  vault$: Observable<VaultByContract200ResponseVault>;
  tranches$: Observable<AllTranches200ResponseTranchesInner[]>;
  // vaultDetails$: Observable<(VaultDetails200Response | undefined)[]>;
  vaultBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
    private readonly irsAppService: IrsApplicationService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.contractAddress$ = this.route.params.pipe(map((params) => params.contract));
    this.vault$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.getVaultByContract$(contract)),
    );
    this.tranches$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.listTranchesByContract$(contract)),
    );
    // this.vaultDetails$ = this.tranches$.pipe(
    //   mergeMap((tranches) =>
    //     Promise.all(
    //       tranches.map(async (tranche) =>
    //         tranche.strategy_contract && tranche.maturity
    //           ? await this.irsQuery
    //               .getVaultDetail$(tranche.strategy_contract, tranche.maturity)
    //               .toPromise()
    //           : undefined,
    //       ),
    //     ),
    //   ),
    // );
    const balances$ = this.address$.pipe(mergeMap((addr) => this.bankQuery.getBalance$(addr)));
    this.vaultBalances$ = combineLatest([balances$, this.tranches$]).pipe(
      map(([balance, tranches]) =>
        balance.filter((balance) =>
          tranches.some((tranche) => balance.denom?.includes(`irs/tranche/${tranche.id}/pt`)),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onMintPT(data: MintPtRequest) {
    this.irsAppService.mintPT(data);
  }
}
