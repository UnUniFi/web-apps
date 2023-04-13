import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NftRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  ListedNfts200ResponseListingsInnerListing,
  BidderBids200ResponseBidsInner,
  Loan200Response,
  Liquidation200ResponseLiquidations,
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
  listingInfo?: ListedNfts200ResponseListingsInnerListing | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;
  @Input()
  loan?: Loan200Response | null;
  @Input()
  liquidation?: Liquidation200ResponseLiquidations | null;
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;

  @Output()
  appSubmitCancel: EventEmitter<NftRequest>;
  @Output()
  appSubmitSell: EventEmitter<NftRequest>;

  constructor() {
    this.appSubmitCancel = new EventEmitter();
    this.appSubmitSell = new EventEmitter();
  }

  ngOnInit(): void {}

  onSubmitCancel() {
    if (!this.classID || !this.nftID) {
      return;
    }
    this.appSubmitCancel.emit({ classID: this.classID, nftID: this.nftID });
  }

  onSubmitSell() {
    if (!this.classID || !this.nftID) {
      return;
    }
    this.appSubmitSell.emit({ classID: this.classID, nftID: this.nftID });
  }
}
