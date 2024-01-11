import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TranchePoolAPYs200Response } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-simple-pools',
  templateUrl: './simple-pools.component.html',
  styleUrls: ['./simple-pools.component.css'],
})
export class SimplePoolsComponent implements OnInit {
  tranchePools$ = this.irsQuery.listAllTranches$();
  vaults$ = this.irsQuery.listVaults$();
  poolsAPYs$: Observable<(TranchePoolAPYs200Response | undefined)[]>;

  constructor(private readonly irsQuery: IrsQueryService) {
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
  }

  ngOnInit(): void {}
}
