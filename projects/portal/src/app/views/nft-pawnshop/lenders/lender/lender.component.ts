import { Component, Input, OnInit } from '@angular/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import { ListedNfts200ResponseListingsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-lender',
  templateUrl: './lender.component.html',
  styleUrls: ['./lender.component.css'],
})
export class LenderComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  biddingNfts?: ListedNfts200ResponseListingsInner[] | null;
  @Input()
  nftsMetadata?: Metadata[] | null;
  @Input()
  nftImages?: string[] | null;

  constructor() {}

  ngOnInit(): void {}
}
