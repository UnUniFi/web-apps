import { NFTInfrastructureService } from './nft.infrastructure.service';
import { NFTClass, NFT } from './nft.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface INFTInfrastructureService {
  getAllNFTClasses$: () => Observable<NFTClass[]>;
  getAllNFTClassesByAddress$: (address: string) => Observable<NFTClass[]>;
  getNFTClassByNFTClassID$: (nftClassID: string) => Observable<NFTClass | undefined>;
  getAllNFTs$: () => Observable<NFT[]>;
  getAllNFTsByAddress$: (address: string) => Observable<NFT[]>;
  getNFTByNFTClassIDAndNFTID$: (nftClassID: string, nftID: string) => Observable<NFT | undefined>;
}

@Injectable({
  providedIn: 'root',
})
export class NFTService {
  private readonly iNFTInfrastructureService: INFTInfrastructureService;

  constructor(private nftInfrastructureService: NFTInfrastructureService) {
    this.iNFTInfrastructureService = this.nftInfrastructureService;
  }

  getAllNFTClasses$(): Observable<NFTClass[]> {
    return this.iNFTInfrastructureService.getAllNFTClasses$();
  }

  getAllNFTClassesByAddress$(address: string): Observable<NFTClass[]> {
    return this.iNFTInfrastructureService.getAllNFTClassesByAddress$(address);
  }

  getNFTClassByNFTClassID$(nftClassID: string): Observable<NFTClass | undefined> {
    return this.iNFTInfrastructureService.getNFTClassByNFTClassID$(nftClassID);
  }

  getAllNFTs$(): Observable<NFT[]> {
    return this.iNFTInfrastructureService.getAllNFTs$();
  }

  getAllNFTsByAddress$(address: string): Observable<NFT[]> {
    return this.iNFTInfrastructureService.getAllNFTsByAddress$(address);
  }

  getNFTByNFTClassIDAndNFTID$(nftClassID: string, nftID: string): Observable<NFT | undefined> {
    return this.iNFTInfrastructureService.getNFTByNFTClassIDAndNFTID$(nftClassID, nftID);
  }
}
