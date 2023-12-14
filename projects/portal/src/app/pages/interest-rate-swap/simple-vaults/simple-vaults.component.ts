import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-vaults',
  templateUrl: './simple-vaults.component.html',
  styleUrls: ['./simple-vaults.component.css'],
})
export class SimpleVaultsComponent implements OnInit {
  vaults$ = this.irsQuery.listVaults$();
  tranchePools$ = this.irsQuery.listAllTranches$();

  constructor(private readonly irsQuery: IrsQueryService) {}

  ngOnInit(): void {}
}
