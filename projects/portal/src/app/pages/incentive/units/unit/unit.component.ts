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
  unit$: Observable<IncentiveUnit200ResponseIncentiveUnit>;

  constructor(private route: ActivatedRoute, private ununifiRest: UnunifiRestService) {
    this.unitId$ = this.route.params.pipe(map((params) => params.unit_id));
    this.unit$ = this.unitId$.pipe(
      mergeMap((unitId) => this.ununifiRest.getIncentiveUnit$(unitId)),
    );
    //dummy
    // this.unit$ = of({
    //   id: 'incentiveUnitId1',
    //   txMemo: `{"version":"v1","incentive-unit-id":"incentiveUnitId2"}`,
    //   recipients: [
    //     { address: 'ununifi155u042u8wk3al32h3vzxu989jj76k4zcu44v6w', weight: '0.46' },
    //     { address: 'ununifi1v0h8j7x7kfys29kj4uwdudcc9y0nx6twwxahla', weight: '0.54' },
    //   ],
    //   created_at: new Date(),
    // });
  }

  ngOnInit(): void {}
}
