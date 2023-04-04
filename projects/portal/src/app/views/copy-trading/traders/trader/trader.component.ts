import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.css'],
})
export class TraderComponent implements OnInit {
  sizeCoef: number = 100;
  leverageCoef: number = 100;
  commissionRate?: number;
  newRate?: number;

  constructor() {}

  ngOnInit(): void {}
}
