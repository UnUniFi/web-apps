import { FaucetApplicationService } from '../../models/faucets/faucet.application.service';
import { FaucetRequest } from '../../models/faucets/faucet.model';
import { Injectable } from '@angular/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FaucetUsecaseService {
  constructor(
    private configS: ConfigService,
    private faucetApplication: FaucetApplicationService,
  ) {}

  private _config$ = this.configS.config$;
  private _denom$ = new BehaviorSubject('');

  get denoms$(): Observable<string[] | undefined> {
    return this._config$.pipe(
      map((config) => config?.extension?.faucet?.map((faucet) => faucet.denom)),
    );
  }

  get faucetURL$(): Observable<string | undefined> {
    return this._config$.pipe(
      map(
        (config) =>
          config?.extension?.faucet?.find((faucet) => faucet.denom === this._denom$.value)
            ?.faucetURL,
      ),
    );
  }

  denom$(denom: string) {
    this._denom$.next(denom);
    return this._denom$.asObservable();
  }

  changeDenom(denom: string): void {
    this._denom$.next(denom);
  }

  creditAmount$(denom$: Observable<string>): Observable<number> {
    return combineLatest([this._config$, denom$]).pipe(
      map(([config, denom]) => {
        const faucet = config?.extension?.faucet
          ? config.extension.faucet.find((faucet) => faucet.denom === denom)
          : undefined;
        const creditAmount = faucet ? faucet.creditAmount : 0;
        return creditAmount;
      }),
    );
  }

  maxCredit$(denom$: Observable<string>): Observable<number> {
    return combineLatest([this._config$, denom$]).pipe(
      map(([config, denom]) => {
        const faucet = config?.extension?.faucet
          ? config.extension.faucet.find((faucet) => faucet.denom === denom)
          : undefined;
        const maxCredit = faucet ? faucet.maxCredit : 0;
        return maxCredit;
      }),
    );
  }

  postFaucetRequest(faucetRequest: FaucetRequest, faucetURL: string) {
    this.faucetApplication.postFaucetRequest(faucetRequest, faucetURL);
  }
}
