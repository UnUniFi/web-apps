import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'view-simple-pool',
  templateUrl: './simple-pool.component.html',
  styleUrls: ['./simple-pool.component.css'],
})
export class SimplePoolComponent implements OnInit {
  tab: 'deposit' | 'withdraw' = 'deposit';
  selectedMaturity?: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'pools', '1']);
  }
}
