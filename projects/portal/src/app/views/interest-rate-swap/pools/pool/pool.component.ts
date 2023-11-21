import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  description =
    'Similar to the fixed yield of stETH in Pendle. \n\nThree ways to deposit \n- Fixed Yield Tranche of stATOM strategy \n- Leveraged Variable Yield Tranche of stATOM strategy \n- IRS Liquidity Pool of stATOM strategy';
  tab: 'deposit' | 'withdraw' = 'deposit';

  constructor() {}

  ngOnInit(): void {}
}
