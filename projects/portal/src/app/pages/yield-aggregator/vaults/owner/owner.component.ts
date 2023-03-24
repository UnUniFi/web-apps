import { Component, OnInit } from '@angular/core';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.application.service';
import { TransferVaultRequest } from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css'],
})
export class OwnerComponent implements OnInit {
  constructor(private readonly iyaApp: YieldAggregatorApplicationService) {}

  ngOnInit(): void {}

  onDelete(data: string) {
    this.iyaApp.deleteVault(data);
  }

  onTransfer(data: TransferVaultRequest) {
    this.iyaApp.transferVaultOwnership(data.vaultId, data.recipientAddress);
  }
}
