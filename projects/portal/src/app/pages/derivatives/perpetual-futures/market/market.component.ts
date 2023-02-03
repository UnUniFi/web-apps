import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
})
export class MarketComponent implements OnInit {
  baseSymbol$ = this.route.params.pipe(map((params) => params.baseSymbol));
  quoteSymbol$ = this.route.params.pipe(map((params) => params.quoteSymbol));

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {}

  onOpenPosition() {}
}
