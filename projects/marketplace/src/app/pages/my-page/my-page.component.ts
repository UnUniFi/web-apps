import { Component, OnInit } from '@angular/core';
import { NFTService } from 'projects/shared/src/lib/models/cosmos/nfts/nft.service';
import { Observable } from 'rxjs';
import { NFT } from 'shared/lib/models/cosmos/nfts/nft.model';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css'],
})
export class MyPageComponent implements OnInit {
  nfts$: Observable<NFT[]>;

  constructor(private readonly nftService: NFTService) {
    this.nfts$ = this.nftService.getAllNFTs$();
  }

  ngOnInit(): void {}
}
