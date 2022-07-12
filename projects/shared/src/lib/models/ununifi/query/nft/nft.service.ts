import { NftInfrastructureService } from './nft.infrastructure.service';
import { NftClass, Nft } from './nft.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface INftInfrastructureService {
  getAllNftClasses$: () => Observable<NftClass[]>;
  getAllNftClassesByAddress$: (address: string) => Observable<NftClass[]>;
  getNftClassByNftClassId$: (nftClassID: string) => Observable<NftClass | undefined>;
  getAllNfts$: () => Observable<Nft[]>;
  getAllNftsByAddress$: (address: string) => Observable<Nft[]>;
  getNftByNftClassIDAndNftId$: (nftClassID: string, nftID: string) => Observable<Nft | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class NftService {
  private readonly iNftInfrastructureService: INftInfrastructureService;

  constructor(private nftInfrastructureService: NftInfrastructureService) {
    this.iNftInfrastructureService = this.nftInfrastructureService;
  }

  getAllNftClasses$(): Observable<NftClass[]> {
    return this.iNftInfrastructureService.getAllNftClasses$();
  }

  getAllNftClassesByAddress$(address: string): Observable<NftClass[]> {
    return this.iNftInfrastructureService.getAllNftClassesByAddress$(address);
  }

  getNftClassByNFTClassID$(nftClassId: string): Observable<NftClass | undefined> {
    return this.iNftInfrastructureService.getNftClassByNftClassId$(nftClassId);
  }

  getAllNfts$(): Observable<Nft[]> {
    return this.iNftInfrastructureService.getAllNfts$();
  }

  getAllNftsByAddress$(address: string): Observable<Nft[]> {
    return this.iNftInfrastructureService.getAllNftsByAddress$(address);
  }

  getNFTByNftClassIDAndNFTID$(nftClassId: string, nftId: string): Observable<Nft | undefined> {
    return this.iNftInfrastructureService.getNftByNftClassIDAndNftId$(nftClassId, nftId);
  }
}
