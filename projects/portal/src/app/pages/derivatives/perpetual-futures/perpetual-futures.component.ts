import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { params } from 'ununifi-client/cjs/rest/auction/module';

@Component({
  selector: 'app-perpetual-futures',
  templateUrl: './perpetual-futures.component.html',
  styleUrls: ['./perpetual-futures.component.css'],
})
export class PerpetualFuturesComponent implements OnInit {
  info$ = this.derivativesQuery.getWholePerpetualFutures$();
  params$ = this.derivativesQuery
    .getDerivativesParams$()
    .pipe(map((params) => params.perpetual_futures));

  denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();

  constructor(
    private readonly router: Router,
    private readonly bankQuery: BankQueryService,
    private readonly derivativesQuery: DerivativesQueryService,
  ) {}

  ngOnInit(): void {}

  onChangeMarket(market: string) {
    this.router.navigate(['/derivatives/perpetual-futures', market]);
  }
}
