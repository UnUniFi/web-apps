import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlaceBidRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import {
  ListedNfts200ResponseListingsInner,
  BidderBids200ResponseBidsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-place-bid',
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.css'],
})
export class PlaceBidComponent implements OnInit {
  @Input()
  classID?: string | null;
  @Input()
  nftID?: string | null;
  @Input()
  listingInfo?: ListedNfts200ResponseListingsInner | null;
  @Input()
  bidders?: BidderBids200ResponseBidsInner[] | null;

  @Output()
  appSimulate: EventEmitter<PlaceBidRequest>;
  @Output()
  appSubmit: EventEmitter<PlaceBidRequest>;

  constructor() {
    this.appSimulate = new EventEmitter();
    this.appSubmit = new EventEmitter();
  }

  ngOnInit(): void {}

  onSimulate() {
    this.appSimulate.emit();
  }

  onSubmit() {
    this.appSubmit.emit();
  }
}
