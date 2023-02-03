import { CosmosSDKService } from '../cosmos-sdk.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { KeyService } from '../keys/key.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly txCommonService: TxCommonService,
  ) {}
}
