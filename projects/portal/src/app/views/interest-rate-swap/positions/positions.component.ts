import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'view-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  @Input()
  totalPositionValue?: number | null;
  @Input()
  maturedPtValue?: number | null;

  sortType?: string;
  positionTab?: 'fixed' | 'liquidity' = 'fixed';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'vaults']);
  }
}
