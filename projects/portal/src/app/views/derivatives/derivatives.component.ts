import { Component, Input, OnInit } from '@angular/core';

export interface TokenInfo {
  name: string;
  symbol: string;
  iconUrl: string;
  price: string;
  pool: string;
  weight: string;
}

@Component({
  selector: 'view-derivatives',
  templateUrl: './derivatives.component.html',
  styleUrls: ['./derivatives.component.css'],
})
export class DerivativesComponent implements OnInit {
  @Input()
  tokenInfos?: TokenInfo[] | null;

  constructor() {}

  ngOnInit(): void {}
}
