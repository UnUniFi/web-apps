import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NftRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  BidderBids200ResponseBidsInner,
  Liquidation200ResponseLiquidations,
  ListedNfts200ResponseListingsInnerListing,
  Loan200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-lister-nft',
  templateUrl: './lister-nft.component.html',
  styleUrls: ['./lister-nft.component.css'],
})
export class ListerNftComponent implements OnInit {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInnerListing | null;
  @Input()
  bids?: BidderBids200ResponseBidsInner[] | null;
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
