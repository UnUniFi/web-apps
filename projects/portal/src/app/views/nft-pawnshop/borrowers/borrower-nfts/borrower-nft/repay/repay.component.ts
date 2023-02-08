import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RepayRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import {
  ListedNfts200ResponseListingsInner,
  BidderBids200ResponseBidsInner,
  Loans200ResponseLoansInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.css'],
})
export class RepayComponent implements OnInit {
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

  @Output()
  appSimulate: EventEmitter<RepayRequest>;
  @Output()
  appSubmit: EventEmitter<RepayRequest>;

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
