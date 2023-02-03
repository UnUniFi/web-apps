import { PawnshopQueryService } from '../../models/nft-pawnshops/nft-pawnshop.query.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
  NftmarketParams200ResponseParams,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-nft-pawnshop',
  templateUrl: './nft-pawnshop.component.html',
  styleUrls: ['./nft-pawnshop.component.css'],
})
export class NftPawnshopComponent implements OnInit {
  params$: Observable<NftmarketParams200ResponseParams>;
  listedClasses$: Observable<ListedClass200Response[]>;
  listedNfts$: Observable<ListedNfts200ResponseListingsInner[]>;

  constructor(private readonly pawnshopQuery: PawnshopQueryService) {
    this.params$ = this.pawnshopQuery.getNftmarketParam();
    this.listedClasses$ = this.pawnshopQuery.listListedClasses();
    this.listedNfts$ = this.pawnshopQuery.listListedNfts();
  }

  ngOnInit(): void {}
}
