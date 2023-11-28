import { Component, OnInit } from '@angular/core';
import { InterestRateSwapApplicationService } from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.application.service';
import { SwapRequest } from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.model';

@Component({
  selector: 'app-simple-vault',
  templateUrl: './simple-vault.component.html',
  styleUrls: ['./simple-vault.component.css'],
})
export class SimpleVaultComponent implements OnInit {
  constructor(private readonly irsAppService: InterestRateSwapApplicationService) {}

  ngOnInit(): void {}

  onMintPT(data: SwapRequest) {
    this.irsAppService.mintPT(data);
  }
}
