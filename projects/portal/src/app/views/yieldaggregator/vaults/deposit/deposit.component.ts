import { Component, Input, OnInit } from '@angular/core';
import { TokenAmountUSD } from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { VaultBalance } from 'projects/portal/src/app/pages/yieldaggregator/vaults/deposit/deposit.component';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
  @Input() address?: string | null;
  @Input() owner?: string | null;
  @Input() vaultBalances?: VaultBalance[] | null;
  @Input() vaults?: VaultAll200ResponseVaultsInner[] | null;
  @Input() symbols?: { symbol: string; display: string; img: string }[] | null;
  @Input() usdDepositAmount?: TokenAmountUSD[] | null;
  @Input() usdTotalAmount?: number | null;

  constructor() {}

  ngOnInit(): void {}
}
