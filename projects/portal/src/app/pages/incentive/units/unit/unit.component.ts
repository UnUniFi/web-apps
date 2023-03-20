import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnunifiRestService } from 'projects/portal/src/app/models/ununifi-rest.service';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { IncentiveUnit200ResponseIncentiveUnit } from 'ununifi-client/esm/openapi';

export interface unitInfo {
  id: string;
  txMemo: string;
  recipients: { address: string; weight: string }[];
  created_at: Date;
}

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
export class UnitComponent implements OnInit {
  unitId$: Observable<string>;
  txMemo$: Observable<string>;
  unit$: Observable<IncentiveUnit200ResponseIncentiveUnit>;

  constructor(private route: ActivatedRoute, private ununifiRest: UnunifiRestService) {
    this.unitId$ = this.route.params.pipe(map((params) => params.unit_id));
    this.txMemo$ = this.unitId$.pipe(
      map((id) => JSON.stringify({ version: 'v1', 'incentive-unit-id': id })),
    );
    this.unit$ = this.unitId$.pipe(
      mergeMap((unitId) => this.ununifiRest.getIncentiveUnit$(unitId)),
    );
  }

  ngOnInit(): void {}
}
