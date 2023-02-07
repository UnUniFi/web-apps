import { Component, Input, OnInit } from '@angular/core';
import {
  BidderBids200ResponseBidsInner,
  ListedNfts200ResponseListingsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-lender-nft',
  templateUrl: './lender-nft.component.html',
  styleUrls: ['./lender-nft.component.css'],
})
export class LenderNftComponent implements OnInit {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInner | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;

  constructor() {}

  ngOnInit(): void {}
}
