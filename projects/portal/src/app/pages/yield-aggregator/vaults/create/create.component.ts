import { Component, OnInit } from '@angular/core';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.application.service';
import { CreateVaultRequest } from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  constructor(private readonly iyaApp: YieldAggregatorApplicationService) {}

  ngOnInit(): void {}

  onCreate(data: CreateVaultRequest) {
    this.iyaApp.createVault(
      data.name,
      data.symbol,
      data.strategies,
      data.commissionRate,
      data.feeAmount,
      data.depositAmount,
    );
  }
}
