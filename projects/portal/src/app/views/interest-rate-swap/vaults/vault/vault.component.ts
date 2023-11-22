import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  description = 'This Vault provides the fixed yield of stATOM.';
  yield: 'long' | 'variable' | 'fixed' = 'fixed';
  tab: 'deposit' | 'withdraw' = 'deposit';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-vaults', '1']);
  }
}
