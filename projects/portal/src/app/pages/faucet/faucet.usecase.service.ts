import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Config, ConfigService } from 'projects/portal/src/app/models/config.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FaucetUseCaseService {

  //private config$: Observable<Config | undefined>;

  constructor(
    private readonly route: ActivatedRoute,
    private configService: ConfigService,
  ) {
    //this.config$ = this.configService.config$;
    //this.denom$ = new BehaviorSubject('');
  }

  get config$(): Observable<Config | undefined> {
    return this.configService.config$;
  }


  get denoms$(): Observable<string[] | undefined> {
    return this.config$.pipe(
      map((config) => config?.extension?.faucet?.map((faucet) => faucet.denom)),
    );
  }

  get address$(): Observable<string> {
    return this.route.queryParams.pipe(map((queryParams) => queryParams.address));
  }

  get amount$(): Observable<number> {
    return this.route.queryParams.pipe(map((queryParams) => queryParams.amount));
  }

  get denom$(): BehaviorSubject<string> {
    this.route.queryParams
      .pipe(first())
      .toPromise()
      .then((params) => this.denom$?.next(params.denom));
    return this.denom$
  }

  get creditAmount$(): Observable<number> {
    return combineLatest([this.config$, this.denom$?.asObservable()]).pipe(
      map(([config, denom]) => {
        const faucet = config?.extension?.faucet
          ? config.extension.faucet.find((faucet) => faucet.denom === denom)
          : undefined;
        const creditAmount = faucet ? faucet.creditAmount : 0;
        return creditAmount;
      }),
    );
  }

  get maxCredit$(): Observable<number> {
    return combineLatest([this.config$, this.denom$.asObservable()]).pipe(
      map(([config, denom]) => {
        const faucet = config?.extension?.faucet
          ? config.extension.faucet.find((faucet) => faucet.denom === denom)
          : undefined;
        const maxCredit = faucet ? faucet.maxCredit : 0;
        return maxCredit;
      }),
    );
  }
}
