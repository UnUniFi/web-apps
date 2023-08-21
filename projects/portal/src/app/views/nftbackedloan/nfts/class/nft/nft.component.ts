import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NftRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  BidderBids200ResponseBidsInner,
  Liquidation200ResponseLiquidations,
  ListedNft200ResponseListing,
  Loan200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css'],
})
export class NftComponent implements OnInit {
  @Input() address?: string | null;
  @Input() classID?: string | null;
  @Input() nftID?: string | null;
  @Input() listingInfo?: ListedNft200ResponseListing | null;
  @Input() bids?: BidderBids200ResponseBidsInner[] | null;
  @Input() ownBid?: BidderBids200ResponseBidsInner | null;
  @Input() loan?: Loan200Response | null;
  @Input() liquidation?: Liquidation200ResponseLiquidations | null;
  @Input() nftMetadata?: Metadata | null;
  @Input() nftImage?: string | null;
  @Input() isWinning?: boolean | null;

  @Output() appSubmitCancelListing = new EventEmitter<NftRequest>();
  @Output() appSubmitSell = new EventEmitter<NftRequest>();
  @Output() appSubmitCancelBid = new EventEmitter<NftRequest>();
  @Output() appSubmitPayRemainder = new EventEmitter<NftRequest>();

  constructor() {}

  ngOnInit(): void {}

  onSubmitCancelListing() {
    if (!this.classID || !this.nftID) {
      return;
    }
    this.appSubmitCancelListing.emit({ classID: this.classID, nftID: this.nftID });
  }

  onSubmitSell() {
    if (!this.classID || !this.nftID) {
      return;
    }
    this.appSubmitSell.emit({ classID: this.classID, nftID: this.nftID });
  }

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
