import { Component, Input, OnInit } from '@angular/core';
import { BidderNftsInfo } from 'projects/portal/src/app/pages/nft-pawnshop/lenders/lenders.component';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { ListedNfts200ResponseListingsInnerListing } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-lender',
  templateUrl: './lender.component.html',
  styleUrls: ['./lender.component.css'],
})
export class LenderComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  symbolDepositMap?: { [symbol: string]: number } | null;
  @Input()
  symbolLendMap?: { [symbol: string]: number } | null;
  @Input()
  biddingNftsInfo?: BidderNftsInfo | null;
  @Input()
  biddingNfts?: ListedNfts200ResponseListingsInnerListing[] | null;
  @Input()
  nftsMetadata?: Metadata[] | null;
  @Input()
  nftImages?: string[] | null;

  constructor() {}

  ngOnInit(): void {}

  isEmptyObject(obj?: { [symbol: string]: number } | null): boolean {
    if (!obj) {
      return true;
    }
    return Object.keys(obj).length === 0;
  }
}
