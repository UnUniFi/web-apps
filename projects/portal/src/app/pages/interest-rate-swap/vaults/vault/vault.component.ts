import { Component, OnInit } from '@angular/core';
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
  constructor() {}

  ngOnInit(): void {}

  onMintYT(data: SwapRequest) {}
  onRedeemYT(data: SwapRequest) {}
  onMintPT(data: SwapRequest) {}
  onRedeemPT(data: SwapRequest) {}
  onMintPTYT(data: SwapRequest) {}
  onRedeemPTYT(data: RedeemUnderlyingRequest) {}
}
