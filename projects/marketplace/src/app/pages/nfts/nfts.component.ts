import { Component, OnInit } from '@angular/core';
import { Nft } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { NftService } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nfts',
  templateUrl: './nfts.component.html',
  styleUrls: ['./nfts.component.css'],
})
export class NftsComponent implements OnInit {
  nfts$: Observable<Nft[]>;

  constructor(private readonly nftService: NftService) {
    this.nfts$ = this.nftService.getAllNfts$();
  }

  ngOnInit(): void {
    this.nfts$.subscribe((nfts) => console.log(nfts));
  }
}
