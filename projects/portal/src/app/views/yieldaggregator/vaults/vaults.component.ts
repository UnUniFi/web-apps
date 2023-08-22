import { TokenAmountUSD } from '../../../models/band-protocols/band-protocol.service';
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
  apy?: (number | null)[] | null;
  @Input()
  totalDeposited?: TokenAmountUSD[] | null;
  @Input()
  keyword?: string | null;
  @Output()
  search = new EventEmitter<string>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(path: string) {
    this.router.navigate(['path']);
  }

  onSubmit() {
    this.search.emit(this.keyword || '');
  }
}
