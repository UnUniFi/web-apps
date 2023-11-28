import { Component, OnInit } from '@angular/core';
import { InterestRateSwapApplicationService } from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.application.service';
import { SwapRequest } from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.model';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  constructor(private readonly irsAppService: InterestRateSwapApplicationService) {}

  ngOnInit(): void {}

  onMintLP(data: SwapRequest) {
    this.irsAppService.mintLP(data);
  }
  onRedeemLP(data: SwapRequest) {
    this.irsAppService.redeemLP(data);
  }
}
