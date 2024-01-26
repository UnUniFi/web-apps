import { ConfigService, IRSVaultImage } from '../../../models/config.service';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  constructor(private readonly irsQuery: IrsQueryService, private readonly configS: ConfigService) {
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
  }

  ngOnInit(): void {}
}
