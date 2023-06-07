import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncentiveQueryService } from 'projects/portal/src/app/models/incentives/incentive.query.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { RecipientContainer200ResponseRecipientContainer } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
export class UnitComponent implements OnInit {
  unitId$: Observable<string>;
  txMemo$: Observable<string>;
  unit$: Observable<RecipientContainer200ResponseRecipientContainer>;

  constructor(private route: ActivatedRoute, private incentiveQuery: IncentiveQueryService) {
    this.unitId$ = this.route.params.pipe(map((params) => params.unit_id));
    this.txMemo$ = this.unitId$.pipe(
      map((id) => JSON.stringify({ version: 'v1', 'incentive-unit-id': id })),
    );
    this.unit$ = this.unitId$.pipe(
      mergeMap((unitId) => this.incentiveQuery.getRecipientContainer$(unitId)),
    );
  }

  ngOnInit(): void {}
}
