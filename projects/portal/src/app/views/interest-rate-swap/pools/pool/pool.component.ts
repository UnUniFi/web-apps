import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  description = 'This Vault provides the fixed yield of stATOM.';
  tab: 'deposit' | 'withdraw' = 'deposit';

  constructor() {}

  ngOnInit(): void {}
}
