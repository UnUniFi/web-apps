import { BandProtocolService } from '../../../models/band-protocols/band-protocol.service';
import { ConfigService, IRSVaultImage } from '../../../models/config.service';
import { getDenomExponent } from '../../../models/cosmos/bank.model';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TranchePoolAPYs200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.css'],
})
export class PoolsComponent implements OnInit {
  tranchePools$ = this.irsQuery.listAllTranches$();
  vaults$ = this.irsQuery.listVaults$();
  poolsAPYs$: Observable<(TranchePoolAPYs200Response | undefined)[]>;
  vaultsImages$: Observable<IRSVaultImage[]>;
  totalLiquiditiesUSD$: Observable<number[]>;

  constructor(
    private readonly irsQuery: IrsQueryService,
    private readonly configS: ConfigService,
    private readonly bankQuery: BankQueryService,
    private readonly bandProtocolService: BandProtocolService,
  ) {
    this.poolsAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTranchePoolAPYs(tranche.id) : undefined,
          ),
        ),
      ),
    );
    this.vaultsImages$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));

    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    const symbols$ = combineLatest([this.tranchePools$, denomMetadataMap$]).pipe(
      map(([pools, metadata]) => pools.map((pool) => metadata[pool.deposit_denom || '']?.symbol)),
    );
    const prices$ = symbols$.pipe(
      mergeMap((symbols) =>
        Promise.all(
          symbols.map(async (symbol) => {
            if (!symbol) {
              return 0;
            }
            if (symbol.includes('st')) {
              symbol = symbol.replace('st', '');
            }
            return await this.bandProtocolService.getPrice(symbol);
          }),
        ),
      ),
    );
    const poolsPtAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTranchePtAPYs(tranche.id) : undefined,
          ),
        ),
      ),
    );
    this.totalLiquiditiesUSD$ = combineLatest([this.tranchePools$, prices$, poolsPtAPYs$]).pipe(
      map(([pools, prices, apys]) =>
        pools.map((pool, i) => {
          let value = 0;
          const price = prices[i];
          const apy = apys[i];
          if (!pool.pool_assets || !price || !apy) {
            return 0;
          }
          for (const asset of pool.pool_assets) {
            const amount = Number(asset.amount) / Math.pow(10, getDenomExponent(asset.denom));
            if (asset.denom === `irs/tranche/${pool.id}/pt`) {
              const rate = Number(apy.pt_rate_per_deposit);
              if (!rate) {
                continue;
              }
              const ptValue = (amount * price) / rate;
              value += ptValue;
            } else {
              const depositValue = amount * price;
              value += depositValue;
            }
          }
          return value;
        }),
      ),
    );
  }

  ngOnInit(): void {}
}
