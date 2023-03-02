import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NftRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { StoredWallet } from 'projects/shared/src/common';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
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
  currentStoredWallet?: StoredWallet | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInner | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;
  @Input()
  bidDetail?: BidderBids200ResponseBidsInner | null;
  @Input()
  isWinning?: boolean | null;

  @Output()
  appSubmitCancelBid: EventEmitter<NftRequest>;
  @Output()
  appSubmitPayFullBid: EventEmitter<NftRequest>;

  constructor() {
    this.appSubmitCancelBid = new EventEmitter();
    this.appSubmitPayFullBid = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmitCancelBid() {
    if (!this.classID || !this.nftID) {
      return;
    }
    this.appSubmitCancelBid.emit({ classID: this.classID, nftID: this.nftID });
  }

  onSubmitPayFullBid() {
    if (!this.classID || !this.nftID) {
      return;
    }
    this.appSubmitPayFullBid.emit({ classID: this.classID, nftID: this.nftID });
  }
}
