import { DerivativesApplicationService } from '../../../models/derivatives/derivatives.application.service';
import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { BurnLPTEvent, MintLPTEvent } from '../../../views/derivatives/pool/pool.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  pool$ = this.derivativesQuery.getPool$();

  constructor(
    private readonly derivativesQuery: DerivativesQueryService,
    private readonly derivativesApplication: DerivativesApplicationService,
  ) {}

  ngOnInit(): void {}

  async onMintLPT($event: MintLPTEvent) {
    await this.derivativesApplication.mintLiquidityProviderToken();
  }

  async onBurnLPT($event: BurnLPTEvent) {
    await this.derivativesApplication.burnLiquidityProviderToken();
  }
}
