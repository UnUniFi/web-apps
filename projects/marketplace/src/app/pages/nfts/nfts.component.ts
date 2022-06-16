import { Component, OnInit } from '@angular/core';
import { NFT } from 'projects/shared/src/lib/models/cosmos/nfts/nft.model';
import { NFTService } from 'projects/shared/src/lib/models/cosmos/nfts/nft.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css'],
})
export class NftsComponent implements OnInit {
  nfts$: Observable<NFT[]>;

  constructor(private readonly nftService: NFTService) {
    this.nfts$ = this.nftService.getAllNFTs$();
  }

  ngOnInit(): void {
    this.nfts$.subscribe((nfts) => console.log(nfts));
  }
}
