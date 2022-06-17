import { Component, OnInit } from '@angular/core';
import { Nft } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { NftService } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-page',
  templateUrl: './my-page.component.html',
  styleUrls: ['./my-page.component.css'],
})
export class MyPageComponent implements OnInit {
  nfts$: Observable<Nft[]>;
  menuEnabled: boolean;

  constructor(private readonly nftService: NftService) {
    this.nfts$ = this.nftService.getAllNfts$();
    this.menuEnabled = true;
  }

  ngOnInit(): void {}
}
