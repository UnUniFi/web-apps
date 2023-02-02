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

  constructor(private derivativesQuery: DerivativesQueryService) {}

  ngOnInit(): void {}

  onMintLPT($event: MintLPTEvent) {}

  onBurnLPT($event: BurnLPTEvent) {}
}
