import { BandProtocolService } from '../../../models/band-protocols/band-protocol.service';
import { ConfigService, IRSVaultImage } from '../../../models/config.service';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TranchePtAPYs200Response, TrancheYtAPYs200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  vaults$ = this.irsQuery.listVaults$();
  tranchePools$ = this.irsQuery.listAllTranches$();
  trancheFixedAPYs$: Observable<(TranchePtAPYs200Response | undefined)[]>;
  trancheLongAPYs$: Observable<(TrancheYtAPYs200Response | undefined)[]>;
  vaultsImages$: Observable<IRSVaultImage[]>;
  trancheTokenPrices$: Observable<{ depositPrice: number; ptPrice: number; ytPrice: number }[]>;

  constructor(
    private readonly irsQuery: IrsQueryService,
    private readonly configS: ConfigService,
    private readonly bankQuery: BankQueryService,
    private readonly bandProtocolService: BandProtocolService,
  ) {
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
    this.vaultsImages$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));

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
