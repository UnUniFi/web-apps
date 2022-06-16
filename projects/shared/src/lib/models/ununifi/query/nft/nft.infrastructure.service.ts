import { NFTS, NFT_CLASSES } from './nft';
import { NftClass, Nft } from './nft.model';
import { INftInfrastructureService } from './nft.service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// Todo: Currently, all data is dummy. Dummy data is fetched from OpenSea testnets api. Of course we need to implement all.

// Note: https://testnets-api.opensea.io/api/v1/assets
type OpenSeaAssetsResponse = {
  next: string;
  previous: string | null;
  assets: OpenSeaAssets;
};

type OpenSeaAssets = OpenSeaAsset[];

// Note: https://testnets-api.opensea.io/api/v1/assets
type OpenSeaAsset = {
  background_color: string | null;
  image_url: string | null;
  animation_url: string | null;
  name: string | null;
  description: string | null;
  external_link: string | null;
  asset_contract: {
    address: string | null;
    name: string | null;
    symbol: string | null;
    description: string | null;
    external_link: string | null;
    image_url: string | null;
  };
  collection: {
    banner_image_url: string | null;
    description: string | null;
    external_url: string | null;
    image_url: string | null;
    name: string | null;
  };
  token_metadata: string | null;
  traits: any[] | null;
  token_id: string;
};

@Injectable({
  providedIn: 'root',
})
export class NftInfrastructureService implements INftInfrastructureService {
  constructor(private http: HttpClient) {}

  // Todo: This is for dummy data only. We need to remove this after implementation.
  private convertOpenSeaAssetToNFTClass(openSeaAsset: OpenSeaAsset): NftClass {
    const nftClass: NftClass = {
      id: openSeaAsset.asset_contract.address ?? '',
      name: openSeaAsset.asset_contract.name ?? '',
      symbol: openSeaAsset.asset_contract.symbol ?? '',
      description: openSeaAsset.asset_contract.description ?? '',
      uri: openSeaAsset.token_metadata ?? '',
      uri_hash: '',
      data: {
        name: openSeaAsset.asset_contract.name ?? '',
        description: openSeaAsset.asset_contract.description ?? '',
        image: openSeaAsset.asset_contract.image_url ?? '',
        image_data: openSeaAsset.asset_contract.image_url ?? '',
        external_url: openSeaAsset.asset_contract.external_link ?? '',
        animation_url: openSeaAsset.animation_url ?? '',
        youtube_url: '',
        background_color: '',
        attributes: [],
      },
    };
    return nftClass;
  }

  // Todo: This is for dummy data only. We need to remove this after implementation.
  private convertOpenSeaAssetToNFT(openSeaAsset: OpenSeaAsset): Nft {
    const nftClass: NftClass = this.convertOpenSeaAssetToNFTClass(openSeaAsset);
    const nft: Nft = {
      nft_class: nftClass,
      id: openSeaAsset.token_id ?? '',
      uri: openSeaAsset.token_metadata ?? '',
      uri_hash: '',
      data: {
        name: openSeaAsset.name ?? '',
        description: openSeaAsset.description ?? '',
        image: openSeaAsset.image_url ?? '',
        image_data: openSeaAsset.image_url ?? '',
        external_url: openSeaAsset.external_link ?? '',
        animation_url: openSeaAsset.animation_url ?? '',
        youtube_url: '',
        background_color: openSeaAsset.background_color ?? '',
        attributes: [],
      },
    };
    return nft;
  }

  // Todo: This is for dummy data only. We need to remove this after implementation.
  private getRandomElementFromArray<T>(array: T[]): T | undefined {
    if (!array?.length) {
      return undefined;
    }
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  getAllNftClasses$(): Observable<NftClass[]> {
    // Note: 1stly, I tried these implementation, but it seems that test data is so random.
    // const params = new HttpParams().set('format', 'json');
    // return this.http
    //   .get<OpenSeaAssetsResponse>('https://testnets-api.opensea.io/api/v1/assets', { params })
    //   .pipe(
    //     map((res) => {
    //       const myAllNFTClasses: NFTClass[] = res.assets.map((asset) => {
    //         const nftClass: NFTClass = this.convertOpenSeaAssetToNFTClass(asset);
    //         return nftClass;
    //       });
    //       return myAllNFTClasses;
    //     }),
    //     map((nftClasses) => nftClasses.filter((nftClass) => nftClass.data?.image)),
    //   );
    return of(NFT_CLASSES);
  }

  getAllNftClassesByAddress$(address: string): Observable<NftClass[]> {
    return this.getAllNftClasses$();
  }

  getNftClassByNftClassId$(nftClassId: string): Observable<NftClass | undefined> {
    return this.getAllNftClasses$().pipe(
      map((nftClasses) => this.getRandomElementFromArray(nftClasses)),
    );
  }

  getAllNfts$(): Observable<Nft[]> {
    // Note: 1stly, I tried these implementation, but it seems that test data is so random.
    // const params = new HttpParams().set('format', 'json');
    // return this.http
    //   .get<OpenSeaAssetsResponse>('https://testnets-api.opensea.io/api/v1/assets', { params })
    //   .pipe(
    //     map((res) => {
    //       const myAllNFTs: NFT[] = res.assets.map((asset) => {
    //         const nft: NFT = this.convertOpenSeaAssetToNFT(asset);
    //         return nft;
    //       });
    //       return myAllNFTs;
    //     }),
    //     map((nfts) => nfts.filter((nft) => nft.data?.image)),
    //   );
    return of(NFTS);
  }

  getAllNftsByAddress$(address: string): Observable<Nft[]> {
    return this.getAllNfts$();
  }

  getNftByNftClassIDAndNftId$(nftClassId: string, nftId: string): Observable<Nft | undefined> {
    return this.getAllNfts$().pipe(map((nfts) => this.getRandomElementFromArray(nfts)));
  }
}
