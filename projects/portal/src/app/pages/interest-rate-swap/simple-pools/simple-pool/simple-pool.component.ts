import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AllTranches200ResponseTranchesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-simple-pool',
  templateUrl: './simple-pool.component.html',
  styleUrls: ['./simple-pool.component.css'],
})
export class SimplePoolComponent implements OnInit {
  poolId$: Observable<string>;
  tranchePool$: Observable<AllTranches200ResponseTranchesInner>;

  constructor(private route: ActivatedRoute, private readonly irsQuery: IrsQueryService) {
    this.poolId$ = this.route.params.pipe(map((params) => params.id));
    this.tranchePool$ = this.poolId$.pipe(mergeMap((id) => this.irsQuery.getTranche$(id)));
  }

  ngOnInit(): void {}
}
