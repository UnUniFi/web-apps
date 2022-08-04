import { Injectable } from '@angular/core';
import { Config, ConfigService } from '../../models/config.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FaucetUseCaseService {
  private config$: Observable<Config | undefined>

  constructor(
    private configService: ConfigService) {
    this.config$ = this.configService.config$
  }
  get denoms$(): Observable<string[] | undefined> {
    return this.config$.pipe(
      map((config) => config?.extension?.faucet?.map((faucet) => faucet.denom)),
    );
  }
  faucetURL$(denom$: Observable<string | undefined>): Observable<string | undefined> {
    return combineLatest([this.config$, denom$]).pipe(
      map(([config, denom]) => {
        return config?.extension?.faucet?.find(
          (faucet) => faucet.denom == denom,
        )?.faucetURL;
      }),
    );
  }
  creditAmount$(denom$: Observable<string | undefined>): Observable<number> {
    return combineLatest([this.config$, denom$]).pipe(
      map(([config, denom]) => {
        const faucet = config?.extension?.faucet
          ? config.extension.faucet.find((faucet) => faucet.denom === denom)
          : undefined;
        const creditAmount = faucet ? faucet.creditAmount : 0;
        return creditAmount;
      }),
    );
  }
  maxCredit$(denom$: Observable<string | undefined>): Observable<number> {
    return combineLatest([this.config$, denom$]).pipe(
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
