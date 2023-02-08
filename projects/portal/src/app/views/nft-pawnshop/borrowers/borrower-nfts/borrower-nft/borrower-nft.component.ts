import { Component, Input, OnInit } from '@angular/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  ListedNfts200ResponseListingsInner,
  BidderBids200ResponseBidsInner,
  Loans200ResponseLoansInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-borrower-nft',
  templateUrl: './borrower-nft.component.html',
  styleUrls: ['./borrower-nft.component.css'],
})
export class BorrowerNftComponent implements OnInit {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInner | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  loans?: Loans200ResponseLoansInner[] | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;

  constructor() {}

  ngOnInit(): void {}
}
