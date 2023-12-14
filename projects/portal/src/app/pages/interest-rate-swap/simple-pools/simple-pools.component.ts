import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-pools',
  templateUrl: './simple-pools.component.html',
  styleUrls: ['./simple-pools.component.css'],
})
export class SimplePoolsComponent implements OnInit {
  tranchePools$ = this.irsQuery.listAllTranches$();

  constructor(private readonly irsQuery: IrsQueryService) {}

  ngOnInit(): void {}
}
