import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NftRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  BidderBids200ResponseBidsInner,
  ListedNft200ResponseListing,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-bidder-nft',
  templateUrl: './bidder-nft.component.html',
  styleUrls: ['./bidder-nft.component.css'],
})
export class BidderNftComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  listingInfo?: ListedNft200ResponseListing | null;
  @Input()
  bids?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;
  @Input()
  ownBid?: BidderBids200ResponseBidsInner | null;
  @Input()
  isWinning?: boolean | null;

  @Output()
  appSubmitCancelBid: EventEmitter<NftRequest>;
  @Output()
  appSubmitPayRemainder: EventEmitter<NftRequest>;

  constructor() {
    this.appSubmitCancelBid = new EventEmitter();
    this.appSubmitPayRemainder = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmitCancelBid() {
    if (!this.classID || !this.nftID) {
      return;
    }
    this.appSubmitCancelBid.emit({ classID: this.classID, nftID: this.nftID });
  }

  onSubmitPayRemainder() {
    if (!this.classID || !this.nftID) {
      return;
    }
    this.appSubmitPayRemainder.emit({ classID: this.classID, nftID: this.nftID });
  }
}
