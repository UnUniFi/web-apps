import { Component, OnInit } from '@angular/core';
import { Nft } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { NftService } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  nfts$: Observable<Nft[]>;

  constructor(private readonly nftService: NftService) {
    this.nfts$ = this.nftService.getAllNfts$();
  }

  ngOnInit(): void {}
}
