import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class NftMintQueryService {
  restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));

  constructor(private readonly cosmosSDK: CosmosSDKService) {}

  getClasses$(address: string): Observable<string[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftfactory.classesFromCreator(sdk, address)),
      map((res) => res.data.classes!),
    );
  }

  async getClasses(address: string): Promise<string[]> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const res = await ununifi.rest.nftfactory.classesFromCreator(sdk, address);
    return res.data.classes!;
  }
}
