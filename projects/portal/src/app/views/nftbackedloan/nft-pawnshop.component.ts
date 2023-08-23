import { Nfts } from '../../models/nft-pawnshops/nft-pawnshop.model';
import { Component, Input, OnInit } from '@angular/core';
import {
  ListedClasses200ResponseClassesInner,
  ListedNfts200ResponseListingsInner,
  NftBackedLoanParams200ResponseParams,
  NftBids200ResponseBidsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-nft-pawnshop',
  templateUrl: './nft-pawnshop.component.html',
  styleUrls: ['./nft-pawnshop.component.css'],
})
export class NftPawnshopComponent implements OnInit {
  @Input()
  params?: NftBackedLoanParams200ResponseParams | null;
  @Input()
  listedClasses?: ListedClasses200ResponseClassesInner[] | null;
  @Input()
  listedNfts?: ListedNfts200ResponseListingsInner[] | null;
  @Input()
  ownNfts?: Nfts | null;
  @Input()
  listedOwnNfts?: ListedNfts200ResponseListingsInner[] | null;
  @Input()
  allBids?: NftBids200ResponseBidsInner[] | null;
  @Input()
  averageInterestRate?: number | null;

  constructor() {}

  ngOnInit(): void {}
}
