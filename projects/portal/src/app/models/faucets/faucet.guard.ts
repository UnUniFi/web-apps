import { ConfigService } from '../../models/config.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FaucetGuard implements CanActivate {
  denom?: string;

  constructor(public configS: ConfigService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.denom = route.queryParams.denom ? route.queryParams.denom : undefined;
    console.log('{route,state}', { route, state });
    console.log('denom', this.denom);

    return this.configS.config$.pipe(
      map((config) => {
        if (this.denom === undefined) {
          return config?.extension?.faucet !== undefined;
        } else {
          const faucets = config?.extension?.faucet;
          if (faucets === undefined || faucets.length === undefined) {
            return false;
          } else {
            if (faucets.length === 0) {
              return false;
            } else {
              const matchedFaucet = faucets.find(
                (faucet) => this.denom === faucet.denom && faucet.hasFaucet,
              );
              if (matchedFaucet) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }),
    );
  }
}
