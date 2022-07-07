import { UnunifiRestService } from '../../models/ununifi-rest.service';
import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import ununifi from 'ununifi-client';

@Component({
  selector: 'app-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  cdpParams$: Observable<ununifi.proto.ununifi.cdp.IParams>;
  collateralParams$: Observable<ununifi.proto.ununifi.cdp.ICollateralParam[] | null | undefined>;
  debtParams$: Observable<ununifi.proto.ununifi.cdp.IDebtParam[] | null | undefined>;

  constructor(private ununifiRest: UnunifiRestService) {
    const timer$ = timer(0, 60 * 1000);
    this.cdpParams$ = timer$.pipe(mergeMap(() => this.ununifiRest.getCdpParams$()));
    this.collateralParams$ = this.cdpParams$.pipe(map((cdpParams) => cdpParams?.collateral_params));
    this.debtParams$ = this.cdpParams$.pipe(map((cdpParams) => cdpParams?.debt_params));
  }

  ngOnInit(): void {}
}
