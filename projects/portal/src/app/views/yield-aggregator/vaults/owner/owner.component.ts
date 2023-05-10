import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TransferVaultRequest } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.model';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css'],
})
export class OwnerComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  owner?: string | null;
  @Input()
  vaults?: VaultAll200ResponseVaultsInner[] | null;
  @Output()
  appDelete: EventEmitter<string>;
  @Output()
  appTransfer: EventEmitter<TransferVaultRequest>;
  recipientAddress?: string;

  constructor() {
    this.appDelete = new EventEmitter();
    this.appTransfer = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmitTransfer(vaultId?: string) {
    if (!this.recipientAddress || !vaultId) {
      return;
    }
    this.appTransfer.emit({ vaultId, recipientAddress: this.recipientAddress });
  }

  onSubmitDelete(vaultId?: string) {
    if (!vaultId) {
      return;
    }
    this.appDelete.emit(vaultId);
  }
}
