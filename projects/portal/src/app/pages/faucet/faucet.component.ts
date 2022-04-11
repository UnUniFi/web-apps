import { FaucetApplicationService } from '../../models/faucets/faucet.application.service';
import { FaucetOnSubmitEvent } from '../../views/faucet/faucet.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Config, ConfigService } from 'projects/portal/src/app/models/config.service';
import { FaucetRequest } from 'projects/portal/src/app/models/faucets/faucet.model';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-faucet',
  templateUrl: './faucet.component.html',
  styleUrls: ['./faucet.component.css'],
})
export class FaucetComponent implements OnInit {
  config$: Observable<Config | undefined>;
  denoms$: Observable<string[] | undefined>;
  address$: Observable<string>;
  denom$: BehaviorSubject<string>;
  amount$: Observable<number>;
  creditAmount$: Observable<number>;
  maxCredit$: Observable<number>;

  constructor(
    private readonly route: ActivatedRoute,
    private configS: ConfigService,
    private faucetApplication: FaucetApplicationService,
  ) {
    this.config$ = this.configS.config$;
    this.denoms$ = this.config$.pipe(
      map((config) => config?.extension?.faucet?.map((faucet) => faucet.denom)),
    );

    this.address$ = this.route.queryParams.pipe(map((queryParams) => queryParams.address));
    this.amount$ = this.route.queryParams.pipe(map((queryParams) => queryParams.amount));
    this.denom$ = new BehaviorSubject('');
    this.route.queryParams
      .pipe(first())
      .toPromise()
      .then((params) => this.denom$?.next(params.denom));
    this.creditAmount$ = combineLatest([this.config$, this.denom$?.asObservable()]).pipe(
      map(([config, denom]) => {
        const faucet = config?.extension?.faucet
          ? config.extension.faucet.find((faucet) => faucet.denom === denom)
          : undefined;
        const creditAmount = faucet ? faucet.creditAmount : 0;
        return creditAmount;
      }),
    );
    this.maxCredit$ = combineLatest([this.config$, this.denom$.asObservable()]).pipe(
      map(([config, denom]) => {
        const faucet = config?.extension?.faucet
          ? config.extension.faucet.find((faucet) => faucet.denom === denom)
          : undefined;
        const maxCredit = faucet ? faucet.maxCredit : 0;
        return maxCredit;
      }),
    );
  }

  ngOnInit(): void {}

  appPostFaucetRequested($event: FaucetOnSubmitEvent): void {
    const faucetURL = $event.url;
    const faucetRequest: FaucetRequest = {
      address: $event.address,
      coins: [
        {
          amount: $event.amount,
          denom: $event.denom,
        },
      ],
    };
    this.faucetApplication.postFaucetRequest(faucetRequest, faucetURL);
  }

  appSelectedDenomChange(selectedDenom: string): void {
    this.denom$?.next(selectedDenom);
  }
}
