import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorQueryService {
  restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));

  constructor(private readonly cosmosSDK: CosmosSDKService) {}

  getParams$() {
    return of({} as any);
  }

  getUserInfo$(address: string) {
    return of({} as any);
  }

  getDailyReward$() {
    return of({} as any);
  }
}
