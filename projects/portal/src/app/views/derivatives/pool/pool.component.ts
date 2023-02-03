import { DerivativesApplicationService } from '../../../models/derivatives/derivatives.application.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Pool200Response } from 'ununifi-client/esm/openapi';

export type MintLPTEvent = {
  denom: string;
  amount: string;
};

export type BurnLPTEvent = {
  amount: string;
};

@Component({
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  @Input()
  pool?: Pool200Response | null;

  @Output()
  mintLPT = new EventEmitter<MintLPTEvent>();

  @Output()
  burnLPT = new EventEmitter<BurnLPTEvent>();

  constructor(private readonly derivativesApplication: DerivativesApplicationService) {}

  ngOnInit(): void {}

  onSubmitMint(denom: string, amount: string) {}

  onSubmitRedeem(amount: string) {}
}
