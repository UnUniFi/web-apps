import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PlaceBidRequest } from 'projects/portal/src/app/models/nft-pawnshops/nft-pawnshop.model';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
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
  @Input()
  nftMetadata?: Metadata | null;
  @Input()
  nftImage?: string | null;

  depositAmount?: number | null;
  depositDenom?: string | null;
  interestRate?: number | null;
  datePicker?: Date | null;

  @Output()
  appSimulate: EventEmitter<PlaceBidRequest>;
  @Output()
  appSubmit: EventEmitter<PlaceBidRequest>;

  constructor() {
    const lendAmount = localStorage.getItem('lendAmount');
    this.depositAmount = lendAmount ? Number(lendAmount) : null;
    this.depositDenom = localStorage.getItem('lendDenom');
    const lendRate = localStorage.getItem('lendRate');
    this.interestRate = lendRate ? Number(lendRate) : null;
    const lendTerm = localStorage.getItem('lendTerm');
    this.datePicker = lendTerm ? new Date(lendTerm) : null;

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
