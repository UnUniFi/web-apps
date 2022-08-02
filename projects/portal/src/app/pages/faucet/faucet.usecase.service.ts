import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Config, ConfigService } from '../../models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FaucetUseCaseService {
  constructor(
    private readonly route: ActivatedRoute,
    private configService: ConfigService,
  ) { }

  get config$(): Observable<Config | undefined> {
    return this.configService.config$;
  }
  get denoms$(): Observable<string[] | undefined> {
    return this.config$.pipe(
      map((config) => config?.extension?.faucet?.map((faucet) => faucet.denom)),
    );
  }
  get address$(): Observable<string | undefined> {
    return this.route.queryParams.pipe(map((queryParams) => queryParams?.address ? queryParams.address : undefined));
  }
  get amount$(): Observable<number | undefined> {
    return this.route.queryParams.pipe(map((queryParams) => queryParams?.amount ? queryParams.amount : undefined));
  }
  get denom$(): Observable<string> {
    return this.route.queryParams.pipe(map((queryParams) => queryParams?.denom ? queryParams.denom : undefined));
  }
  get creditAmount$(): Observable<number> {
    return combineLatest([this.config$, this.denom$]).pipe(
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
    return combineLatest([this.config$, this.denom$]).pipe(
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
