import { DerivativesQueryService } from '../../models/derivatives/derivatives.query.service';
import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  DerivativesParams200ResponseParams,
  PerpetualFutures200Response,
  Pool200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-derivatives',
  templateUrl: './derivatives.component.html',
  styleUrls: ['./derivatives.component.css'],
})
export class DerivativesComponent implements OnInit {
  derivativesParams$: Observable<DerivativesParams200ResponseParams>;
  pool$: Observable<Pool200Response>;
  perpetualFuturesParams$: Observable<PerpetualFutures200Response>;

  constructor(private derivativesQuery: DerivativesQueryService) {
    const timer$ = timer(0, 1000 * 60);
    this.derivativesParams$ = timer$.pipe(
      mergeMap((_) => this.derivativesQuery.getDerivativesParams$()),
    );
    this.pool$ = timer$.pipe(mergeMap((_) => this.derivativesQuery.getPool$()));
    this.perpetualFuturesParams$ = timer$.pipe(
      mergeMap((_) => this.derivativesQuery.getWholePerpetualFutures$()),
    );
  }

  ngOnInit(): void {}
}
