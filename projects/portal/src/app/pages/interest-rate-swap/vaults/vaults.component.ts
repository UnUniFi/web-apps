import { ConfigService, IRSVaultImage } from '../../../models/config.service';
import {
  dummyFixedAPYs,
  dummyLongAPYs,
  dummyTranchePools,
  dummyVaults,
} from '../../../models/irs/irs.dummy';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
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

  constructor(private readonly irsQuery: IrsQueryService, private readonly configS: ConfigService) {
    this.trancheFixedAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTranchePtAPYs$(tranche.id).toPromise() : undefined,
          ),
        ),
      ),
    );
    this.trancheLongAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTrancheYtAPYs$(tranche.id).toPromise() : undefined,
          ),
        ),
      ),
    );
    this.vaultsImages$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.vaults$ = of(dummyVaults);
    this.tranchePools$ = of(dummyTranchePools);
    this.trancheFixedAPYs$ = of(dummyFixedAPYs);
    this.trancheLongAPYs$ = of(dummyLongAPYs);
  }

  ngOnInit(): void {}
}
