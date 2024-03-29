import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncentiveQueryService } from 'projects/portal/src/app/models/incentives/incentive.query.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
export class UnitComponent implements OnInit {
  unitId$: Observable<string>;
  txMemo$: Observable<string>;

  constructor(private route: ActivatedRoute, private incentiveQuery: IncentiveQueryService) {
    this.unitId$ = this.route.params.pipe(map((params) => params.unit_id));
    this.txMemo$ = this.unitId$.pipe(
      map((id) => JSON.stringify({ version: 'v1', 'incentive-unit-id': id })),
    );
  }

  ngOnInit(): void {}
}
