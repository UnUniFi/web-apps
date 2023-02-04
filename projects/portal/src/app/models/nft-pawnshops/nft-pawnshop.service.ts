import { CosmosSDKService } from '../cosmos-sdk.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { KeyService } from '../keys/key.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly txCommonService: TxCommonService,
    private http: HttpClient,
  ) {}

  replaceIpfs(url: string): string {
    return url.replace('ipfs://', 'https://ununifi.mypinata.cloud/ipfs/');
  }

  async getMetadataFromUri(uri: string): Promise<Metadata> {
    const metadata = await this.http.get(uri).toPromise();
    return metadata;
  }

  async getImageFromUri(uri: string): Promise<string> {
    const replacedUri = this.replaceIpfs(uri);
    const metadata = await this.getMetadataFromUri(replacedUri);
    if (!metadata.image) {
      return '';
    }
    return this.replaceIpfs(metadata.image);
  }
}
