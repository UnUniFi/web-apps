import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandProtocolService } from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { IRSVaultImage, ConfigService } from 'projects/portal/src/app/models/config.service';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
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
  vault$: Observable<VaultByContract200ResponseVault | undefined>;
  tranchePools$: Observable<AllTranches200ResponseTranchesInner[] | undefined>;
  trancheFixedAPYs$: Observable<(TranchePtAPYs200Response | undefined)[]>;
  trancheLongAPYs$: Observable<(TrancheYtAPYs200Response | undefined)[]>;
  vaultImage$?: Observable<IRSVaultImage | undefined>;
  trancheTokenPrices$: Observable<{ depositPrice: number; ptPrice: number; ytPrice: number }[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly irsQuery: IrsQueryService,
    private readonly configS: ConfigService,
    private readonly bankQuery: BankQueryService,
    private readonly bandProtocolService: BandProtocolService,
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
          tranches
            ? tranches.map(async (tranche) =>
                tranche.id ? await this.irsQuery.getTranchePtAPYs(tranche.id) : undefined,
              )
            : [],
        ),
      ),
    );
    this.trancheLongAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches
            ? tranches.map(async (tranche) =>
                tranche.id ? await this.irsQuery.getTrancheYtAPYs(tranche.id) : undefined,
              )
            : [],
        ),
      ),
    );
    const images$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.vaultImage$ = combineLatest([this.contractAddress$, images$]).pipe(
      map(([contract, images]) => images.find((image) => image.contract === contract)),
    );

    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    const symbols$ = combineLatest([this.tranchePools$, denomMetadataMap$]).pipe(
      map(([pools, metadata]) => pools?.map((pool) => metadata[pool.deposit_denom || '']?.symbol)),
    );
    const prices$ = symbols$.pipe(
      mergeMap((symbols) =>
        Promise.all(
          symbols
            ? symbols.map(async (symbol) => {
                if (!symbol) {
                  return 0;
                }
                if (symbol.includes('st')) {
                  symbol = symbol.replace('st', '');
                }
                return await this.bandProtocolService.getPrice(symbol);
              })
            : [],
        ),
      ),
    );
    const poolsPtAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches
            ? tranches.map(async (tranche) =>
                tranche.id ? await this.irsQuery.getTranchePtAPYs(tranche.id) : undefined,
              )
            : [],
        ),
      ),
    );
    const poolsYtAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches
            ? tranches.map(async (tranche) =>
                tranche.id ? await this.irsQuery.getTrancheYtAPYs(tranche.id) : undefined,
              )
            : [],
        ),
      ),
    );
    this.trancheTokenPrices$ = combineLatest([prices$, poolsPtAPYs$, poolsYtAPYs$]).pipe(
      map(([prices, ptAPYs, ytAPYs]) =>
        prices.map((price, i) => {
          if (!price) {
            return { depositPrice: 0, ptPrice: 0, ytPrice: 0 };
          }
          const ptRate = Number(ptAPYs[i]?.pt_rate_per_deposit);
          const ytRate = Number(ytAPYs[i]?.yt_rate_per_deposit);
          const ptPrice = ptRate ? price / ptRate : 0;
          const ytPrice = ytRate ? price / ytRate : 0;
          return { depositPrice: price, ptPrice, ytPrice };
        }),
      ),
    );
  }

  ngOnInit(): void {}
}
