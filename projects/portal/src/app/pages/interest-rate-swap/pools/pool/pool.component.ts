import { Component, OnInit } from '@angular/core';
import { SwapRequest } from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.model';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onMintLP(data: SwapRequest) {}
  onRedeemLP(data: SwapRequest) {}
}
