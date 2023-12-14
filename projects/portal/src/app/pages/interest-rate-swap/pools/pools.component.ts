import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.css'],
})
export class PoolsComponent implements OnInit {
  tranchePools$ = this.irsQuery.listAllTranches$();

  constructor(private readonly irsQuery: IrsQueryService) {}

  ngOnInit(): void {}
}
