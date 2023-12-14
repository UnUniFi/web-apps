import { Component, OnInit } from '@angular/core';
import { IrsQueryService } from '../../../models/irs/irs.query.service';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css']
})
export class VaultsComponent implements OnInit {
  vaults$ = this.irsQuery.listVaults$();
  tranchePools$ = this.irsQuery.listAllTranches$();

  constructor(private readonly irsQuery: IrsQueryService) { }

  ngOnInit(): void {
  }

}
