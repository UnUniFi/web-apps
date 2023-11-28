import { Component, OnInit } from '@angular/core';
import { InterestRateSwapApplicationService } from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.application.service';
import {
  RedeemUnderlyingRequest,
  SwapRequest,
} from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.model';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  constructor(private readonly irsAppService: InterestRateSwapApplicationService) {}

  ngOnInit(): void {}

  onMintYT(data: SwapRequest) {
    this.irsAppService.mintYT(data);
  }
  onRedeemYT(data: SwapRequest) {
    this.irsAppService.redeemYT(data);
  }
  onMintPT(data: SwapRequest) {
    this.irsAppService.mintPT(data);
  }
  onRedeemPT(data: SwapRequest) {
    this.irsAppService.redeemPT(data);
  }
  onMintPTYT(data: SwapRequest) {
    this.irsAppService.mintPTYT(data);
  }
  onRedeemPTYT(data: RedeemUnderlyingRequest) {
    this.irsAppService.redeemPTYT(data);
  }
}
