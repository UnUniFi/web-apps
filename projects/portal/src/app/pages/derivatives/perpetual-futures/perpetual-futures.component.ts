import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-perpetual-futures',
  templateUrl: './perpetual-futures.component.html',
  styleUrls: ['./perpetual-futures.component.css'],
})
export class PerpetualFuturesComponent implements OnInit {
  info$ = this.derivativesQuery.getWholePerpetualFutures$();

  constructor(
    private readonly router: Router,
    private readonly derivativesQuery: DerivativesQueryService,
  ) {}

  ngOnInit(): void {}

  onChangeMarket(market: string) {
    this.router.navigate(['/derivatives/perpetual-futures', market]);
  }
}
