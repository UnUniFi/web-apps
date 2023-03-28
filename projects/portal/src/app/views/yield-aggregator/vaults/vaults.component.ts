import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  @Input()
  vaults?: VaultAll200ResponseVaultsInner[] | null;
  @Input()
  symbols?: string[] | null;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigate(path: string) {
    this.router.navigate(['path']);
  }
}
