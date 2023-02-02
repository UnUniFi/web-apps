import { Component, Input, OnInit } from '@angular/core';
import {
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
  NftmarketParams200ResponseParams,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-nft-pawnshop',
  templateUrl: './nft-pawnshop.component.html',
  styleUrls: ['./nft-pawnshop.component.css'],
})
export class NftPawnshopComponent implements OnInit {
  @Input()
  params?: NftmarketParams200ResponseParams | null;
  @Input()
  listedClasses?: ListedClass200Response[] | null;
  @Input()
  listedNfts?: ListedNfts200ResponseListingsInner[] | null;

  constructor() {}

  ngOnInit(): void {}
}
