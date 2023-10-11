import { TokenAmountUSD } from '../../../models/band-protocols/band-protocol.service';
import { YieldInfo } from '../../../models/config.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  vaults?: VaultAll200ResponseVaultsInner[] | null;
  @Input()
  symbols?: { symbol: string; display: string; img: string }[] | null;
  @Input()
  vaultsInfo?: YieldInfo[] | null;
  @Input()
  totalDeposited?: TokenAmountUSD[] | null;
  @Input()
  keyword?: string | null;
  @Input()
  sortType?: string | null;
  // @Input()
  // sortTypes?: { value: string; display: string }[];
  @Input()
  certified?: boolean | null;
  @Output()
  search = new EventEmitter<string>();
  @Output()
  sort = new EventEmitter<string>();
  @Output()
  certifiedChange = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSearch() {
    this.search.emit(this.keyword || '');
  }

  onSort(sortType: string) {
    this.sort.emit(sortType);
  }

  onCertifiedChange() {
    if (this.certified === undefined || this.certified === null) {
      return;
    }
    this.certifiedChange.emit(this.certified);
  }
}
