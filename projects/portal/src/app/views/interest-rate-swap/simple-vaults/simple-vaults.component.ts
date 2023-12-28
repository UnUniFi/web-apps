import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'view-simple-vaults',
  templateUrl: './simple-vaults.component.html',
  styleUrls: ['./simple-vaults.component.css'],
})
export class SimpleVaultsComponent implements OnInit {
  sortType?: string;
  viewMode?: 'table' | 'grid' = 'grid';
  positionTab?: 'fixed' | 'liquidity' = 'fixed';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'vaults']);
  }
}
