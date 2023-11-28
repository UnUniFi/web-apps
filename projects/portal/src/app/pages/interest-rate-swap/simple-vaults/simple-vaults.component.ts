import { SwapRequest } from '../../../models/interest-rate-swap/interest-rate-swap.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-vaults',
  templateUrl: './simple-vaults.component.html',
  styleUrls: ['./simple-vaults.component.css'],
})
export class SimpleVaultsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onMintPT(data: SwapRequest) {}
}
