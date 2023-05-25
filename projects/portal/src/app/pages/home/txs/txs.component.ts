import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  pollingInterval = 30 * 60;
  txs$?: Observable<BroadcastTx200ResponseTxResponse[] | undefined>;
  txTypeOptions$?: Observable<string[] | undefined>;
  pageSize$: BehaviorSubject<number> = new BehaviorSubject(20);
  pageNumber$: BehaviorSubject<number> = new BehaviorSubject(1);
  txsTotalCount$: Observable<bigint>;
  txsPageOffset$: Observable<bigint>;
  selectedTxType$: BehaviorSubject<string> = new BehaviorSubject('bank');

  constructor(private configService: ConfigService, private cosmosRest: CosmosRestService) {
    this.txTypeOptions$ = this.configService.config$.pipe(
      map((config) => config?.extension?.messageModules),
    );
    const timer$ = timer(0, this.pollingInterval * 1000);

    this.txsTotalCount$ = combineLatest([timer$, this.selectedTxType$]).pipe(
      switchMap(([_, selectedTxType]) =>
        this.cosmosRest.getSelectedTxTypeEvent$(selectedTxType).pipe(
          map((res) => res.pagination?.total),
          map((total) => (total ? BigInt(total) : BigInt(0))),
        ),
      ),
    );

    this.txsPageOffset$ = combineLatest([
      this.pageNumber$,
      this.pageSize$,
      this.txsTotalCount$,
    ]).pipe(
      map(([pageNumber, pageSize, txsTotalCount]) => {
        const pageOffset = txsTotalCount - BigInt(pageSize) * BigInt(pageNumber);
        return pageOffset;
      }),
    );

    this.txs$ = combineLatest([
      timer$,
      this.selectedTxType$,
      this.pageSize$.asObservable(),
      this.txsPageOffset$,
      this.txsTotalCount$,
    ]).pipe(
      filter(
        ([_, _selectedTxType, _pageSize, _pageOffset, txTotalCount]) => txTotalCount !== BigInt(0),
      ),
      switchMap(([_, selectedTxType, pageSize, pageOffset, _txsTotalCount]) => {
        const modifiedPageOffset = pageOffset < 1 ? BigInt(1) : pageOffset;
        const modifiedPageSize = pageOffset < 1 ? pageOffset + BigInt(pageSize) : BigInt(pageSize);

        if (modifiedPageOffset <= 0 || modifiedPageSize <= 0) {
          return [];
        }

        return this.cosmosRest
          .getSelectedTxTypeEvent$(selectedTxType, modifiedPageOffset, modifiedPageSize)
          .pipe(map((res) => res.tx_responses));
      }),
      map((txs) => txs?.reverse()),
    );
  }

  ngOnInit(): void {}

  appSelectedTxTypeChanged(selectedTxType: string): void {
    this.selectedTxType$.next(selectedTxType);
  }
}
